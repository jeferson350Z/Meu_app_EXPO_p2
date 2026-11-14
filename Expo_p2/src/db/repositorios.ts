import type { Fonte, ItemSalvo, Titulo } from '@/types';
import { getDb } from './banco';

type Tabela = 'historico' | 'favoritos' | 'downloads';
type Basico = Pick<Titulo, 'fonte' | 'id' | 'nome' | 'poster'>;
type Linha = {
  fonte: Fonte;
  titulo_id: number;
  nome: string;
  poster: string | null;
  quando: number;
  arquivo_uri?: string | null;
};

const paraItem = (l: Linha): ItemSalvo => ({
  fonte: l.fonte,
  tituloId: l.titulo_id,
  nome: l.nome,
  poster: l.poster,
  quando: l.quando,
  arquivoUri: l.arquivo_uri ?? null,
});

// O nome da tabela vem do tipo Tabela (nunca do usuário); os valores sempre vão como "?".
async function listar(tabela: Tabela, uid: number, limite = 200) {
  const db = await getDb();
  const extra = tabela === 'downloads' ? ', arquivo_uri' : '';
  const linhas = await db.getAllAsync<Linha>(
    `SELECT fonte, titulo_id, nome, poster, quando${extra} FROM ${tabela} WHERE usuario_id = ? ORDER BY quando DESC LIMIT ?`,
    [uid, limite],
  );
  return linhas.map(paraItem);
}

async function salvar(tabela: Tabela, uid: number, t: Basico, arquivoUri?: string) {
  const db = await getDb();
  if (tabela === 'downloads') {
    await db.runAsync(
      'INSERT OR REPLACE INTO downloads (usuario_id, fonte, titulo_id, nome, poster, quando, arquivo_uri) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, t.fonte, t.id, t.nome, t.poster, Date.now(), arquivoUri ?? ''],
    );
  } else {
    await db.runAsync(
      `INSERT OR REPLACE INTO ${tabela} (usuario_id, fonte, titulo_id, nome, poster, quando) VALUES (?, ?, ?, ?, ?, ?)`,
      [uid, t.fonte, t.id, t.nome, t.poster, Date.now()],
    );
  }
}

async function remover(tabela: Tabela, uid: number, fonte: Fonte, id: number) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM ${tabela} WHERE usuario_id = ? AND fonte = ? AND titulo_id = ?`, [uid, fonte, id]);
}

async function existe(tabela: Tabela, uid: number, fonte: Fonte, id: number) {
  const db = await getDb();
  const r = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM ${tabela} WHERE usuario_id = ? AND fonte = ? AND titulo_id = ?`,
    [uid, fonte, id],
  );
  return (r?.n ?? 0) > 0;
}

async function limpar(tabela: Tabela, uid: number) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM ${tabela} WHERE usuario_id = ?`, [uid]);
}

export const historico = {
  listar: (uid: number, limite = 50) => listar('historico', uid, limite),
  registrar: (uid: number, t: Basico) => salvar('historico', uid, t),
  remover: (uid: number, fonte: Fonte, id: number) => remover('historico', uid, fonte, id),
  limpar: (uid: number) => limpar('historico', uid),
};

export const favoritos = {
  listar: (uid: number) => listar('favoritos', uid),
  existe: (uid: number, fonte: Fonte, id: number) => existe('favoritos', uid, fonte, id),
  // devolve true se virou favorito e false se foi removido
  async alternar(uid: number, t: Basico) {
    if (await existe('favoritos', uid, t.fonte, t.id)) {
      await remover('favoritos', uid, t.fonte, t.id);
      return false;
    }
    await salvar('favoritos', uid, t);
    return true;
  },
  remover: (uid: number, fonte: Fonte, id: number) => remover('favoritos', uid, fonte, id),
};

export const downloads = {
  listar: (uid: number) => listar('downloads', uid),
  existe: (uid: number, fonte: Fonte, id: number) => existe('downloads', uid, fonte, id),
  registrar: (uid: number, t: Basico, arquivoUri: string) => salvar('downloads', uid, t, arquivoUri),
  remover: (uid: number, fonte: Fonte, id: number) => remover('downloads', uid, fonte, id),
  limpar: (uid: number) => limpar('downloads', uid),
};

export async function contagens(uid: number) {
  const [h, f, d] = await Promise.all([
    listar('historico', uid, 1000),
    listar('favoritos', uid, 1000),
    listar('downloads', uid, 1000),
  ]);
  return { historico: h.length, favoritos: f.length, downloads: d.length };
}