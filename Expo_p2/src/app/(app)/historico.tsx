import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useFocusEffect } from 'expo-router';
import { Estado } from '@/components/Estado';
import { LinhaTitulo } from '@/components/LinhaTitulo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { historico } from '@/db/repositorios';
import { Cores, fontSize, spacing } from '@/theme';
import type { ItemSalvo } from '@/types';
import { confirmar, formatarData } from '@/utils';

export default function Historico() {
  const { usuario } = useAuth();
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [itens, setItens] = useState<ItemSalvo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!usuario) return;
    try {
      setItens(await historico.listar(usuario.id, 100));
      setErro(null);
    } catch {
      setErro('Não foi possível ler o seu histórico.');
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function limpar() {
    confirmar('Limpar histórico', 'Todos os títulos vistos serão apagados da lista.', async () => {
      if (!usuario) return;
      await historico.limpar(usuario.id);
      carregar();
    });
  }

  async function remover(item: ItemSalvo) {
    if (!usuario) return;
    await historico.remover(usuario.id, item.fonte, item.tituloId);
    carregar();
  }

  return (
    <View style={styles.tela}>
      <Stack.Screen
        options={{
          headerRight: () =>
            itens && itens.length > 0 ? (
              <Pressable onPress={limpar} hitSlop={8}>
                <Text style={styles.limpar}>Limpar</Text>
              </Pressable>
            ) : null,
        }}
      />
      <Estado
        carregando={itens === null && !erro}
        erro={erro}
        vazio={(itens ?? []).length === 0}
        aoTentar={carregar}
        textoVazio="Você ainda não assistiu nada. Toque em Assistir num título para ele aparecer aqui."
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
              subtitulo={`Visto em ${formatarData(item.quando)}`}
              direita={
                <Pressable hitSlop={8} onPress={() => remover(item)} style={styles.remover}>
                  <Ionicons name="close" size={22} color={cores.textSoft} />
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
    limpar: { color: c.primary, fontSize: fontSize.texto, fontWeight: '700' },
    remover: { padding: spacing.sm },
  });
