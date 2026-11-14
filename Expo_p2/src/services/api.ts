import type { Fonte, NovoContato, RespostaContato, Titulo } from '@/types';

// Só variáveis EXPO_PUBLIC_ chegam ao app. Os valores padrão funcionam sem criar o .env.
const TVMAZE = process.env.EXPO_PUBLIC_TVMAZE_URL ?? 'https://api.tvmaze.com';
const ITUNES = process.env.EXPO_PUBLIC_ITUNES_URL ?? 'https://itunes.apple.com';
const CONTATO = process.env.EXPO_PUBLIC_CONTATO_URL ?? 'https://jsonplaceholder.typicode.com';

export class ApiError extends Error {
  status?: number;
  constructor(mensagem: string, status?: number) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const controle = new AbortController();
  const tempo = setTimeout(() => controle.abort(), 12_000);
  try {
    const r = await fetch(url, { ...init, signal: controle.signal });
    if (r.status === 404) throw new ApiError('Conteúdo não encontrado.', 404);
    if (!r.ok) throw new ApiError(`O servidor respondeu com erro (HTTP ${r.status}).`, r.status);
    try {
      return (await r.json()) as T;
    } catch {
      throw new ApiError('O servidor enviou uma resposta inválida.');
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError('A conexão demorou demais. Tente novamente.');
    }
    throw new ApiError('Sem conexão com a internet. Verifique sua rede e tente de novo.');
  } finally {
    clearTimeout(tempo);
  }
}

// ---------- formatos que a API devolve ----------
type TvmazeShow = {
  id: number;
  name: string;
  url?: string;
  genres?: string[];
  premiered?: string | null;
  summary?: string | null;
  rating?: { average: number | null };
  image?: { medium: string; original: string } | null;
  network?: { name: string } | null;
  webChannel?: { name: string } | null;
};

type ItunesItem = {
  trackId: number;
  trackName: string;
  artworkUrl100?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  longDescription?: string;
  shortDescription?: string;
  trackViewUrl?: string;
};

// ---------- conversão para o nosso tipo Titulo ----------
const https = (url?: string | null) => (url ? url.replace(/^http:/, 'https:') : null);
const semHtml = (html?: string | null) => (html ?? '').replace(/<[^>]*>/g, '').trim();

function deTvmaze(s: TvmazeShow): Titulo {
  return {
    id: s.id,
    fonte: 'tvmaze',
    nome: s.name,
    poster: https(s.image?.medium),
    fundo: https(s.image?.original ?? s.image?.medium),
    generos: s.genres ?? [],
    nota: s.rating?.average ?? null,
    ano: s.premiered ? s.premiered.slice(0, 4) : null,
    sinopse: semHtml(s.summary) || 'Sem sinopse disponível.',
    emissora: s.network?.name ?? s.webChannel?.name ?? null,
    url: s.url ?? null,
  };
}

function deItunes(m: ItunesItem): Titulo {
  const poster = m.artworkUrl100 ? m.artworkUrl100.replace('100x100bb', '600x600bb') : null;
  return {
    id: m.trackId,
    fonte: 'itunes',
    nome: m.trackName,
    poster,
    fundo: poster,
    generos: m.primaryGenreName ? [m.primaryGenreName] : [],
    nota: null,
    ano: m.releaseDate ? m.releaseDate.slice(0, 4) : null,
    sinopse: m.longDescription ?? m.shortDescription ?? 'Sem sinopse disponível.',
    emissora: null,
    url: m.trackViewUrl ?? null,
  };
}

// ---------- a porta de entrada única das telas ----------
export const api = {
  // TVMaze: índice de séries paginado (250 por página). Ficamos com as bem avaliadas e com pôster.
  async populares(pagina: number): Promise<Titulo[]> {
    let lista: TvmazeShow[];
    try {
      lista = await req<TvmazeShow[]>(`${TVMAZE}/shows?page=${pagina}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return []; // acabaram as páginas
      throw e;
    }
    return lista
      .filter((s) => s.image && (s.rating?.average ?? 0) >= 7)
      .map(deTvmaze)
      .sort((a, b) => (b.nota ?? 0) - (a.nota ?? 0));
  },

  // Busca por nome: filmes (iTunes) + séries (TVMaze). Se uma das duas cair, mostra a outra.
  async buscar(termo: string): Promise<Titulo[]> {
    const q = encodeURIComponent(termo.trim());
    const [series, filmes] = await Promise.allSettled([
      req<{ show: TvmazeShow }[]>(`${TVMAZE}/search/shows?q=${q}`),
      req<{ results: ItunesItem[] }>(`${ITUNES}/search?term=${q}&media=movie&entity=movie&limit=15&country=BR`),
    ]);
    if (series.status === 'rejected' && filmes.status === 'rejected') throw series.reason;
    const doFilme = filmes.status === 'fulfilled' ? (filmes.value.results ?? []).filter((m) => m.trackId).map(deItunes) : [];
    const daSerie = series.status === 'fulfilled' ? series.value.map((x) => deTvmaze(x.show)) : [];
    return [...doFilme, ...daSerie];
  },

  async detalhe(fonte: Fonte, id: number): Promise<Titulo> {
    if (fonte === 'itunes') {
      const r = await req<{ results: ItunesItem[] }>(`${ITUNES}/lookup?id=${id}&country=BR`);
      const achado = r.results?.[0];
      if (!achado) throw new ApiError('Conteúdo não encontrado.', 404);
      return deItunes(achado);
    }
    return deTvmaze(await req<TvmazeShow>(`${TVMAZE}/shows/${id}`));
  },

  // POST de exemplo (a API de testes aceita e devolve um id).
  enviarContato(c: NovoContato) {
    return req<RespostaContato>(`${CONTATO}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: `Contato de ${c.nome} <${c.email}>`, body: c.mensagem, userId: 1 }),
    });
  },
};