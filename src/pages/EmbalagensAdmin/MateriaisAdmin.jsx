import '../EmbalagensAdmin/MateriaisAdmin.css'; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook para navegação
import Navbar from '../../componentes/Navbar/Navbar';
import { getMateriais } from '../../services/materialService';
import materialService from '../../services/materialService';

export default function GerenciarMateriais() {
  const navigate = useNavigate(); // Inicializa a função de navegação
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [enviandoFormulario, setEnviandoFormulario] = useState(false);
  
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nome: ''
  });

  const [paginaAtual, setPaginaAtual] = useState(1);

const itensPorPagina = 10;

  const indiceInicial =
      (paginaAtual - 1) * itensPorPagina;

  const indiceFinal =
      indiceInicial + itensPorPagina;

  const materiaisPaginados =
      materiais.slice(
          indiceInicial,
          indiceFinal
      );

  const totalPaginas =
      Math.ceil(
          materiais.length /
          itensPorPagina
      );

  const carregarDadosTela = async () => {
    try {
      setCarregando(true);
      setErro("");
      const dados = await getMateriais();
      setMateriais(dados || []);
      setPaginaAtual(1);
    } catch (err) {
      setErro("Erro ao carregar as informações dos materiais.");
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
      [name]: value
    }));
  };

  const handleEditarClique = (mat) => {
    setEditandoId(mat.id);
    setFormData({
      nome: mat.nome
    });
    setExibirFormulario(true);
  };

  const handleCancelar = () => {
    setFormData({ nome: '' });
    setEditandoId(null);
    setExibirFormulario(false);
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja excluir o material "${nome}"?`)) {
      return;
    }

    try {
      await materialService.deletarMaterial(id);
      carregarDadosTela();
    } catch (err) {
      alert("Erro ao tentar excluir o material. Verifique se ele não está sendo usado por nenhuma embalagem.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setEnviandoFormulario(true);
      
      if (editandoId) {
        await materialService.atualizarMaterial(editandoId, formData);
      } else {  
        await materialService.criarMaterial(formData);
      }  

      handleCancelar();    
      await carregarDadosTela();

    } catch (err) {
      alert(`Erro ao tentar ${editandoId ? "atualizar" : "cadastrar"} o material.`);
      console.error(err);
    } finally {
      setEnviandoFormulario(false);
    }
  };

  if (carregando) return <div className="mensagem-carregando">Carregando dados dos materiais...</div>;

  return (
    <>
      <Navbar tipoUsuario={"empresa"} />
      
      <div className="painel-container">
        <div className="cabecalho-pagina">
          <h1 className="titulo-pagina">Materiais de Embalagem</h1>
        </div>

        {erro && <div className="mensagem-erro">{erro}</div>}

        {!exibirFormulario && (
          <div className="acoes-lista-container">
            <button 
              onClick={() => navigate('/embalagens')} 
              className="btn btn-voltar"
            >
              Gerenciar Embalagens
            </button>
            <button 
              onClick={() => setExibirFormulario(true)} 
              className="btn btn-novo"
            >
              + Adicionar Material
            </button>
          </div>
        )}

        {exibirFormulario ? (
          <div className="form-card">
            <h3>{editandoId ? "Editar Material" : "Cadastrar Novo Material"}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Nome do Material:</label>
                <input 
                  type="text" 
                  name="nome" 
                  required
                  className="form-input"
                  placeholder="Ex: Plástico PET, Papelão Ondulado, Vidro"
                  value={formData.nome} 
                  onChange={handleChange}
                />
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
                  {enviandoFormulario ? "Salvando..." : editandoId ? "Atualizar Alterações" : "Salvar Material"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {materiais.length === 0 ? (
              <div className="mensagem-vazia">
                <h3>Nenhum material cadastrado no sistema</h3>
              </div>
            ) : (
              <div className="tabela-wrapper">
                <table className="tabela-embalagens">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th className="nome">Nome do Material</th>
                      <th className="coluna-cabecalho-acoes">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiaisPaginados.map((mat) => (
                      <tr key={mat.id}>
                        <td><span className="badge-id-embalagem">#{mat.id}</span></td>
                        <td className="nome"><span className="descricao-embalagem-destaque">{mat.nome}</span></td>
                        <td className="coluna-acoes">
                          <button 
                            onClick={() => handleEditarClique(mat)} 
                            className="btn-acao btn-editar"
                            title="Editar Material"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(mat.id, mat.nome)} 
                            className="btn-acao btn-excluir"
                            title="Excluir Material"
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