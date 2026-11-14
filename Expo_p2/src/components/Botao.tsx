import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, radius, spacing } from '@/theme';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  carregando?: boolean;
  desabilitado?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
};

export function Botao({ titulo, onPress, variante = 'primario', carregando = false, desabilitado = false, icone }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const fundo = variante === 'primario' ? cores.primary : variante === 'perigo' ? cores.danger : cores.card;
  const texto = variante === 'secundario' ? cores.text : '#FFFFFF';
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inativo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: fundo, borderColor: variante === 'secundario' ? cores.border : fundo },
        (pressed || inativo) && styles.apagado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={texto} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={20} color={texto} /> : null}
          <Text style={[styles.texto, { color: texto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const estilos = (_c: Cores) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      minHeight: 48,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.input,
      borderWidth: 1,
    },
    texto: { fontSize: fontSize.texto, fontWeight: '700' },
    apagado: { opacity: 0.6 },
  });