import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { useAuth } from '@/context/AuthContext';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, radius, spacing } from '@/theme';
import { confirmar } from '@/utils';

type Opcao = { icone: keyof typeof Ionicons.glyphMap; texto: string; rota: Href };

const OPCOES: Opcao[] = [
  { icone: 'heart-outline', texto: 'Minha lista', rota: '/favoritos' },
  { icone: 'time-outline', texto: 'Histórico', rota: '/historico' },
  { icone: 'download-outline', texto: 'Downloads', rota: '/downloads' },
  { icone: 'settings-outline', texto: 'Configurações', rota: '/configuracoes' },
  { icone: 'help-circle-outline', texto: 'Ajuda', rota: '/ajuda' },
];

export default function Meu() {
  const { usuario, sair } = useAuth();
  const { cores } = useTema();
  const styles = useEstilos(estilos);

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable style={styles.perfil} onPress={() => router.push('/perfil')}>
          <View style={styles.avatar}>
            <Text style={styles.inicial}>{usuario?.nome.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.textos}>
            <Text style={styles.nome}>{usuario?.nome}</Text>
            <Text style={styles.email}>{usuario?.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={cores.textSoft} />
        </Pressable>

        <View style={styles.lista}>
          {OPCOES.map((op) => (
            <Pressable key={op.texto} style={styles.opcao} onPress={() => router.push(op.rota)}>
              <Ionicons name={op.icone} size={24} color={cores.text} />
              <Text style={styles.opcaoTexto}>{op.texto}</Text>
              <Ionicons name="chevron-forward" size={20} color={cores.textSoft} />
            </Pressable>
          ))}
        </View>

        <Botao titulo="Sair da conta" variante="perigo" icone="log-out-outline" onPress={() => confirmar('Sair', 'Deseja sair da sua conta?', sair)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.md },
    perfil: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: c.card, borderRadius: radius.card, padding: spacing.md },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
    inicial: { color: '#FFFFFF', fontSize: fontSize.titulo, fontWeight: '800' },
    textos: { flex: 1 },
    nome: { color: c.text, fontSize: fontSize.subtitulo, fontWeight: '700' },
    email: { color: c.textSoft, fontSize: fontSize.pequeno, marginTop: 2 },
    lista: { backgroundColor: c.card, borderRadius: radius.card },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    opcaoTexto: { flex: 1, color: c.text, fontSize: fontSize.texto },
  });
