# Streaming P2

App de streaming feito com Expo (React Native) e Expo Router.

## O que o app faz
- Cadastro e login com banco SQLite local (senha com hash e sal) e sessão que sobrevive ao fechar o app
- Séries populares, ranking, explorar por gênero e indicação aleatória (API TVMaze)
- Busca por nome com banners de filmes (API iTunes Search) e séries (TVMaze)
- Detalhes, assistir (histórico), baixar (arquivo salvo no aparelho) e minha lista
- Histórico, downloads, perfil, configurações (tema claro/escuro) e ajuda (POST para API)
- Cache com validade, aviso offline e tratamento de erros em todas as telas

## Como rodar
```
npm install
npx expo start
```
Escaneie o QR code com o Expo Go.

## Dupla
- Parte 1 (commits 1 a 22): fundação, serviços, banco e autenticação
- Parte 2 (commits 23 a 44): telas e funcionalidades
