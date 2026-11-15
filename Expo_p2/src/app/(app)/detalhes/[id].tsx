import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { BotaoAssistir } from '@/components/BotaoAssistir';
import { Estado } from '@/components/Estado';
import { useEstilos } from '@/context/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Fonte } from '@/types';

export default function Detalhes() {
  // O id (e a fonte) chegam pela rota: /detalhes/169?fonte=tvmaze
  const { id, fonte } = useLocalSearchParams<{ id: string; fonte?: string }>();
  const origem: Fonte = fonte === 'itunes' ? 'itunes' : 'tvmaze';
  const styles = useEstilos(estilos);

  const { dados: titulo, loading, erro, recarregar } = useFetch(() => api.detalhe(origem, Number(id)), [id, origem]);

  return (
    <View style={styles.tela}>
      <Stack.Screen options={{ title: titulo?.nome ?? 'Detalhes' }} />
      <Estado carregando={loading} erro={erro} vazio={!titulo} aoTentar={() => recarregar()}>
        {titulo ? (
          <ScrollView contentContainerStyle={styles.conteudo}>
            {titulo.fundo ? <Image source={{ uri: titulo.fundo }} style={styles.capa} resizeMode="cover" /> : <View style={styles.capa} />}

            <Text style={styles.nome}>{titulo.nome}</Text>
            <Text style={styles.meta}>
              {[
                origem === 'itunes' ? 'Filme' : 'Série',
                titulo.generos.slice(0, 3).join(', '),
                titulo.ano,
                titulo.emissora,
                titulo.nota ? `★ ${titulo.nota.toFixed(1)}` : null,
              ]
                .filter(Boolean)
                .join(' • ')}
            </Text>

            <View style={styles.acoes}>
              <BotaoAssistir titulo={titulo} />
            </View>

            <Text style={styles.secao}>Sinopse</Text>
            <Text style={styles.sinopse}>{titulo.sinopse}</Text>
          </ScrollView>
        ) : null}
      </Estado>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.md },
    capa: { width: '100%', height: 420, borderRadius: radius.card, backgroundColor: c.card },
    nome: { color: c.text, fontSize: fontSize.grande, fontWeight: '800' },
    meta: { color: c.textSoft, fontSize: fontSize.pequeno },
    acoes: { gap: spacing.sm },
    secao: { color: c.text, fontSize: fontSize.titulo, fontWeight: '700', marginTop: spacing.sm },
    sinopse: { color: c.textSoft, fontSize: fontSize.texto, lineHeight: 24 },
  });
