import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { downloads } from '@/db/repositorios';
import { apagarArquivo, baixarPoster } from '@/services/arquivos';
import type { Titulo } from '@/types';
import { confirmar } from '@/utils';
import { Botao } from './Botao';

type Fase = 'pronto' | 'baixando' | 'baixado';

export function BotaoBaixar({ titulo }: { titulo: Titulo }) {
  const { usuario } = useAuth();
  const [fase, setFase] = useState<Fase>('pronto');

  // Ao abrir a tela, descobre se este título já foi baixado.
  useEffect(() => {
    if (!usuario) return;
    downloads
      .existe(usuario.id, titulo.fonte, titulo.id)
      .then((ja) => setFase(ja ? 'baixado' : 'pronto'))
      .catch(() => setFase('pronto'));
  }, [usuario, titulo.fonte, titulo.id]);

  async function baixar() {
    if (!usuario) return;
    setFase('baixando');
    try {
      const uri = await baixarPoster(titulo);
      await downloads.registrar(usuario.id, titulo, uri);
      setFase('baixado');
    } catch (e) {
      setFase('pronto');
      Alert.alert('Falha no download', e instanceof Error ? e.message : 'Verifique sua conexão e tente de novo.');
    }
  }

  function remover() {
    confirmar('Remover download', 'O arquivo será apagado deste aparelho.', async () => {
      if (!usuario) return;
      const itens = await downloads.listar(usuario.id);
      const item = itens.find((i) => i.fonte === titulo.fonte && i.tituloId === titulo.id);
      if (item?.arquivoUri) apagarArquivo(item.arquivoUri);
      await downloads.remover(usuario.id, titulo.fonte, titulo.id);
      setFase('pronto');
    });
  }

  if (fase === 'baixado') return <Botao titulo="Baixado" icone="checkmark-circle" variante="secundario" onPress={remover} />;
  return <Botao titulo="Baixar" icone="download-outline" variante="secundario" carregando={fase === 'baixando'} onPress={baixar} />;
}
