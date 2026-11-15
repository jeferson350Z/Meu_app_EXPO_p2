import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { favoritos } from '@/db/repositorios';
import type { Titulo } from '@/types';
import { Botao } from './Botao';

export function BotaoFavorito({ titulo }: { titulo: Titulo }) {
  const { usuario } = useAuth();
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    favoritos
      .existe(usuario.id, titulo.fonte, titulo.id)
      .then(setFavorito)
      .catch(() => setFavorito(false));
  }, [usuario, titulo.fonte, titulo.id]);

  async function alternar() {
    if (!usuario) return;
    try {
      setFavorito(await favoritos.alternar(usuario.id, titulo));
    } catch {
      Alert.alert('Ops', 'Não foi possível atualizar a sua lista.');
    }
  }

  return (
    <Botao
      titulo={favorito ? 'Na minha lista' : 'Minha lista'}
      icone={favorito ? 'checkmark' : 'add'}
      variante="secundario"
      onPress={alternar}
    />
  );
}
