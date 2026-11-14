import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { usePersistedState } from '@/hooks/usePersistedState';
import { CHAVES } from '@/services/storage';
import { Cores, dark, light } from '@/theme';
import type { ModoTema } from '@/types';

type Ctx = {
  cores: Cores;
  modo: ModoTema;
  setModo: (m: ModoTema) => void;
  escuro: boolean;
  pronto: boolean;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [modo, setModo, pronto] = usePersistedState<ModoTema>(CHAVES.tema, 'sistema');
  const sistema = useColorScheme(); // 'light' | 'dark' | null — o que o aparelho prefere
  const escuro = modo === 'escuro' || (modo === 'sistema' && sistema === 'dark');
  const valor = useMemo(
    () => ({ cores: escuro ? dark : light, modo, setModo, escuro, pronto }),
    [escuro, modo, setModo, pronto],
  );
  return <ThemeCtx.Provider value={valor}>{children}</ThemeCtx.Provider>;
}

export function useTema() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTema deve ser usado dentro de ThemeProvider');
  return ctx;
}

// Recebe uma função (cores) => StyleSheet.create({...}) declarada fora do componente
// e só recalcula os estilos quando o tema muda.
export function useEstilos<T>(fabrica: (cores: Cores) => T) {
  const { cores } = useTema();
  return useMemo(() => fabrica(cores), [cores, fabrica]);
}