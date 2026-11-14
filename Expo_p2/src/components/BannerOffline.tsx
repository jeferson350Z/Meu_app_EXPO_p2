import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEstilos } from '@/context/ThemeContext';
import { useOnline } from '@/hooks/useOnline';
import { Cores, fontSize, spacing } from '@/theme';

export function BannerOffline() {
  const online = useOnline();
  const styles = useEstilos(estilos);
  if (online) return null;
  return (
    <View style={styles.faixa}>
      <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
      <Text style={styles.texto}>Você está offline. Mostrando dados salvos.</Text>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    faixa: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: c.danger,
      paddingVertical: spacing.sm,
    },
    texto: { color: '#FFFFFF', fontSize: fontSize.pequeno, fontWeight: '600' },
  });