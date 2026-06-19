import './EmbalagensAdmin.css';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../componentes/Navbar/Navbar';
import embalagemService from '../../services/embalagemService';
import { getMateriais } from "../../services/materialService";

export default function GerenciarEmbalagens() {
  const navigate = useNavigate();

  const [embalagens, setEmbalagens] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [enviandoFormulario, setEnviandoFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

  const [formData, setFormData] = useState({
    descricao: '',
    pesoMedio: '',
    idTipo: '',
  });

  const carregarDadosTela = async () => {
    try {
      setCarregando(true);
      setErro("");

      const [dadosEmbalagens, dadosMateriais] = await Promise.all([
        embalagemService.listarEmbalagens(),
        getMateriais().catch(() => [])
      ]);

      setEmbalagens(dadosEmbalagens || []);
      setMateriais(dadosMateriais || []);

    } catch (err) {
      setErro("Erro ao carregar as informações das embalagens.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosTela();
  }, []);

  // 🔥 recalcula total de páginas sempre
  const totalPaginas = Math.ceil(embalagens.length / itensPorPagina);

  // 🔥 garante que página nunca fique inválida
  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
    if (totalPaginas === 0) {
      setPaginaAtual(1);
    }
  }, [embalagens, totalPaginas]);

  // 🔥 dados paginados
  const embalagensPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return embalagens.slice(inicio, fim);
  }, [embalagens, paginaAtual]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'idTipo' || name === 'pesoMedio'
        ? Number(value)
        : value
    }));
  };

  const handleEditarClique = (emb) => {
    const material = materiais.find(m => m.nome === emb.materialNome);

    setEditandoId(emb.id);

    setFormData({
      descricao: emb.descricao,
      pesoMedio: emb.pesoMedio,
      idTipo: material ? material.id : '',
    });

    setExibirFormulario(true);
  };

  const handleCancelar = () => {
    setFormData({ descricao: '', pesoMedio: '', idTipo: '' });
    setEditandoId(null);
    setExibirFormulario(false);
  };

  const handleDelete = async (id, descricao) => {
    if (!window.confirm(`Excluir "${descricao}"?`)) return;

    try {
      await embalagemService.deletarEmbalagem(id);
      carregarDadosTela();
    } catch (err) {
      alert("Erro ao excluir embalagem.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idTipo) {
      alert("Selecione o material.");
      return;
    }

    try {
      setEnviandoFormulario(true);

      if (editandoId) {
        await embalagemService.atualizarEmbalagem(editandoId, formData);
      } else {
        await embalagemService.criarEmbalagem(formData);
      }

      handleCancelar();
      carregarDadosTela();

    } catch (err) {
      alert("Erro ao salvar embalagem.");
      console.error(err);
    } finally {
      setEnviandoFormulario(false);
    }
  };

  if (carregando) {
    return <div className="mensagem-carregando">Carregando...</div>;
  }

  return (
    <>
      <Navbar tipoUsuario={"empresa"} />

      <div className="painel-container">

        <div className="cabecalho-pagina">
          <h1 className="titulo-pagina">Embalagens</h1>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        {!exibirFormulario && (
          <div className="acoes-lista-container">
            <button onClick={() => navigate('/materiaisAdmin')} className="btn btn-voltar">
              Materiais
            </button>

            <button onClick={() => setExibirFormulario(true)} className="btn btn-novo">
              + Nova Embalagem
            </button>
          </div>
        )}

        {exibirFormulario ? (
          <div className="form-card">
            <h3>{editandoId ? "Editar" : "Cadastrar"}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Descrição</label>
                <input
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Peso</label>
                <input
                  type="number"
                  name="pesoMedio"
                  value={formData.pesoMedio}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Material</label>
                <select
                  name="idTipo"
                  value={formData.idTipo}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Selecione</option>
                  {materiais.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancelar} className="btn btn-voltar">
                  Cancelar
                </button>

                <button type="submit" className="btn btn-salvar">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        ) : (

          <div className="tabela-wrapper">

            <table className="tabela-embalagens">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Embalagem</th>
                  <th>Material</th>
                  <th>Peso</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {embalagensPaginadas.map(emb => (
                  <tr key={emb.id}>
                    <td>#{emb.id}</td>
                    <td>{emb.descricao}</td>
                    <td>{emb.materialNome}</td>
                    <td>{emb.pesoMedio} kg</td>

                    <td className="coluna-acoes">
                      <button onClick={() => handleEditarClique(emb)} className="btn-acao btn-editar">
                        Editar
                      </button>

                      <button onClick={() => handleDelete(emb.id, emb.descricao)} className="btn-acao btn-excluir">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="paginacao">

                <button
                  className="paginacao-btn"
                  onClick={() => setPaginaAtual(p => p - 1)}
                  disabled={paginaAtual === 1}
                >
                  Anterior
                </button>

                <span className="paginacao-info">
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <button
                  className="paginacao-btn"
                  onClick={() => setPaginaAtual(p => p + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próxima
                </button>

              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}