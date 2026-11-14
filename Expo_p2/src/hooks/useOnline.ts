import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const parar = NetInfo.addEventListener((s) => setOnline(s.isConnected !== false));
    return parar; // limpa o listener ao sair da tela
  }, []);
  return online;
}