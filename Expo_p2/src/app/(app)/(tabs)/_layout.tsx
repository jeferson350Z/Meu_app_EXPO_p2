import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '@/context/ThemeContext';

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}