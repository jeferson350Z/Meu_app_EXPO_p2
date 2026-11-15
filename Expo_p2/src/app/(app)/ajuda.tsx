import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FormContato } from '@/components/FormContato';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { Cores, fontSize, radius, spacing } from '@/theme';

const PERGUNTAS = [
  { p: 'Como baixo um título?', r: 'Abra o título e toque em Baixar. O pôster fica salvo no aparelho e aparece em Downloads, mesmo sem internet.' },
  { p: 'Onde vejo o que já assisti?', r: 'Toque no relógio no topo do Início, ou vá em Meu > Histórico. Os últimos títulos também aparecem em Vistos recentemente.' },
  { p: 'O app funciona offline?', r: 'Sim, em parte: listas já carregadas ficam salvas por alguns minutos e os downloads continuam disponíveis. Um aviso vermelho indica quando você está sem conexão.' },
  { p: 'Como troco para o tema escuro?', r: 'Vá em Meu > Configurações > Aparência e escolha Claro, Escuro ou Sistema. A escolha fica salva.' },
  { p: 'Esqueci a minha senha. E agora?', r: 'Seus dados ficam só neste aparelho. Se ainda estiver logado, troque a senha em Meu > Perfil. Se não, crie uma nova conta com outro e-mail.' },
];

export default function Ajuda() {
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Perguntas frequentes</Text>
        {PERGUNTAS.map((item, i) => {
          const ativa = aberta === i;
          return (
            <Pressable key={item.p} style={styles.item} onPress={() => setAberta(ativa ? null : i)}>
              <View style={styles.linha}>
                <Text style={styles.pergunta}>{item.p}</Text>
                <Ionicons name={ativa ? 'chevron-up' : 'chevron-down'} size={20} color={cores.textSoft} />
              </View>
              {ativa ? <Text style={styles.resposta}>{item.r}</Text> : null}
            </Pressable>
          );
        })}

        <FormContato />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
    titulo: { color: c.text, fontSize: fontSize.subtitulo, fontWeight: '700', marginBottom: spacing.xs },
    item: { backgroundColor: c.card, borderRadius: radius.card, padding: spacing.md, gap: spacing.sm },
    linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
    pergunta: { flex: 1, color: c.text, fontSize: fontSize.texto, fontWeight: '600' },
    resposta: { color: c.textSoft, fontSize: fontSize.texto, lineHeight: 22 },
  });
