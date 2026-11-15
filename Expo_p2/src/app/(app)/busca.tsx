import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Estado } from '@/components/Estado';
import { LinhaTitulo } from '@/components/LinhaTitulo';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '@/hooks/useFetch';
import { api } from '@/services/api';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { Titulo } from '@/types';

type Filtro = 'todos' | 'filme' | 'serie';
const FILTROS: { id: Filtro; texto: string }[] = [
  { id: 'todos', texto: 'Tudo' },
  { id: 'filme', texto: 'Filmes' },
  { id: 'serie', texto: 'Séries' },
];

export default function Busca() {
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const termo = useDebounce(texto.trim(), 500); // espera o usuário parar de digitar

  const { dados, loading, erro, recarregar } = useFetch(
    () => (termo.length < 2 ? Promise.resolve<Titulo[]>([]) : api.buscar(termo)),
    [termo],
  );

  const resultado = (dados ?? []).filter(
    (t) => filtro === 'todos' || (filtro === 'filme' ? t.fonte === 'itunes' : t.fonte === 'tvmaze'),
  );

  return (
    <View style={styles.tela}>
      <View style={styles.caixa}>
        <Ionicons name="search-outline" size={22} color={cores.textSoft} />
        <TextInput
          style={styles.input}
          placeholder="Digite o nome de um filme ou série"
          placeholderTextColor={cores.textSoft}
          value={texto}
          onChangeText={setTexto}
          autoFocus
          returnKeyType="search"
        />
        {texto ? (
          <Pressable hitSlop={8} onPress={() => setTexto('')}>
            <Ionicons name="close-circle" size={20} color={cores.textSoft} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.chips}>
        {FILTROS.map((f) => (
          <Pressable key={f.id} onPress={() => setFiltro(f.id)} style={[styles.chip, filtro === f.id && styles.chipAtivo]}>
            <Text style={[styles.chipTexto, filtro === f.id && styles.chipTextoAtivo]}>{f.texto}</Text>
          </Pressable>
        ))}
      </View>

      {termo.length < 2 ? (
        <Text style={styles.dica}>Digite pelo menos 2 letras para buscar.</Text>
      ) : (
        <Estado
          carregando={loading}
          erro={erro}
          vazio={resultado.length === 0}
          aoTentar={() => recarregar()}
          textoVazio={`Nada encontrado para "${termo}".`}
        >
          <FlatList
            data={resultado}
            keyExtractor={(t) => `${t.fonte}-${t.id}`}
            contentContainerStyle={styles.lista}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            renderItem={({ item }) => (
              <LinhaTitulo
                fonte={item.fonte}
                id={item.id}
                nome={item.nome}
                imagem={item.poster}
                subtitulo={[item.fonte === 'itunes' ? 'Filme' : 'Série', item.ano].filter(Boolean).join(' • ')}
              />
            )}
          />
        </Estado>
      )}
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    caixa: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: c.card,
      borderRadius: radius.input,
      marginHorizontal: spacing.md,
      marginTop: spacing.md,
      paddingHorizontal: spacing.md,
      height: 48,
    },
    input: { flex: 1, color: c.text, fontSize: fontSize.texto },
    chips: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
    chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: c.card },
    chipAtivo: { backgroundColor: c.primary },
    chipTexto: { color: c.textSoft, fontSize: fontSize.pequeno },
    chipTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
    lista: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    dica: { color: c.textSoft, textAlign: 'center', marginTop: spacing.xl },
  });
