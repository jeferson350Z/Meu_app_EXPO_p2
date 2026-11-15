import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerOffline } from '@/components/BannerOffline';
import { Estado } from '@/components/Estado';
import { LinhaTitulo } from '@/components/LinhaTitulo';
import { useEstilos } from '@/context/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { Cores, fontSize, spacing } from '@/theme';

export default function Tendencias() {
  const styles = useEstilos(estilos);
  const { dados, loading, erro, recarregar } = useFetch(() => comCache('populares:1', () => api.populares(1)));
  const ranking = (dados ?? []).slice(0, 25);

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <BannerOffline />
      <Text style={styles.titulo}>Tendências</Text>
      <Text style={styles.sub}>As séries mais bem avaliadas</Text>
      <Estado carregando={loading} erro={erro} vazio={ranking.length === 0} aoTentar={() => recarregar()}>
        <FlatList
          data={ranking}
          keyExtractor={(t) => `${t.fonte}-${t.id}`}
          contentContainerStyle={styles.lista}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item, index }) => (
            <LinhaTitulo
              fonte={item.fonte}
              id={item.id}
              nome={item.nome}
              imagem={item.poster}
              posicao={index + 1}
              subtitulo={[item.generos.slice(0, 2).join(' • '), item.ano].filter(Boolean).join(' • ')}
              direita={item.nota ? <Text style={styles.nota}>★ {item.nota.toFixed(1)}</Text> : null}
            />
          )}
        />
      </Estado>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    titulo: { color: c.text, fontSize: fontSize.grande, fontWeight: '800', marginHorizontal: spacing.md, marginTop: spacing.md },
    sub: { color: c.textSoft, fontSize: fontSize.pequeno, marginHorizontal: spacing.md, marginBottom: spacing.sm },
    lista: { padding: spacing.md },
    nota: { color: c.gold, fontSize: fontSize.texto, fontWeight: '800', paddingRight: spacing.sm },
  });
