import * as Crypto from 'expo-crypto';
import type { Usuario } from '@/types';
import { getDb } from './banco';

export class ErroValidacao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ErroValidacao';
  }
}

type Linha = { id: number; nome: string; email: string; senha_hash: string; sal: string };

const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const gerarHash = (senha: string, sal: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, sal + senha);

function validarSenha(senha: string) {
  if (senha.length < 6) throw new ErroValidacao('A senha precisa ter pelo menos 6 caracteres.');
}

export async function cadastrar(nome: string, email: string, senha: string): Promise<Usuario> {
  const n = nome.trim();
  const e = email.trim().toLowerCase();
  if (n.length < 2) throw new ErroValidacao('Informe seu nome.');
  if (!emailValido(e)) throw new ErroValidacao('Informe um e-mail válido.');
  validarSenha(senha);

  const db = await getDb();
  const existe = await db.getFirstAsync<{ id: number }>('SELECT id FROM usuarios WHERE email = ?', [e]);
  if (existe) throw new ErroValidacao('Este e-mail já está cadastrado.');

  const sal = Crypto.randomUUID();
  const r = await db.runAsync(
    'INSERT INTO usuarios (nome, email, senha_hash, sal, criado_em) VALUES (?, ?, ?, ?, ?)',
    [n, e, await gerarHash(senha, sal), sal, Date.now()],
  );
  return { id: r.lastInsertRowId, nome: n, email: e };
}

export async function entrar(email: string, senha: string): Promise<Usuario> {
  const e = email.trim().toLowerCase();
  if (!emailValido(e) || senha.length === 0) throw new ErroValidacao('Informe e-mail e senha.');

  const db = await getDb();
  const u = await db.getFirstAsync<Linha>('SELECT * FROM usuarios WHERE email = ?', [e]);
  // mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem
  if (!u || (await gerarHash(senha, u.sal)) !== u.senha_hash) {
    throw new ErroValidacao('E-mail ou senha incorretos.');
  }
  return { id: u.id, nome: u.nome, email: u.email };
}

export async function buscarUsuario(id: number): Promise<Usuario | null> {
  const db = await getDb();
  const u = await db.getFirstAsync<Linha>('SELECT * FROM usuarios WHERE id = ?', [id]);
  return u ? { id: u.id, nome: u.nome, email: u.email } : null;
}

export async function atualizarNome(id: number, nome: string): Promise<Usuario> {
  const n = nome.trim();
  if (n.length < 2) throw new ErroValidacao('Informe seu nome.');
  const db = await getDb();
  await db.runAsync('UPDATE usuarios SET nome = ? WHERE id = ?', [n, id]);
  const u = await buscarUsuario(id);
  if (!u) throw new ErroValidacao('Usuário não encontrado.');
  return u;
}

export async function alterarSenha(id: number, atual: string, nova: string) {
  validarSenha(nova);
  const db = await getDb();
  const u = await db.getFirstAsync<Linha>('SELECT * FROM usuarios WHERE id = ?', [id]);
  if (!u || (await gerarHash(atual, u.sal)) !== u.senha_hash) {
    throw new ErroValidacao('A senha atual está incorreta.');
  }
  const sal = Crypto.randomUUID();
  await db.runAsync('UPDATE usuarios SET senha_hash = ?, sal = ? WHERE id = ?', [await gerarHash(nova, sal), sal, id]);
}