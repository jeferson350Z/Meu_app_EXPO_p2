import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerOffline } from '@/components/BannerOffline';
import { CartazCard } from '@/components/CartazCard';
import { Estado } from '@/components/Estado';
import { useEstilos } from '@/context/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { Cores, fontSize, radius, spacing } from '@/theme';

const COLUNAS = 3;

export default function Explorar() {
  const styles = useEstilos(estilos);
  const { width } = useWindowDimensions();
  const [genero, setGenero] = useState<string | null>(null);
  const { dados, loading, erro, recarregar } = useFetch(() => comCache('populares:2', () => api.populares(2)));

  const todos = dados ?? [];
  const generos = Array.from(new Set(todos.flatMap((t) => t.generos))).sort();
  const lista = genero ? todos.filter((t) => t.generos.includes(genero)) : todos;
  const largura = (width - spacing.md * 2 - spacing.md * (COLUNAS - 1)) / COLUNAS;

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <BannerOffline />
      <Text style={styles.titulo}>Explorar</Text>
      <Estado carregando={loading} erro={erro} vazio={todos.length === 0} aoTentar={() => recarregar()}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsLinha} contentContainerStyle={styles.chips}>
          {generos.map((g) => {
            const ativo = g === genero;
            return (
              <Pressable key={g} onPress={() => setGenero(ativo ? null : g)} style={[styles.chip, ativo && styles.chipAtivo]}>
                <Text style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}>{g}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <FlatList
          data={lista}
          numColumns={COLUNAS}
          keyExtractor={(t) => `${t.fonte}-${t.id}`}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={styles.grade}
          renderItem={({ item }) => <CartazCard item={item} largura={largura} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum título neste gênero.</Text>}
        />
      </Estado>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    titulo: { color: c.text, fontSize: fontSize.grande, fontWeight: '800', marginHorizontal: spacing.md, marginTop: spacing.md },
    chipsLinha: { flexGrow: 0, flexShrink: 0 },
    chips: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm },
    chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: c.card },
    chipAtivo: { backgroundColor: c.primary },
    chipTexto: { color: c.textSoft, fontSize: fontSize.pequeno },
    chipTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
    grade: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
    vazio: { color: c.textSoft, textAlign: 'center', marginTop: spacing.xl },
  });
