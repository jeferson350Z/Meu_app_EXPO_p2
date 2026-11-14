export type Fonte = 'tvmaze' | 'itunes';

export type Titulo = {
  id: number;
  fonte: Fonte;
  nome: string;
  poster: string | null;
  fundo: string | null;
  generos: string[];
  nota: number | null;
  ano: string | null;
  sinopse: string;
  emissora: string | null;
  url: string | null;
};

export type Usuario = { id: number; nome: string; email: string };

export type ItemSalvo = {
  fonte: Fonte;
  tituloId: number;
  nome: string;
  poster: string | null;
  quando: number;
  arquivoUri: string | null;
};

export type NovoContato = { nome: string; email: string; mensagem: string };
export type RespostaContato = { id: number };
export type ModoTema = 'sistema' | 'claro' | 'escuro';