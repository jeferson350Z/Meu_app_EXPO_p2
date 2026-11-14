import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTema } from '@/context/ThemeContext';

// Título do header de cada tela, definido num lugar só.
const TITULOS: Record<string, string> = {
  busca: 'Buscar',
  historico: 'Histórico',
  downloads: 'Downloads',
  favoritos: 'Minha lista',
  perfil: 'Meu perfil',
  configuracoes: 'Configurações',
  ajuda: 'Ajuda',
};

export default function AppLayout() {
  const { usuario } = useAuth();
  const { cores } = useTema();

  // O guarda da porta: sem sessão, ninguém passa de (app).
  if (!usuario) return <Redirect href="/login" />;

  return (
    <Stack
      screenOptions={({ route }) => ({
        title: TITULOS[route.name] ?? '',
        headerStyle: { backgroundColor: cores.card },
        headerTintColor: cores.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.background },
      })}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}