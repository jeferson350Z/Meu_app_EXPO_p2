import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '@/components/Botao';
import { useEstilos } from '@/context/ThemeContext';
import { abrirDetalhes } from '@/navegacao';
import { api } from '@/services/api';
import { comCache } from '@/services/cache';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Titulo } from '@/types';

export default function Indicacao() {
  const styles = useEstilos(estilos);
  const [sorteado, setSorteado] = useState<Titulo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function sortear() {
    setCarregando(true);
    setErro('');
    try {
      const pagina = Math.floor(Math.random() * 5);
      const lista = await comCache(`populares:${pagina}`, () => api.populares(pagina));
      if (lista.length === 0) throw new Error('Nenhum título disponível agora. Tente de novo.');
      setSorteado(lista[Math.floor(Math.random() * lista.length)]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível sortear agora.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Indicação</Text>
        <Text style={styles.sub}>Sem ideia do que assistir? Sorteie uma série.</Text>

        {sorteado ? (
          <View style={styles.cartao}>
            {sorteado.poster ? <Image source={{ uri: sorteado.poster }} style={styles.poster} resizeMode="cover" /> : null}
            <Text style={styles.nome}>{sorteado.nome}</Text>
            <Text style={styles.meta}>
              {[sorteado.generos.slice(0, 2).join(' • '), sorteado.ano, sorteado.nota ? `★ ${sorteado.nota.toFixed(1)}` : null]
                .filter(Boolean)
                .join(' • ')}
            </Text>
            <Text numberOfLines={4} style={styles.sinopse}>
              {sorteado.sinopse}
            </Text>
            <Botao titulo="Ver detalhes" variante="secundario" icone="information-circle-outline" onPress={() => abrirDetalhes(sorteado)} />
          </View>
        ) : (
          <Text style={styles.dica}>Nenhum título sorteado ainda.</Text>
        )}

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <Botao titulo={sorteado ? 'Sortear outro' : 'Sortear série'} icone="shuffle" carregando={carregando} onPress={sortear} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.md },
    titulo: { color: c.text, fontSize: fontSize.grande, fontWeight: '800' },
    sub: { color: c.textSoft, fontSize: fontSize.texto },
    dica: { color: c.textSoft, fontSize: fontSize.texto, textAlign: 'center', marginVertical: spacing.xl },
    erro: { color: c.danger, fontSize: fontSize.texto },
    cartao: { backgroundColor: c.card, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
    poster: { width: '100%', height: 320, borderRadius: radius.input },
    nome: { color: c.text, fontSize: fontSize.titulo, fontWeight: '800' },
    meta: { color: c.textSoft, fontSize: fontSize.pequeno },
    sinopse: { color: c.text, fontSize: fontSize.texto, lineHeight: 22 },
  });
