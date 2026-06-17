// ============================================================
// TELA DE CADASTRO DE PRODUTOS — CRUD COMPLETO
// Create, Read, Update, Delete com Firebase Firestore
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, ActivityIndicator, Modal, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { db } from '../firebase/firebaseConfig';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null); // null = novo, objeto = editar

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [descricao, setDescricao] = useState('');

  // ── READ: Escuta em tempo real a coleção 'produtos' no Firestore ──
  useEffect(() => {
    const unsubscribe = db
      .collection('produtos')
      .orderBy('nome')
      .onSnapshot(
        (snapshot) => {
          const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProdutos(lista);
          setLoading(false);
        },
        (error) => {
          Alert.alert('Erro', 'Não foi possível carregar os produtos.');
          setLoading(false);
        }
      );
    // Cancela o listener ao sair da tela
    return () => unsubscribe();
  }, []);

  // Abre modal para NOVO produto
  const abrirNovo = () => {
    setEditando(null);
    limparCampos();
    setModalVisible(true);
  };

  // Abre modal para EDITAR produto existente
  const abrirEditar = (produto) => {
    setEditando(produto);
    setNome(produto.nome);
    setCodigo(produto.codigo);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
    setDescricao(produto.descricao || '');
    setModalVisible(true);
  };

  const limparCampos = () => {
    setNome('');
    setCodigo('');
    setPreco('');
    setQuantidade('');
    setDescricao('');
  };

  // ── CREATE: Adiciona novo produto no Firestore ──
  const handleAdicionar = async () => {
    if (!nome.trim() || !codigo.trim() || !preco.trim() || !quantidade.trim()) {
      Alert.alert('Atenção', 'Preencha nome, código, preço e quantidade.');
      return;
    }

    try {
      // Verifica se o código já existe
      const snap = await db.collection('produtos').where('codigo', '==', codigo.trim()).get();
      if (!snap.empty) {
        Alert.alert('Erro', 'Já existe um produto com esse código.');
        return;
      }

      await db.collection('produtos').add({
        nome: nome.trim(),
        codigo: codigo.trim(),
        preco: parseFloat(preco.replace(',', '.')),
        quantidade: parseInt(quantidade),
        descricao: descricao.trim(),
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Produto adicionado!');
      setModalVisible(false);
      limparCampos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto.');
    }
  };

  // ── UPDATE: Atualiza produto existente no Firestore ──
  const handleAtualizar = async () => {
    if (!nome.trim() || !preco.trim() || !quantidade.trim()) {
      Alert.alert('Atenção', 'Preencha nome, preço e quantidade.');
      return;
    }

    try {
      await db.collection('produtos').doc(editando.id).update({
        nome: nome.trim(),
        preco: parseFloat(preco.replace(',', '.')),
        quantidade: parseInt(quantidade),
        descricao: descricao.trim(),
        atualizadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Produto atualizado!');
      setModalVisible(false);
      limparCampos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  };

  // ── DELETE: Remove produto do Firestore ──
  const handleExcluir = (produto) => {
    Alert.alert(
      'Excluir produto',
      `Deseja excluir "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.collection('produtos').doc(produto.id).delete();
              Alert.alert('Sucesso', 'Produto excluído!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          },
        },
      ]
    );
  };

  // Renderiza cada item da lista
  const renderProduto = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text style={styles.cardCodigo}>#{item.codigo}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardPreco}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
        <Text style={styles.cardQtd}>Qtd: {item.quantidade}</Text>
      </View>
      {item.descricao ? <Text style={styles.cardDesc}>{item.descricao}</Text> : null}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => abrirEditar(item)}>
          <Text style={styles.btnEditarText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => handleExcluir(item)}>
          <Text style={styles.btnExcluirText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A237E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <TouchableOpacity style={styles.btnNovo} onPress={abrirNovo}>
          <Text style={styles.btnNovoText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {produtos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
          <Text style={styles.emptyHint}>Toque em "+ Novo" para adicionar.</Text>
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={renderProduto}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* ── MODAL DE FORMULÁRIO (Create / Update) ── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editando ? 'Editar Produto' : 'Novo Produto'}
            </Text>

            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Camiseta Branca"
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Código *</Text>
            <TextInput
              style={[styles.input, editando && styles.inputDisabled]}
              placeholder="Ex: PROD001"
              value={codigo}
              onChangeText={setCodigo}
              editable={!editando} // Código não pode mudar na edição
              placeholderTextColor="#999"
            />
            {editando && (
              <Text style={styles.hintText}>O código não pode ser alterado.</Text>
            )}

            <Text style={styles.inputLabel}>Preço (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 29.90"
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Quantidade *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descrição opcional..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={editando ? handleAtualizar : handleAdicionar}
            >
              <Text style={styles.btnText}>
                {editando ? 'Salvar alterações' : 'Adicionar produto'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => { setModalVisible(false); limparCampos(); }}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  btnNovo: {
    backgroundColor: '#1A237E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNovoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A237E',
    flex: 1,
  },
  cardCodigo: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardPreco: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '700',
  },
  cardQtd: {
    fontSize: 14,
    color: '#555',
  },
  cardDesc: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  btnEditar: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnEditarText: {
    color: '#1565C0',
    fontWeight: '600',
    fontSize: 13,
  },
  btnExcluir: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnExcluirText: {
    color: '#C62828',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    color: '#999',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#EEEEEE',
    color: '#888',
  },
  hintText: {
    fontSize: 11,
    color: '#999',
    marginTop: -10,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  btnPrimary: {
    backgroundColor: '#1A237E',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnCancelar: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  btnCancelarText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
});
