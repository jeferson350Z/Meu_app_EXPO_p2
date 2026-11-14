import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { storage } from './storage';

const web = Platform.OS === 'web';

export const seguro = {
  async salvar(chave: string, valor: string) {
    if (web) return storage.set(`seguro.${chave}`, valor);
    await SecureStore.setItemAsync(chave, valor);
  },
  async ler(chave: string): Promise<string | null> {
    try {
      if (web) return await storage.get<string | null>(`seguro.${chave}`, null);
      return await SecureStore.getItemAsync(chave);
    } catch {
      return null;
    }
  },
  async apagar(chave: string) {
    try {
      if (web) await storage.remove(`seguro.${chave}`);
      else await SecureStore.deleteItemAsync(chave);
    } catch {
      // chave inexistente: nada a apagar
    }
  },
};