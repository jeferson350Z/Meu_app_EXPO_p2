import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { api } from '@/services/api';
import { Cores, fontSize, spacing } from '@/theme';
import { Botao } from './Botao';
import { Campo } from './Campo';

// POST para a API: envia a mensagem e mostra o protocolo devolvido pelo servidor.
export function FormContato() {
  const { usuario } = useAuth();
  const styles = useEstilos(estilos);
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  async function enviar() {
    setErro('');
    setResposta('');
    if (mensagem.trim().length < 10) {
      setErro('Escreva pelo menos 10 caracteres para a gente entender o seu problema.');
      return;
    }
    setEnviando(true);
    try {
      const r = await api.enviarContato({ nome: usuario?.nome ?? '', email: usuario?.email ?? '', mensagem: mensagem.trim() });
      setResposta(`Mensagem enviada! Protocolo #${r.id}.`);
      setMensagem('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível enviar agora.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.bloco}>
      <Text style={styles.titulo}>Fale conosco</Text>
      <Campo rotulo="Sua mensagem" value={mensagem} onChangeText={setMensagem} multiline numberOfLines={4} textAlignVertical="top" />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      {resposta ? <Text style={styles.ok}>{resposta}</Text> : null}
      <Botao titulo="Enviar mensagem" icone="send" onPress={enviar} carregando={enviando} />
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    bloco: { gap: spacing.md, marginTop: spacing.md },
    titulo: { color: c.text, fontSize: fontSize.subtitulo, fontWeight: '700' },
    erro: { color: c.danger, fontSize: fontSize.pequeno },
    ok: { color: c.success, fontSize: fontSize.texto, fontWeight: '600' },
  });
