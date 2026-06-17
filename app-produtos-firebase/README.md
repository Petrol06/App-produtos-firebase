# App Produtos Firebase

App de gerenciamento de produtos com React Native e Expo. Possui autenticação de usuários via Firebase Auth, cadastro, perfil e CRUD completo de produtos com persistência remota no Firebase Firestore.

## 📱 Telas

- **Login** — autenticação com email e senha
- **Cadastro de usuário** — criação de conta com nome, email e senha
- **Produtos** — CRUD completo (criar, listar, editar, excluir) com Firestore
- **Perfil** — visualizar e atualizar dados do usuário, logout e exclusão de conta

## 🚀 Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar o Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto (ou use um existente)
3. Ative **Authentication → Email/senha**
4. Crie o banco **Firestore Database** (modo teste)
5. Copie as credenciais do seu app web e cole em `firebase/firebaseConfig.js`

### 3. Iniciar o projeto

```bash
npx expo start
```

Escaneie o QR Code com o app **Expo Go** no celular.

## 🗂️ Estrutura

```
app-produtos-firebase/
├── App.js                      # Navegação e listener de autenticação
├── firebase/
│   └── firebaseConfig.js       # Configuração do Firebase
├── screens/
│   ├── LoginScreen.js          # Tela de login
│   ├── CadastroScreen.js       # Tela de cadastro de usuário
│   ├── ProdutosScreen.js       # CRUD de produtos
│   └── PerfilScreen.js         # Perfil do usuário
├── package.json
└── app.json
```

## 🔧 Tecnologias

- React Native + Expo
- Firebase Auth (autenticação)
- Firebase Firestore (banco de dados remoto)
- React Navigation (navegação entre telas)
