import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { usuario } = useAuth();
  if (usuario) return <Redirect href="/" />; // já logado não precisa ver login/cadastro
  return <Stack screenOptions={{ headerShown: false }} />;
}