import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const user = auth.currentUser;

  // READ - escuta em tempo real os produtos do usuário
  useEffect(() => {
    const unsubscribe = db
      .collection('produtos')
      .where('uid', '==', user.uid)
      .onSnapshot(
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProdutos(lista);
          setLoading(false);
        },
        () => {
          Alert.alert('Erro', 'Não foi possível carregar os produtos.');
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, []);

  const abrirModalNovo = () => {
    setEditando(null);
    setNome('');
    setPreco('');
    setQuantidade('');
    setModalVisivel(true);
  };

  const abrirModalEditar = (produto) => {
    setEditando(produto);
    setNome(produto.nome);
    setPreco(String(produto.preco));
    setQuantidade(String(produto.quantidade));
    setModalVisivel(true);
  };

  // CREATE / UPDATE
  const handleSalvar = () => {
    if (!nome.trim() || !preco.trim() || !quantidade.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    const dados = {
      nome: nome.trim(),
      preco: parseFloat(preco.replace(',', '.')) || 0,
      quantidade: parseInt(quantidade) || 0,
      uid: user.uid,
    };

    if (editando) {
      db.collection('produtos')
        .doc(editando.id)
        .update(dados)
        .then(() => setModalVisivel(false))
        .catch(() => Alert.alert('Erro', 'Não foi possível atualizar.'));
    } else {
      db.collection('produtos')
        .add({ ...dados, criadoEm: new Date().toISOString() })
        .then(() => setModalVisivel(false))
        .catch(() => Alert.alert('Erro', 'Não foi possível cadastrar.'));
    }
  };

  // DELETE
  const handleExcluir = (produto) => {
    Alert.alert('Excluir', `Excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          db.collection('produtos')
            .doc(produto.id)
            .delete()
            .catch(() => Alert.alert('Erro', 'Não foi possível excluir.'));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text style={styles.cardDetalhe}>
          R$ {Number(item.preco).toFixed(2)} • Qtd: {item.quantidade}
        </Text>
      </View>
      <View style={styles.cardAcoes}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => abrirModalEditar(item)}
        >
          <Text style={styles.btnEditarTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => handleExcluir(item)}
        >
          <Text style={styles.btnExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhum produto cadastrado.{'\n'}Toque em + para adicionar.
          </Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={abrirModalNovo}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTitulo}>
              {editando ? 'Editar produto' : 'Novo produto'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: 19.90)"
              keyboardType="decimal-pad"
              value={preco}
              onChangeText={setPreco}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="number-pad"
              value={quantidade}
              onChangeText={setQuantidade}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                <Text style={styles.btnSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
  cardDetalhe: { fontSize: 14, color: '#64748b', marginTop: 4 },
  cardAcoes: { flexDirection: 'row' },
  btnEditar: {
    backgroundColor: '#dbeafe',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  btnEditarTexto: { color: '#2563eb', fontWeight: 'bold' },
  btnExcluir: {
    backgroundColor: '#fee2e2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnExcluirTexto: { color: '#dc2626', fontWeight: 'bold' },
  vazio: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 60,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabTexto: { color: '#fff', fontSize: 32, lineHeight: 34 },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCaixa: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  modalBotoes: { flexDirection: 'row', marginTop: 8 },
  btnCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  btnCancelarTexto: { color: '#475569', fontWeight: 'bold' },
  btnSalvar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  btnSalvarTexto: { color: '#fff', fontWeight: 'bold' },
});
