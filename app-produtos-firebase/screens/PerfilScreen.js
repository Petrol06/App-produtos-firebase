// ============================================================
// TELA DE PERFIL DO USUÁRIO
// Exibe dados do usuário logado com CRUD (Read + Update + Delete conta)
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

export default function PerfilScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const uid = auth.currentUser?.uid;

  // Carrega os dados do usuário ao entrar na tela
  useEffect(() => {
    const carregar = async () => {
      try {
        const doc = await db.collection('usuarios').doc(uid).get();
        if (doc.exists) {
          setNome(doc.data().nome);
          setEmail(doc.data().email);
          setNovoNome(doc.data().nome);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // Atualiza o nome do usuário no Firestore
  const handleAtualizar = async () => {
    if (!novoNome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ser vazio.');
      return;
    }
    setSalvando(true);
    try {
      await db.collection('usuarios').doc(uid).update({ nome: novoNome.trim() });
      setNome(novoNome.trim());
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setSalvando(false);
    }
  };

  // Exclui a conta do usuário (Auth + Firestore)
  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.collection('usuarios').doc(uid).delete();
              await auth.currentUser.delete();
              // O listener no App.js redireciona para o login
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a conta. Faça login novamente e tente.');
            }
          },
        },
      ]
    );
  };

  // Logout
  const handleLogout = async () => {
    await auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A237E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Exibição dos dados (Read) */}
      <View style={styles.card}>
        <Text style={styles.label}>Nome atual</Text>
        <Text style={styles.value}>{nome}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      {/* Atualização do nome (Update) */}
      <Text style={styles.sectionTitle}>Atualizar nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Novo nome"
        value={novoNome}
        onChangeText={setNovoNome}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.btnPrimary} onPress={handleAtualizar} disabled={salvando}>
        {salvando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>Salvar alterações</Text>
        }
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        <Text style={styles.btnLogoutText}>Sair da conta</Text>
      </TouchableOpacity>

      {/* Excluir conta (Delete) */}
      <TouchableOpacity style={styles.btnPerigo} onPress={handleExcluirConta}>
        <Text style={styles.btnText}>Excluir minha conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  btnPrimary: {
    backgroundColor: '#1A237E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnLogout: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A237E',
  },
  btnLogoutText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnPerigo: {
    backgroundColor: '#C62828',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
