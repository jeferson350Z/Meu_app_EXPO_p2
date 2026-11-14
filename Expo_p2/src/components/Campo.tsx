import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, radius, spacing } from '@/theme';

type Props = TextInputProps & { rotulo: string; erro?: string; senha?: boolean };

export function Campo({ rotulo, erro, senha = false, ...resto }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [oculta, setOculta] = useState(senha);

  return (
    <View style={styles.bloco}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={[styles.caixa, erro ? styles.caixaErro : null]}>
        <TextInput
          {...resto}
          style={styles.input}
          placeholderTextColor={cores.textSoft}
          secureTextEntry={oculta}
          autoCapitalize={senha ? 'none' : resto.autoCapitalize}
        />
        {senha ? (
          <Pressable onPress={() => setOculta(!oculta)} hitSlop={8}>
            <Ionicons name={oculta ? 'eye-outline' : 'eye-off-outline'} size={22} color={cores.textSoft} />
          </Pressable>
        ) : null}
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    bloco: { gap: spacing.xs },
    rotulo: { color: c.textSoft, fontSize: fontSize.pequeno, fontWeight: '600' },
    caixa: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.input,
      paddingHorizontal: spacing.md,
      minHeight: 48,
    },
    caixaErro: { borderColor: c.danger },
    input: { flex: 1, color: c.text, fontSize: fontSize.texto, paddingVertical: spacing.sm },
    erro: { color: c.danger, fontSize: fontSize.pequeno },
  });