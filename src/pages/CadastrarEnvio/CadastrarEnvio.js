import React, { useState, useEffect, useRef } from 'react';
import './CadastrarEnvio.css';
import envioService from '../../services/envioService';
import empresaService from '../../services/empresaService';
import embalagemService from '../../services/embalagemService';
import Navbar from '../../componentes/Navbar/Navbar';

export default function CadastroRecebimento() {
  const [empresas, setEmpresas] = useState([]);
  const [embalagens, setEmbalagens] = useState([]);

  // Estados do formulário
  const [idUsuario, setIdUsuario] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [observacao, setObservacao] = useState('');
  
  // Estados do Dropdown Customizado
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', msg: '' });

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        const [resE, resEmb] = await Promise.all([
          empresaService.listarEmpresas(), 
          embalagemService.listarEmbalagens()
        ]);
        const dadosEmpresas = resE.data || resE;
        const dadosEmbalagens = resEmb.data || resEmb;

        if (Array.isArray(dadosEmpresas)) setEmpresas(dadosEmpresas);
        if (Array.isArray(dadosEmbalagens)) setEmbalagens(dadosEmbalagens);
      } catch (err) {
        setFeedback({ tipo: 'erro', msg: 'Erro ao carregar seletores.' });
      }
    }

    const fecharAoClicarFora = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };

    carregarDadosIniciais();
    document.addEventListener("mousedown", fecharAoClicarFora);
    return () => document.removeEventListener("mousedown", fecharAoClicarFora);
  }, []);

  const toggleEmbalagem = (emb) => {
    const jaSelecionado = itensSelecionados.find(i => i.id === emb.id);
    if (jaSelecionado) {
      setItensSelecionados(itensSelecionados.filter(i => i.id !== emb.id));
    } else {
      setItensSelecionados([...itensSelecionados, { 
        id: emb.id, 
        nome: emb.descricao || emb.tipo, 
        quantidade: 1 
      }]);
    }
  };

  const atualizarQtd = (id, valor) => {
    const novaQtd = parseInt(valor, 10);
    if (isNaN(novaQtd) || novaQtd < 1) return;
    setItensSelecionados(itensSelecionados.map(item => 
      item.id === id ? { ...item, quantidade: novaQtd } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itensSelecionados.length === 0) {
      setFeedback({ tipo: 'erro', msg: 'Selecione pelo menos uma embalagem.' });
      return;
    }

    setLoading(true);
    setFeedback({ tipo: '', msg: '' });

    const idsParaEnvio = itensSelecionados.flatMap(item => 
      Array(item.quantidade).fill(item.id)
    );

    const payload = {
      idUsuario: parseInt(idUsuario, 10),
      idEmpresa: parseInt(idEmpresa, 10),
      idsEmbalagens: idsParaEnvio,
      observacao: observacao
    };

    try {
      const response = await envioService.criarEnvio(payload);
      if (response.sucesso || response.data) {
        setFeedback({ tipo: 'sucesso', msg: `Envio registrado com sucesso!` });
        setIdUsuario('');
        setIdEmpresa('');
        setItensSelecionados([]);
        setObservacao('');
        setTermoBusca('');
        setMenuAberto(false);
      } else {
        setFeedback({ tipo: 'erro', msg: response.mensagem || 'Falha ao registrar.' });
      }
    } catch (err) {
      setFeedback({ tipo: 'erro', msg: 'Erro de comunicação.' });
    } finally {
      setLoading(false);
    }
  };

  const embalagensFiltradas = embalagens.filter(emb => 
    (emb.descricao || emb.tipo).toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <>
    <Navbar tipoUsuario={"empresa"}/>
    <div className="cadastro-container">
      <div className="cadastro-card form-centralizado">
        <h2>Registrar Envio de Embalagens</h2>

        {feedback.msg && <div className={`alerta alerta-${feedback.tipo}`}>{feedback.msg}</div>}

        <form className="form-recebimento" onSubmit={handleSubmit}>
          
          <div className="campo-grupo">
            <label>ID do Usuário</label>
            <input 
              type="number" min="1" className="input-field"
              value={idUsuario} onChange={e => setIdUsuario(e.target.value)} required
            />
          </div>

          <div className="campo-grupo">
            <label>Empresa</label>
            <select 
              className="input-field" value={idEmpresa} 
              onChange={e => setIdEmpresa(e.target.value)} required
            >
              <option value="">Selecione a empresa...</option>
              {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
            </select>
          </div>

          <div className="campo-grupo">
            <label>Embalagens</label>
            <div className="dropdown-customizado" ref={dropdownRef}>
              <div 
                className={`dropdown-header ${menuAberto ? 'ativo' : ''}`} 
                onClick={() => setMenuAberto(!menuAberto)}
              >
                <span>
                   {itensSelecionados.length > 0
                       ? `${itensSelecionados.length} item(ns) selecionado(s)`
                           : "Selecione as embalagens..."}
                </span>
                <span className="seta">{menuAberto ? '▲' : '▼'}</span>
              </div>

              {menuAberto && (
                <div className="dropdown-expansivel">
                  <input 
                    type="text" className="input-busca" placeholder="Pesquisar..." 
                    value={termoBusca} onChange={e => setTermoBusca(e.target.value)}
                    autoFocus
                  />
                  <div className="lista-opcoes">
                    {embalagensFiltradas.length > 0 ? (
                      embalagensFiltradas.map(emb => (
                        <label key={emb.id} className="opcao-item">
                          <input 
                            type="checkbox" 
                            checked={itensSelecionados.some(i => i.id === emb.id)}
                            onChange={() => toggleEmbalagem(emb)}
                          />
                          {emb.descricao || emb.tipo}
                        </label>
                      ))
                    ) : (
                      <div className="sem-resultados">Nenhuma embalagem encontrada</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
         
          {itensSelecionados.length > 0 && (
            <div className="container-itens-selecionados">
              {itensSelecionados.map(item => (
                <div key={item.id} className="card-item-qtd">
                  <span className="nome-item">{item.nome}</span>
                  <div className="controles-qtd">
                    <input 
                      type="number" min="1" 
                      className="input-qtd-mini"
                      value={item.quantidade}
                      onChange={(e) => atualizarQtd(item.id, e.target.value)}
                    />
                    <button type="button" onClick={() => toggleEmbalagem({id: item.id})} className="btn-remover-item">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="campo-grupo">
            <label>Observações:</label>
            <textarea 
              className="input-field textarea-field" value={observacao} 
              onChange={e => setObservacao(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-enviar" disabled={loading}>
            {loading ? 'Processando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}