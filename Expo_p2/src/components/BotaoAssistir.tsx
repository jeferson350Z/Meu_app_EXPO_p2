import { Alert, Linking } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { historico } from '@/db/repositorios';
import type { Titulo } from '@/types';
import { Botao } from './Botao';

// Registra no histórico (alimenta "Vistos recentemente") e abre a página oficial do título.
export function BotaoAssistir({ titulo }: { titulo: Titulo }) {
  const { usuario } = useAuth();

  async function assistir() {
    try {
      if (usuario) await historico.registrar(usuario.id, titulo);
      if (titulo.url) await Linking.openURL(titulo.url);
      else Alert.alert('Indisponível', 'Este título não tem página oficial para abrir.');
    } catch {
      Alert.alert('Ops', 'Não foi possível abrir este título agora.');
    }
  }

  return <Botao titulo="Assistir" icone="play" onPress={assistir} />;
}
