import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEstilos } from '@/context/ThemeContext';
import { Cores, fontSize, spacing } from '@/theme';

type Props = { texto: string; acao?: string; aoPressionar?: () => void };

export function TituloSecao({ texto, acao, aoPressionar }: Props) {
  const styles = useEstilos(estilos);
  return (
    <View style={styles.linha}>
      <Text style={styles.titulo}>{texto}</Text>
      {acao ? (
        <Pressable onPress={aoPressionar} hitSlop={8}>
          <Text style={styles.acao}>{acao}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    titulo: { color: c.text, fontSize: fontSize.titulo, fontWeight: '700' },
    acao: { color: c.primary, fontSize: fontSize.pequeno, fontWeight: '700' },
  });
