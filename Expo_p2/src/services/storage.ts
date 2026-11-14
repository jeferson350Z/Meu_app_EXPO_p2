import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVES = {
  sessao: 'app:v1:sessao',
  tema: 'app:v1:tema',
  cache: 'app:v1:cache:',
};

export const storage = {
  async get<T>(chave: string, padrao: T): Promise<T> {
    try {
      const bruto = await AsyncStorage.getItem(chave);
      return bruto ? (JSON.parse(bruto) as T) : padrao;
    } catch {
      return padrao; // dado corrompido? usa o padrão
    }
  },
  async set<T>(chave: string, valor: T) {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  },
  remove: (chave: string) => AsyncStorage.removeItem(chave),
  async limparPrefixo(prefixo: string) {
    const chaves = await AsyncStorage.getAllKeys();
    const alvo = chaves.filter((c) => c.startsWith(prefixo));
    if (alvo.length > 0) await AsyncStorage.multiRemove(alvo);
  },
};