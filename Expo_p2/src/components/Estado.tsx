import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, spacing } from '@/theme';
import { Botao } from './Botao';

type Props = {
  carregando: boolean;
  erro: string | null;
  vazio: boolean;
  aoTentar: () => void;
  textoVazio?: string;
  children: ReactNode;
};

// Os 4 estados de toda tela com dados: carregando, erro, vazio e sucesso (children).
export function Estado({ carregando, erro, vazio, aoTentar, textoVazio = 'Nada por aqui ainda.', children }: Props) {
  const { cores } = useTema();
  const styles = useEstilos(estilos);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primary} />
        <Text style={styles.suave}>Carregando…</Text>
      </View>
    );
  }
  if (erro) {
    return (
      <View style={styles.centro}>
        <Ionicons name="cloud-offline-outline" size={48} color={cores.textSoft} />
        <Text style={styles.texto}>{erro}</Text>
        <Botao titulo="Tentar de novo" variante="secundario" icone="refresh" onPress={aoTentar} />
      </View>
    );
  }
  if (vazio) {
    return (
      <View style={styles.centro}>
        <Ionicons name="film-outline" size={48} color={cores.textSoft} />
        <Text style={styles.suave}>{textoVazio}</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    centro: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
    texto: { color: c.text, fontSize: fontSize.texto, textAlign: 'center' },
    suave: { color: c.textSoft, fontSize: fontSize.texto, textAlign: 'center' },
  });