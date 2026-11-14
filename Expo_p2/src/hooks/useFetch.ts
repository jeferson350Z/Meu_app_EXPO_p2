import { useCallback, useEffect, useRef, useState } from 'react';

// Os 3 estados (loading, erro, dados) de toda tela com API. O "vazio" a tela decide olhando os dados.
export function useFetch<T>(buscar: () => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const buscarRef = useRef(buscar);
  const pedido = useRef(0);

  useEffect(() => {
    buscarRef.current = buscar;
  });

  // silencioso = true não mostra o spinner (usado no pull-to-refresh e ao reconectar)
  const carregar = useCallback(async (silencioso = false) => {
    const meu = ++pedido.current;
    if (!silencioso) setLoading(true);
    setErro(null);
    try {
      const resultado = await buscarRef.current();
      if (meu === pedido.current) setDados(resultado);
    } catch (e) {
      if (meu === pedido.current) setErro(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      if (meu === pedido.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { dados, loading, erro, recarregar: carregar };
}