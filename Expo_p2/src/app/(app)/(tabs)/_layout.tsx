import { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '@/context/ThemeContext';

type Icone = keyof typeof Ionicons.glyphMap;

const aba = (title: string, icone: Icone) => ({
  title,
  tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={icone} color={color as string} size={size} />
  ),
});

export default function TabsLayout() {
  const { cores } = useTema();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: cores.card, borderTopColor: cores.border },
        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.textSoft,
      }}
    >
      <Tabs.Screen name="index" options={aba('Início', 'home')} />
      <Tabs.Screen name="tendencias" options={aba('Tendências', 'trending-up')} />
      <Tabs.Screen name="explorar" options={aba('Explorar', 'compass')} />
      <Tabs.Screen name="indicacao" options={aba('Indicação', 'sparkles')} />
      <Tabs.Screen name="meu" options={aba('Meu', 'person')} />
    </Tabs>
  );
}
