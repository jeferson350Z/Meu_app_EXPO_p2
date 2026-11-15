import { Directory, File, Paths } from 'expo-file-system';
import type { Titulo } from '@/types';

// Baixa o pôster para a pasta de documentos do app (continua disponível offline).
export async function baixarPoster(t: Titulo): Promise<string> {
  if (!t.poster) throw new Error('Este título não tem imagem para baixar.');
  const pasta = new Directory(Paths.document, 'downloads');
  if (!pasta.exists) pasta.create({ idempotent: true });

  const extensao = t.poster.split('?')[0].split('.').pop() ?? 'jpg';
  const destino = new File(pasta, `${t.fonte}-${t.id}.${extensao}`);
  if (destino.exists) destino.delete();

  const arquivo = await File.downloadFileAsync(t.poster, destino);
  return arquivo.uri;
}

export function apagarArquivo(uri: string) {
  try {
    const arquivo = new File(uri);
    if (arquivo.exists) arquivo.delete();
  } catch {
    // arquivo já não existe: nada a fazer
  }
}
