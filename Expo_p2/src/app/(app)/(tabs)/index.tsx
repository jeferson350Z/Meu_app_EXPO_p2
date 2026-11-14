import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '@/components/Botao';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { Cores, fontSize, spacing } from '@/theme';

export default function Inicio() {
  const { usuario, sair } = useAuth();
  const styles = useEstilos(estilos);

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.centro}>
        <Text style={styles.ola}>Olá, {usuario?.nome}!</Text>
        <Text style={styles.sub}>Login, cadastro e sessão funcionando. As telas do app chegam na Parte 2.</Text>
        <Botao titulo="Sair" variante="perigo" icone="log-out-outline" onPress={sair} />
      </View>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    centro: { flex: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
    ola: { color: c.text, fontSize: fontSize.grande, fontWeight: '800' },
    sub: { color: c.textSoft, fontSize: fontSize.texto },
  });