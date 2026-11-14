import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTema } from '@/context/ThemeContext';

// Segura a splash enquanto o app lê tema e sessão do disco.
SplashScreen.preventAutoHideAsync();

function Raiz() {
  const { pronto: sessaoPronta } = useAuth();
  const { pronto: temaPronto, escuro } = useTema();
  const pronto = sessaoPronta && temaPronto;

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null; // splash continua visível

  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Raiz />
      </AuthProvider>
    </ThemeProvider>
  );
}