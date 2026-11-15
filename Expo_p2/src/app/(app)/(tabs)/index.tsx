import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CartazCard } from '@/components/CartazCard';
import { Estado } from '@/components/Estado';
import { TituloSecao } from '@/components/TituloSecao';
import { useEstilos } from '@/context/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { Cores, spacing } from '@/theme';

export default function Inicio() {
  const styles = useEstilos(estilos);
  // useFetch cuida de loading e erro; comCache guarda a resposta por 5 minutos
  const { dados, loading, erro, recarregar } = useFetch(() => comCache('populares:0', () => api.populares(0)));
  const lista = dados ?? [];

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TituloSecao texto="Populares" />
        <Estado carregando={loading} erro={erro} vazio={lista.length === 0} aoTentar={() => recarregar()}>
          <FlatList
            horizontal
            data={lista}
            keyExtractor={(t) => `${t.fonte}-${t.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fila}
            renderItem={({ item }) => <CartazCard item={item} />}
          />
        </Estado>
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    fila: { paddingHorizontal: spacing.md, gap: spacing.md, alignItems: 'flex-start' },
  });
