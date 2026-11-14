export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { card: 12, input: 10, pill: 999 };
export const fontSize = { pequeno: 13, texto: 16, subtitulo: 18, titulo: 22, grande: 30 };

const marca = { primary: '#E5252F', gold: '#E8A317' };

export const light = {
  ...marca,
  background: '#F4F5FA',
  card: '#FFFFFF',
  text: '#10162B',
  textSoft: '#5F6985',
  border: '#DADFEE',
  danger: '#C62828',
  success: '#2E7D32',
};

export const dark: typeof light = {
  ...marca,
  background: '#050B1E',
  card: '#0D1733',
  text: '#FFFFFF',
  textSoft: '#8B95B3',
  border: '#1B2547',
  danger: '#EF5350',
  success: '#66BB6A',
};

export type Cores = typeof light;