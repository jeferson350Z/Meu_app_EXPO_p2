import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as Crypto from 'expo-crypto';
import {
  alterarSenha as alterarSenhaDb,
  atualizarNome,
  buscarUsuario,
  cadastrar as cadastrarDb,
  entrar as entrarDb,
} from '@/db/usuarios';
import { seguro } from '@/services/seguro';
import { CHAVES, storage } from '@/services/storage';
import type { Usuario } from '@/types';

const TOKEN = 'token_sessao';

type Ctx = {
  usuario: Usuario | null;
  pronto: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
  atualizarPerfil: (nome: string) => Promise<void>;
  alterarSenha: (atual: string, nova: string) => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

async function limparSessao() {
  await storage.remove(CHAVES.sessao);
  await seguro.apagar(TOKEN);
  await storage.limparPrefixo(CHAVES.cache); // o próximo a logar não vê dados de cache alheios
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);

  // Boot: lê a sessão salva antes de decidir qual tela mostrar.
  useEffect(() => {
    (async () => {
      try {
        const [salvo, token] = await Promise.all([
          storage.get<Usuario | null>(CHAVES.sessao, null),
          seguro.ler(TOKEN),
        ]);
        // só restaura se existe sessão, token e o usuário ainda está no banco
        const vivo = salvo && token ? await buscarUsuario(salvo.id) : null;
        setUsuario(vivo);
        if (!vivo && (salvo || token)) await limparSessao();
      } catch {
        setUsuario(null);
      } finally {
        setPronto(true);
      }
    })();
  }, []);

  async function iniciarSessao(u: Usuario) {
    await seguro.salvar(TOKEN, Crypto.randomUUID()); // segredo vai no SecureStore
    await storage.set(CHAVES.sessao, u); // dados comuns vão no AsyncStorage
    setUsuario(u);
  }

  async function entrar(email: string, senha: string) {
    await iniciarSessao(await entrarDb(email, senha));
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    await iniciarSessao(await cadastrarDb(nome, email, senha));
  }

  async function sair() {
    await limparSessao();
    setUsuario(null);
  }

  async function atualizarPerfil(nome: string) {
    if (!usuario) return;
    const novo = await atualizarNome(usuario.id, nome);
    await storage.set(CHAVES.sessao, novo);
    setUsuario(novo);
  }

  async function alterarSenha(atual: string, nova: string) {
    if (!usuario) return;
    await alterarSenhaDb(usuario.id, atual, nova);
  }

  return (
    <AuthCtx.Provider value={{ usuario, pronto, entrar, cadastrar, sair, atualizarPerfil, alterarSenha }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}