import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { contagens } from '@/db/repositorios';
import { Cores, fontSize, radius, spacing } from '@/theme';
import { confirmar } from '@/utils';

type Totais = { historico: number; favoritos: number; downloads: number };

export default function Perfil() {
  const { usuario, atualizarPerfil, alterarSenha, sair } = useAuth();
  const styles = useEstilos(estilos);

  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [msgNome, setMsgNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [msgSenha, setMsgSenha] = useState('');
  const [trocando, setTrocando] = useState(false);

  const [totais, setTotais] = useState<Totais>({ historico: 0, favoritos: 0, downloads: 0 });

  useFocusEffect(
    useCallback(() => {
      if (usuario) contagens(usuario.id).then(setTotais).catch(() => {});
    }, [usuario]),
  );

  async function salvarNome() {
    setMsgNome('');
    setSalvando(true);
    try {
      await atualizarPerfil(nome);
      setMsgNome('Nome atualizado!');
    } catch (e) {
      setMsgNome(e instanceof Error ? e.message : 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  async function trocarSenha() {
    setMsgSenha('');
    if (nova !== confirmacao) {
      setMsgSenha('A confirmação não confere com a nova senha.');
      return;
    }
    setTrocando(true);
    try {
      await alterarSenha(atual, nova);
      setAtual('');
      setNova('');
      setConfirmacao('');
      setMsgSenha('Senha alterada com sucesso!');
    } catch (e) {
      setMsgSenha(e instanceof Error ? e.message : 'Não foi possível alterar a senha.');
    } finally {
      setTrocando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.cabecalho}>
          <View style={styles.avatar}>
            <Text style={styles.inicial}>{usuario?.nome.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.email}>{usuario?.email}</Text>
        </View>

        <View style={styles.totais}>
          {[
            ['Vistos', totais.historico],
            ['Minha lista', totais.favoritos],
            ['Downloads', totais.downloads],
          ].map(([rotulo, valor]) => (
            <View key={rotulo} style={styles.total}>
              <Text style={styles.totalNumero}>{valor}</Text>
              <Text style={styles.totalRotulo}>{rotulo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.secao}>Dados pessoais</Text>
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" />
        {msgNome ? <Text style={styles.msg}>{msgNome}</Text> : null}
        <Botao titulo="Salvar nome" onPress={salvarNome} carregando={salvando} />

        <Text style={styles.secao}>Alterar senha</Text>
        <Campo rotulo="Senha atual" senha value={atual} onChangeText={setAtual} />
        <Campo rotulo="Nova senha (mínimo 6 caracteres)" senha value={nova} onChangeText={setNova} />
        <Campo rotulo="Confirmar nova senha" senha value={confirmacao} onChangeText={setConfirmacao} />
        {msgSenha ? <Text style={styles.msg}>{msgSenha}</Text> : null}
        <Botao titulo="Alterar senha" variante="secundario" onPress={trocarSenha} carregando={trocando} />

        <View style={{ height: spacing.md }} />
        <Botao titulo="Sair da conta" variante="perigo" icone="log-out-outline" onPress={() => confirmar('Sair', 'Deseja sair da sua conta?', sair)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
    cabecalho: { alignItems: 'center', gap: spacing.sm },
    avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
    inicial: { color: '#FFFFFF', fontSize: fontSize.grande, fontWeight: '800' },
    email: { color: c.textSoft, fontSize: fontSize.texto },
    totais: { flexDirection: 'row', gap: spacing.sm },
    total: { flex: 1, alignItems: 'center', backgroundColor: c.card, borderRadius: radius.card, paddingVertical: spacing.md },
    totalNumero: { color: c.text, fontSize: fontSize.titulo, fontWeight: '800' },
    totalRotulo: { color: c.textSoft, fontSize: fontSize.pequeno },
    secao: { color: c.text, fontSize: fontSize.subtitulo, fontWeight: '700', marginTop: spacing.sm },
    msg: { color: c.textSoft, fontSize: fontSize.pequeno },
  });
