import { router } from 'expo-router';
import type { Fonte } from '@/types';

// Uma só função para abrir o detalhe: o id viaja pela rota /detalhes/[id].
export function abrirDetalhes(t: { id: number; fonte: Fonte }) {
  router.push({ pathname: '/detalhes/[id]', params: { id: String(t.id), fonte: t.fonte } });
}
