import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAuth } from '@/context/AuthContext';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { downloads, historico } from '@/db/repositorios';
import { apagarArquivo } from '@/services/arquivos';
import { CHAVES, storage } from '@/services/storage';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { ModoTema } from '@/types';
import { confirmar } from '@/utils';

const MODOS: { id: ModoTema; texto: string; icone: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'sistema', texto: 'Sistema', icone: 'phone-portrait-outline' },
  { id: 'claro', texto: 'Claro', icone: 'sunny-outline' },
  { id: 'escuro', texto: 'Escuro', icone: 'moon-outline' },
];

export default function Configuracoes() {
  const { usuario } = useAuth();
  const { cores, modo, setModo } = useTema();
  const styles = useEstilos(estilos);

  function limparCache() {
    confirmar('Limpar cache', 'As listas serão baixadas de novo na próxima vez.', async () => {
      await storage.limparPrefixo(CHAVES.cache);
      Alert.alert('Pronto', 'Cache limpo.');
    });
  }

  function limparHistorico() {
    confirmar('Limpar histórico', 'Todos os títulos vistos serão apagados.', async () => {
      if (usuario) await historico.limpar(usuario.id);
      Alert.alert('Pronto', 'Histórico apagado.');
    });
  }

  function apagarDownloads() {
    confirmar('Apagar downloads', 'Os arquivos baixados serão removidos deste aparelho.', async () => {
      if (!usuario) return;
      const itens = await downloads.listar(usuario.id);
      itens.forEach((i) => i.arquivoUri && apagarArquivo(i.arquivoUri));
      await downloads.limpar(usuario.id);
      Alert.alert('Pronto', 'Downloads removidos.');
    });
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.secao}>Aparência</Text>
      <View style={styles.modos}>
        {MODOS.map((m) => {
          const ativo = m.id === modo;
          return (
            <Pressable key={m.id} onPress={() => setModo(m.id)} style={[styles.modo, ativo && styles.modoAtivo]}>
              <Ionicons name={m.icone} size={22} color={ativo ? '#FFFFFF' : cores.textSoft} />
              <Text style={[styles.modoTexto, ativo && styles.modoTextoAtivo]}>{m.texto}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.secao}>Dados do aparelho</Text>
      <View style={styles.lista}>
        {[
          { texto: 'Limpar cache da API', icone: 'refresh-outline' as const, acao: limparCache },
          { texto: 'Limpar histórico', icone: 'time-outline' as const, acao: limparHistorico },
          { texto: 'Apagar downloads', icone: 'trash-outline' as const, acao: apagarDownloads },
        ].map((op) => (
          <Pressable key={op.texto} style={styles.opcao} onPress={op.acao}>
            <Ionicons name={op.icone} size={22} color={cores.text} />
            <Text style={styles.opcaoTexto}>{op.texto}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.secao}>Sobre</Text>
      <Text style={styles.sobre}>
        {Constants.expoConfig?.name ?? 'App'} • versão {Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
      <Text style={styles.sobre}>Dados de séries: TVMaze. Dados de filmes: iTunes Search.</Text>
    </ScrollView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
    secao: { color: c.text, fontSize: fontSize.subtitulo, fontWeight: '700', marginTop: spacing.sm },
    modos: { flexDirection: 'row', gap: spacing.sm },
    modo: { flex: 1, alignItems: 'center', gap: spacing.xs, backgroundColor: c.card, borderRadius: radius.card, paddingVertical: spacing.md },
    modoAtivo: { backgroundColor: c.primary },
    modoTexto: { color: c.textSoft, fontSize: fontSize.pequeno },
    modoTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
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
    sobre: { color: c.textSoft, fontSize: fontSize.pequeno },
  });
