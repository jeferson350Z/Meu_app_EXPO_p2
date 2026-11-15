import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Estado } from '@/components/Estado';
import { LinhaTitulo } from '@/components/LinhaTitulo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { favoritos } from '@/db/repositorios';
import { Cores, spacing } from '@/theme';
import type { ItemSalvo } from '@/types';

export default function Favoritos() {
  const { usuario } = useAuth();
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [itens, setItens] = useState<ItemSalvo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!usuario) return;
    try {
      setItens(await favoritos.listar(usuario.id));
      setErro(null);
    } catch {
      setErro('Não foi possível ler a sua lista.');
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  async function remover(item: ItemSalvo) {
    if (!usuario) return;
    await favoritos.remover(usuario.id, item.fonte, item.tituloId);
    carregar();
  }

  return (
    <View style={styles.tela}>
      <Estado
        carregando={itens === null && !erro}
        erro={erro}
        vazio={(itens ?? []).length === 0}
        aoTentar={carregar}
        textoVazio="Sua lista está vazia. Toque em Minha lista na tela de um título."
      >
        <FlatList
          data={itens ?? []}
          keyExtractor={(i) => `${i.fonte}-${i.tituloId}`}
          contentContainerStyle={styles.lista}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <LinhaTitulo
              fonte={item.fonte}
              id={item.tituloId}
              nome={item.nome}
              imagem={item.poster}
              subtitulo={item.fonte === 'itunes' ? 'Filme' : 'Série'}
              direita={
                <Pressable hitSlop={8} onPress={() => remover(item)} style={styles.remover}>
                  <Ionicons name="heart" size={22} color={cores.primary} />
                </Pressable>
              }
            />
          )}
        />
      </Estado>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    lista: { padding: spacing.md },
    remover: { padding: spacing.sm },
  });
