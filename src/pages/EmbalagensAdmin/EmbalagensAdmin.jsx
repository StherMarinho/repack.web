import './EmbalagensAdmin.css';
import React, { useState, useEffect} from 'react';
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

  const [formData, setFormData] = useState({
    descricao: '',
    pesoMedio: '',
    idTipo: '',
  });
  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

  const indiceInicial =
    (paginaAtual - 1) * itensPorPagina;

  const indiceFinal =
    indiceInicial + itensPorPagina;

  const embalagensPaginadas =
    embalagens.slice(
      indiceInicial,
      indiceFinal
    );

  const totalPaginas =
    Math.ceil(
      embalagens.length /
      itensPorPagina
    );

  const carregarDadosTela = async () => {
    try {
      setCarregando(true);
      setErro("");
      
      const [dadosEmbalagens, dadosMateriais] = await Promise.all([
        embalagemService.listarEmbalagens(),
        getMateriais().catch(() => []) 
      ]);

      setEmbalagens(dadosEmbalagens || []);
      setPaginaAtual(1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idTipo' || name === 'pesoMedio' ? Number(value) : value
    }));
  };

  const handleEditarClique = (emb) => {
    const material = materiais.find(
      m => m.nome === emb.materialNome
    );

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
    if (!window.confirm(`Tem certeza que deseja excluir a embalagem "${descricao}"?`)) {
      return;
    }

    try {
      await embalagemService.deletarEmbalagem(id);
      carregarDadosTela();
    } catch (err) {
      alert("Erro ao tentar excluir a embalagem.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idTipo) {
      alert("Por favor, selecione o material da embalagem.");
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
      alert(`Erro ao tentar ${editandoId ? "atualizar" : "cadastrar"} a embalagem.`);
      console.error(err);
    } finally {
      setEnviandoFormulario(false);
    }
  };

  if (carregando) return <div className="mensagem-carregando">Carregando dados das embalagens...</div>;

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
            <button 
              onClick={() => navigate('/materiaisAdmin')} 
              className="btn btn-voltar"
            >
              Gerenciar Materiais
            </button>
            <button 
              onClick={() => setExibirFormulario(true)} 
              className="btn btn-novo"
            >
              + Nova Embalagem
            </button>
          </div>
        )}

        {exibirFormulario ? (
          <div className="form-card">
            <h3>{editandoId ? "Editar Embalagem" : "Cadastrar Nova Embalagem"}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Descrição da Embalagem:</label>
                <input 
                  type="text" 
                  name="descricao" 
                  required
                  className="form-input"
                  placeholder="Ex: Garrafa PET 2L, Caixa de Papelão M"
                  value={formData.descricao} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Peso Médio(kg):</label>
                <input 
                  type="number" 
                  step="0.001"
                  name="pesoMedio" 
                  required
                  className="form-input"
                  placeholder="0.000"
                  value={formData.pesoMedio} 
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Material de Composição:</label>
                <select 
                  name="idTipo" 
                  required
                  className="form-select"
                  value={formData.idTipo} 
                  onChange={handleChange}
                >
                  <option value="">Selecione o material...</option>
                  {materiais.map(mat => (
                    <option key={mat.id} value={mat.id}>{mat.nome}</option>
                  ))}
                </select>
              </div>            

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handleCancelar} 
                  disabled={enviandoFormulario}
                  className="btn btn-voltar"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={enviandoFormulario}
                  className="btn btn-salvar"
                >
                  {enviandoFormulario ? "Salvando..." : editandoId ? "Atualizar Alterações" : "Salvar Embalagem"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {embalagens.length === 0 ? (
              <div className="mensagem-vazia">
                <h3>Nenhuma embalagem cadastrada no sistema</h3>
              </div>
            ) : (
              <div className="tabela-wrapper">
                <table className="tabela-embalagens">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Embalagem</th>
                      <th className="texto-centralizado">Material</th>
                      <th>Peso Médio Unidade</th>                     
                      <th className="coluna-cabecalho-acoes">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {embalagensPaginadas.map((emb) => (
                      <tr key={emb.id}>
                        <td><span className="badge-id-embalagem">#{emb.id}</span></td>
                        <td><span className="descricao-embalagem-destaque">{emb.descricao}</span></td>
                        <td className="texto-centralizado"><span className="material-embalagem-texto">{emb.materialNome || "Não Especificado"}</span></td>
                        <td><strong>{emb.pesoMedio}</strong> kg</td>
                        <td className="coluna-acoes">
                          <button 
                            onClick={() => handleEditarClique(emb)} 
                            className="btn-acao btn-editar"
                            title="Editar Embalagem"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(emb.id, emb.descricao)} 
                            className="btn-acao btn-excluir"
                            title="Excluir Embalagem"
                          >
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
                      disabled={paginaAtual === 1}
                      onClick={() =>
                        setPaginaAtual(
                          paginaAtual - 1
                        )
                      }
                    >
                      Anterior
                    </button>

                    <span className="paginacao-info">
                      Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                      className="paginacao-btn"
                      disabled={paginaAtual === totalPaginas}
                      onClick={() =>
                        setPaginaAtual(
                          paginaAtual + 1
                        )
                      }
                    >
                      Próxima
                    </button>

                  </div>

                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}