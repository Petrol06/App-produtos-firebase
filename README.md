# App Produtos Firebase

Aplicativo mobile desenvolvido em **React Native + Expo** com persistência remota no **Firebase** (Authentication + Firestore). Projeto da disciplina de Engenharia de Aplicações Móveis — PUC Minas.

## 📱 Telas (com CRUD)

| Tela | Descrição |
|------|-----------|
| **Login** | Autenticação de usuário via Firebase Auth (e-mail/senha) |
| **Cadastro** | Cadastro de novos usuários (grava nome/e-mail no Firestore) |
| **Perfil** | Tela exibida pós-login. CRUD do usuário: lê, atualiza o nome e exclui a conta |
| **Produtos** | Tela exibida pós-login. CRUD completo de produtos (criar, listar, editar, excluir) |

Todas as telas manipulam **persistência remota no Firebase**.

## 🔥 Funcionalidades de CRUD

**Produtos** (coleção `produtos`):
- **Create** — botão `+` abre modal e adiciona produto
- **Read** — lista em tempo real (`onSnapshot`) filtrada pelo usuário logado
- **Update** — botão "Editar" abre o modal preenchido
- **Delete** — botão "Excluir" com confirmação

**Perfil** (coleção `usuarios`):
- **Read** — carrega nome e e-mail do Firestore
- **Update** — atualiza o nome
- **Delete** — exclui a conta e o documento do usuário

## 🚀 Como rodar

```bash
npm install
npx expo start --clear
```

Escaneie o QR code com o app **Expo Go** no celular.

## 🛠️ Tecnologias

- React Native 0.81 / Expo ~54
- Firebase 8.10.0 (compat API)
- React Navigation (Stack + Bottom Tabs)

## 📁 Estrutura

```
app-produtos-firebase/
├── App.js                      # Navegação + controle de auth
├── firebase/
│   └── firebaseConfig.js       # Configuração do Firebase
├── screens/
│   ├── LoginScreen.js          # Autenticação
│   ├── CadastroScreen.js       # Cadastro de usuários
│   ├── PerfilScreen.js         # Perfil (CRUD do usuário)
│   └── ProdutosScreen.js       # CRUD de produtos
├── app.json
├── babel.config.js
└── package.json
```

---

## 🎥 Roteiro sugerido para o vídeo (YouTube)

1. Abrir o app → tela de **Login**.
2. Clicar em "Cadastre-se" → criar um usuário novo (mostra a tela de **Cadastro**).
3. Login automático → cai na tela de **Produtos**.
4. **Create**: tocar `+`, cadastrar um produto.
5. **Read**: mostrar a lista atualizando.
6. **Update**: editar o produto.
7. **Delete**: excluir o produto.
8. Ir para a aba **Perfil** → atualizar o nome (Update) e mostrar os dados (Read).
9. Mostrar no Firebase Console as coleções `usuarios` e `produtos` sendo gravadas (persistência remota).
10. Falar rapidamente da estrutura do código (App.js, screens, firebaseConfig).

> Lembre de anexar na entrega: link do repositório GitHub, link do vídeo no YouTube e a imagem do **QR Code** para rodar no Expo Go.
