import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, radius, spacing } from '@/theme';

// Barra do topo: busca + atalhos para Histórico (relógio) e Downloads (seta).
export function TopoInicio() {
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  return (
    <View style={styles.topo}>
      <Pressable style={styles.busca} onPress={() => router.push('/busca')}>
        <Ionicons name="search-outline" size={22} color={cores.textSoft} />
        <Text style={styles.buscaTexto}>Buscar filmes e séries</Text>
      </Pressable>
      <Pressable hitSlop={8} onPress={() => router.push('/historico')}>
        <Ionicons name="time-outline" size={28} color={cores.text} />
      </Pressable>
      <Pressable hitSlop={8} onPress={() => router.push('/downloads')}>
        <Ionicons name="download-outline" size={28} color={cores.text} />
      </Pressable>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    topo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    busca: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: c.card,
      borderRadius: radius.input,
      paddingHorizontal: spacing.md,
      height: 46,
    },
    buscaTexto: { color: c.textSoft, fontSize: fontSize.texto },
  });
