import { useEffect, useState } from 'react';

// Só devolve o valor novo depois que o usuário parar de digitar por `ms`.
export function useDebounce<T>(valor: T, ms = 500) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setAtrasado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return atrasado;
}