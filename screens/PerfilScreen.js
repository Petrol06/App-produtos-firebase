import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

export default function PerfilScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const user = auth.currentUser;

  // READ - carrega dados do perfil do Firestore
  useEffect(() => {
    if (!user) return;
    db.collection('usuarios')
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const dados = doc.data();
          setNome(dados.nome || '');
          setEmail(dados.email || user.email);
        } else {
          setEmail(user.email);
        }
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar o perfil.'))
      .finally(() => setLoading(false));
  }, []);

  // UPDATE - atualiza o nome no Firestore
  const handleAtualizar = () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    setSalvando(true);
    db.collection('usuarios')
      .doc(user.uid)
      .update({ nome: nome.trim() })
      .then(() => Alert.alert('Sucesso', 'Perfil atualizado!'))
      .catch(() => Alert.alert('Erro', 'Não foi possível atualizar.'))
      .finally(() => setSalvando(false));
  };

  // DELETE - remove a conta e o documento do usuário
  const handleExcluir = () => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            db.collection('usuarios')
              .doc(user.uid)
              .delete()
              .then(() => user.delete())
              .catch(() =>
                Alert.alert(
                  'Erro',
                  'Faça login novamente antes de excluir a conta.'
                )
              );
          },
        },
      ]
    );
  };

  const handleSair = () => {
    auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarTexto}>
          {nome ? nome.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={email}
        editable={false}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={handleAtualizar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>
          {salvando ? 'Salvando...' : 'Atualizar perfil'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSair} onPress={handleSair}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
        <Text style={styles.botaoExcluirTexto}>Excluir conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563eb',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTexto: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  inputDisabled: {
    color: '#94a3b8',
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoSair: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  botaoSairTexto: {
    color: '#475569',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoExcluir: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoExcluirTexto: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
