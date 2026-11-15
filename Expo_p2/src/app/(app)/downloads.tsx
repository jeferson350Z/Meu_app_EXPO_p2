import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Estado } from '@/components/Estado';
import { LinhaTitulo } from '@/components/LinhaTitulo';
import { useAuth } from '@/context/AuthContext';
import { useEstilos, useTema } from '@/context/ThemeContext';
import { downloads } from '@/db/repositorios';
import { apagarArquivo } from '@/services/arquivos';
import { Cores, spacing } from '@/theme';
import type { ItemSalvo } from '@/types';
import { confirmar, formatarData } from '@/utils';

export default function Downloads() {
  const { usuario } = useAuth();
  const { cores } = useTema();
  const styles = useEstilos(estilos);
  const [itens, setItens] = useState<ItemSalvo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!usuario) return;
    try {
      setItens(await downloads.listar(usuario.id));
      setErro(null);
    } catch {
      setErro('Não foi possível ler os seus downloads.');
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function remover(item: ItemSalvo) {
    confirmar('Remover download', `Apagar "${item.nome}" deste aparelho?`, async () => {
      if (!usuario) return;
      if (item.arquivoUri) apagarArquivo(item.arquivoUri);
      await downloads.remover(usuario.id, item.fonte, item.tituloId);
      carregar();
    });
  }

  return (
    <View style={styles.tela}>
      <Estado
        carregando={itens === null && !erro}
        erro={erro}
        vazio={(itens ?? []).length === 0}
        aoTentar={carregar}
        textoVazio="Nenhum download ainda. Use o botão Baixar na tela de um título."
      >
        <FlatList
          data={itens ?? []}
          keyExtractor={(i) => `${i.fonte}-${i.tituloId}`}
          contentContainerStyle={styles.lista}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <LinhaTitulo
              fonte={item.fonte}
              id={item.tituloId}
              nome={item.nome}
              // a imagem vem do arquivo salvo no aparelho: funciona sem internet
              imagem={item.arquivoUri || item.poster}
              subtitulo={`Baixado em ${formatarData(item.quando)}`}
              direita={
                <Pressable hitSlop={8} onPress={() => remover(item)} style={styles.remover}>
                  <Ionicons name="trash-outline" size={22} color={cores.danger} />
                </Pressable>
              }
            />
          )}
        />
      </Estado>
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    lista: { padding: spacing.md },
    remover: { padding: spacing.sm },
  });
