import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEstilos } from '@/context/ThemeContext';
import { abrirDetalhes } from '@/navegacao';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Titulo } from '@/types';

type Props = { item: Titulo; largura?: number };

export function CartazCard({ item, largura = 130 }: Props) {
  const styles = useEstilos(estilos);
  return (
    <Pressable onPress={() => abrirDetalhes(item)} style={{ width: largura }}>
      <View style={[styles.cartaz, { height: largura * 1.45 }]}>
        {item.poster ? (
          <Image source={{ uri: item.poster }} style={styles.imagem} resizeMode="cover" />
        ) : (
          <Text style={styles.semImagem}>{item.nome}</Text>
        )}
        {item.nota ? (
          // position: absolute sobrepõe o selo ao pôster (Aula 7)
          <View style={styles.selo}>
            <Text style={styles.seloTexto}>★ {item.nota.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={styles.legenda}>
        {item.nome}
      </Text>
    </Pressable>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    cartaz: {
      backgroundColor: c.card,
      borderRadius: radius.card,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.sm,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    },
    imagem: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    semImagem: { color: c.textSoft, textAlign: 'center', fontWeight: '700' },
    selo: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.75)',
      borderRadius: radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    seloTexto: { color: '#FFD54F', fontSize: 12, fontWeight: '800' },
    legenda: { color: c.textSoft, fontSize: fontSize.pequeno, marginTop: spacing.sm },
  });
