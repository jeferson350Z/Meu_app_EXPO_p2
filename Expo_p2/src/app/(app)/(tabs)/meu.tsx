import { StyleSheet, Text, View } from 'react-native';
import { useEstilos } from '@/context/ThemeContext';
import { Cores, fontSize } from '@/theme';

export default function Meu() {
  const styles = useEstilos(estilos);
  return (
    <View style={styles.tela}>
      <Text style={styles.texto}>Meu</Text>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.background },
    texto: { color: c.text, fontSize: fontSize.titulo },
  });
