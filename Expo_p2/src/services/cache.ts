import { CHAVES, storage } from './storage';

type Entrada<T> = { dados: T; salvoEm: number };

// Stale-while-revalidate com validade: dado fresco vem do disco; dado velho só é usado se a API falhar.
export async function comCache<T>(
  chave: string,
  buscar: () => Promise<T>,
  ttlMs = 5 * 60_000,
): Promise<T> {
  const k = CHAVES.cache + chave;
  const guardado = await storage.get<Entrada<T> | null>(k, null);
  if (guardado && Date.now() - guardado.salvoEm < ttlMs) return guardado.dados;
  try {
    const dados = await buscar();
    await storage.set(k, { dados, salvoEm: Date.now() }).catch(() => {});
    return dados;
  } catch (e) {
    if (guardado) return guardado.dados; // offline: usa o dado antigo
    throw e;
  }
}