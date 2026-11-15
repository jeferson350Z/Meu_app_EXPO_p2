import { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEstilos } from '@/context/ThemeContext';
import { abrirDetalhes } from '@/navegacao';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Fonte } from '@/types';

type Props = {
  fonte: Fonte;
  id: number;
  nome: string;
  imagem: string | null;
  subtitulo?: string;
  posicao?: number;
  direita?: ReactNode;
};

// Linha reutilizada em Busca, Tendências, Histórico, Downloads e Minha lista.
export function LinhaTitulo({ fonte, id, nome, imagem, subtitulo, posicao, direita }: Props) {
  const styles = useEstilos(estilos);
  return (
    <Pressable style={styles.linha} onPress={() => abrirDetalhes({ id, fonte })}>
      {posicao ? <Text style={styles.posicao}>{posicao}</Text> : null}
      {imagem ? <Image source={{ uri: imagem }} style={styles.miniatura} /> : <View style={styles.miniatura} />}
      <View style={styles.textos}>
        <Text numberOfLines={2} style={styles.nome}>
          {nome}
        </Text>
        {subtitulo ? (
          <Text numberOfLines={1} style={styles.subtitulo}>
            {subtitulo}
          </Text>
        ) : null}
      </View>
      {direita}
    </Pressable>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: c.card,
      borderRadius: radius.card,
      padding: spacing.sm,
    },
    posicao: { color: c.primary, fontSize: 24, fontWeight: '800', width: 30, textAlign: 'center' },
    miniatura: { width: 54, height: 78, borderRadius: radius.input, backgroundColor: c.border },
    textos: { flex: 1, gap: spacing.xs },
    nome: { color: c.text, fontSize: fontSize.texto, fontWeight: '700' },
    subtitulo: { color: c.textSoft, fontSize: fontSize.pequeno },
  });
