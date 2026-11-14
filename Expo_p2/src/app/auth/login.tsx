import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { Cores, fontSize, spacing } from '@/theme';

export default function Login() {
  const { entrar } = useAuth();
  const styles = useEstilos(estilos);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    setErro('');
    setCarregando(true);
    try {
      await entrar(email, senha);
      router.replace('/');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Text style={styles.marca}>STREAMING</Text>
          <Text style={styles.titulo}>Entrar</Text>
          <Text style={styles.sub}>Acesse sua conta para continuar.</Text>

          <Campo rotulo="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Campo rotulo="Senha" senha value={senha} onChangeText={setSenha} onSubmitEditing={aoEntrar} />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Botao titulo="Entrar" onPress={aoEntrar} carregando={carregando} />

          <Link href="/cadastro" asChild>
            <Pressable>
              <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
    marca: { color: c.primary, fontSize: fontSize.titulo, fontWeight: '900', letterSpacing: 4, textAlign: 'center' },
    titulo: { color: c.text, fontSize: fontSize.grande, fontWeight: '800', marginTop: spacing.md },
    sub: { color: c.textSoft, fontSize: fontSize.texto, marginBottom: spacing.sm },
    erro: { color: c.danger, fontSize: fontSize.texto },
    link: { color: c.primary, fontSize: fontSize.texto, fontWeight: '600', textAlign: 'center', marginTop: spacing.sm },
  });