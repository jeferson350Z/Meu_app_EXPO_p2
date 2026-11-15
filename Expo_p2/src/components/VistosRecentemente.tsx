import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useEstilos } from '@/context/ThemeContext';
import { historico } from '@/db/repositorios';
import { abrirDetalhes } from '@/navegacao';
import { Cores, fontSize, radius, spacing } from '@/theme';
import type { ItemSalvo } from '@/types';
import { TituloSecao } from './TituloSecao';

// Lê o histórico do SQLite toda vez que a tela volta ao foco.
export function VistosRecentemente() {
  const { usuario } = useAuth();
  const styles = useEstilos(estilos);
  const [itens, setItens] = useState<ItemSalvo[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!usuario) return;
      historico.listar(usuario.id, 10).then(setItens).catch(() => setItens([]));
    }, [usuario]),
  );

  if (itens.length === 0) return null; // quem nunca assistiu nada não vê a seção

  return (
    <View>
      <TituloSecao texto="Vistos recentemente" acao="Ver tudo" aoPressionar={() => router.push('/historico')} />
      <FlatList
        horizontal
        data={itens}
        keyExtractor={(i) => `${i.fonte}-${i.tituloId}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.fila}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => abrirDetalhes({ id: item.tituloId, fonte: item.fonte })}>
            {item.poster ? <Image source={{ uri: item.poster }} style={styles.poster} /> : <View style={styles.poster} />}
            <Text numberOfLines={1} style={styles.nome}>
              {item.nome}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const estilos = (c: Cores) =>
  StyleSheet.create({
    fila: { paddingHorizontal: spacing.md, gap: spacing.md },
    item: { width: 100 },
    poster: { width: 100, height: 145, borderRadius: radius.card, backgroundColor: c.border },
    nome: { color: c.textSoft, fontSize: fontSize.pequeno, marginTop: spacing.xs },
  });
