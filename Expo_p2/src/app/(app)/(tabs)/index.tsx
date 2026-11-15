import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BannerOffline } from '@/components/BannerOffline';
import { CartazCard } from '@/components/CartazCard';
import { Estado } from '@/components/Estado';
import { TituloSecao } from '@/components/TituloSecao';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { useFetch } from '@/hooks/useFetch';
import { useOnline } from '@/hooks/useOnline';
import { abrirDetalhes } from '@/navegacao';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Titulo } from '@/types';

export default function Inicio() {
  const styles = useEstilos(estilos);
  const { cores } = useTema();
  const online = useOnline();
  const forcar = useRef(false);
  const antes = useRef(online);

  // Página 0 vem com cache de 5 minutos (e do disco se estiver offline).
  const primeira = useFetch(() => comCache('populares:0', () => api.populares(0), forcar.current ? 0 : undefined));
  const [extras, setExtras] = useState<Titulo[]>([]);
  const [proxima, setProxima] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [fim, setFim] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const base = primeira.dados ?? [];
  const lista = [...base, ...extras];
  const destaque = lista[0];

  // Ao reconectar, busca de novo sem mostrar spinner.
  useEffect(() => {
    if (!antes.current && online) primeira.recarregar(true);
    antes.current = online;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  async function atualizar() {
    setAtualizando(true);
    forcar.current = true; // ignora o cache: o usuário pediu dados novos
    setExtras([]);
    setProxima(1);
    setFim(false);
    await primeira.recarregar(true);
    forcar.current = false;
    setAtualizando(false);
  }

  async function carregarMais() {
    if (carregandoMais || fim || primeira.loading || base.length === 0) return;
    setCarregandoMais(true);
    try {
      const mais = await api.populares(proxima);
      if (mais.length === 0) setFim(true);
      setExtras((atual) => [...atual, ...mais]);
      setProxima(proxima + 1);
    } catch {
      // falhou ao paginar: mantém o que já está na tela
    } finally {
      setCarregandoMais(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <BannerOffline />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} tintColor={cores.primary} colors={[cores.primary]} />}
      >
        {destaque ? (
          <Pressable style={styles.destaque} onPress={() => abrirDetalhes(destaque)}>
            {destaque.fundo ? <Image source={{ uri: destaque.fundo }} style={styles.destaqueImg} resizeMode="cover" /> : null}
            <View style={styles.destaqueRodape}>
              <Text numberOfLines={1} style={styles.destaqueTitulo}>
                {destaque.nome}
              </Text>
              {destaque.nota ? <Text style={styles.destaqueNota}>★ {destaque.nota.toFixed(1)}</Text> : null}
            </View>
          </Pressable>
        ) : null}

        <TituloSecao texto="Populares" />
        <Estado
          carregando={primeira.loading && !primeira.dados}
          erro={primeira.dados ? null : primeira.erro}
          vazio={lista.length === 0}
          aoTentar={() => primeira.recarregar()}
          textoVazio="Nenhum título encontrado."
        >
          <FlatList
            horizontal
            data={lista}
            keyExtractor={(t) => `${t.fonte}-${t.id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fila}
            renderItem={({ item }) => <CartazCard item={item} />}
            onEndReached={carregarMais}
            onEndReachedThreshold={0.4}
            ListFooterComponent={carregandoMais ? <ActivityIndicator color={cores.primary} /> : undefined}
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
    destaque: {
      height: 210,
      marginHorizontal: spacing.md,
      marginTop: spacing.sm,
      borderRadius: radius.card,
      overflow: 'hidden',
      backgroundColor: c.card,
      justifyContent: 'flex-end',
    },
    destaqueImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    destaqueRodape: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0,0,0,0.65)',
      padding: spacing.md,
    },
    destaqueTitulo: { flex: 1, color: '#FFFFFF', fontSize: fontSize.subtitulo, fontWeight: '800' },
    destaqueNota: { color: '#FFD54F', fontSize: fontSize.texto, fontWeight: '800' },
  });
