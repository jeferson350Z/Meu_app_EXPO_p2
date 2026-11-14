import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { Cores, fontSize, spacing } from '@/theme';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const styles = useEstilos(estilos);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoCadastrar() {
    setErro('');
    if (senha !== confirmacao) {
      setErro('As senhas não conferem.');
      return;
    }
    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
      router.replace('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível criar a conta.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.sub}>Seus dados ficam salvos só neste aparelho.</Text>

          <Campo rotulo="Nome" value={nome} onChangeText={setNome} autoCapitalize="words" />
          <Campo rotulo="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Campo rotulo="Senha (mínimo 6 caracteres)" senha value={senha} onChangeText={setSenha} />
          <Campo rotulo="Confirmar senha" senha value={confirmacao} onChangeText={setConfirmacao} onSubmitEditing={aoCadastrar} />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Botao titulo="Cadastrar" onPress={aoCadastrar} carregando={carregando} />

          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Já tem conta? Entrar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
    titulo: { color: c.text, fontSize: fontSize.grande, fontWeight: '800' },
    sub: { color: c.textSoft, fontSize: fontSize.texto, marginBottom: spacing.sm },
    erro: { color: c.danger, fontSize: fontSize.texto },
    link: { color: c.primary, fontSize: fontSize.texto, fontWeight: '600', textAlign: 'center', marginTop: spacing.sm },
  });