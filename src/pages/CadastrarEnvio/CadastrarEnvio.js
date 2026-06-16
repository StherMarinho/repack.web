import React, { useState, useEffect, useRef } from 'react';
import './CadastrarEnvio.css';

import envioService from '../../services/envioService';
import empresaService from '../../services/empresaService';
import embalagemService from '../../services/embalagemService';

import Navbar from '../../componentes/Navbar/Navbar';
import CampoTexto from '../../componentes/CampoTexto/CampoTexto';
import CampoSelect from '../../componentes/CampoSelect/CampoSelect';
import Botao from '../../componentes/Botao/Botao';

export default function CadastroRecebimento() {
  const [empresas, setEmpresas] = useState([]);
  const [embalagens, setEmbalagens] = useState([]);

  const [idUsuario, setIdUsuario] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [observacao, setObservacao] = useState('');

  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);

  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', msg: '' });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resEmpresas, resEmbalagens] = await Promise.all([
          empresaService.listarEmpresas(),
          embalagemService.listarEmbalagens()
        ]);

        setEmpresas(resEmpresas.data || resEmpresas || []);
        setEmbalagens(resEmbalagens.data || resEmbalagens || []);
      } catch {
        setFeedback({ tipo: 'erro', msg: 'Erro ao carregar dados.' });
      }
    }

    carregarDados();

    const fecharDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };

    document.addEventListener('mousedown', fecharDropdown);
    return () => document.removeEventListener('mousedown', fecharDropdown);
  }, []);

  const opcoesEmpresas = empresas.map(e => ({
    id: e.id,
    descricao: e.nome
  }));

  const toggleEmbalagem = (emb) => {
    const existe = itensSelecionados.find(i => i.id === emb.id);

    if (existe) {
      setItensSelecionados(itensSelecionados.filter(i => i.id !== emb.id));
    } else {
      setItensSelecionados([
        ...itensSelecionados,
        { id: emb.id, nome: emb.descricao, quantidade: 1 }
      ]);
    }
  };

  const atualizarQtd = (id, valor) => {
    const qtd = parseInt(valor, 10);
    if (!qtd || qtd < 1) return;

    setItensSelecionados(
      itensSelecionados.map(i =>
        i.id === id ? { ...i, quantidade: qtd } : i
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itensSelecionados.length === 0) {
      return setFeedback({ tipo: 'erro', msg: 'Selecione embalagens.' });
    }

    if (!observacao.trim()) {
      return setFeedback({ tipo: 'erro', msg: 'Observação obrigatória.' });
    }

    setLoading(true);
    setFeedback({ tipo: '', msg: '' });

    const ids = itensSelecionados.flatMap(i =>
      Array(i.quantidade).fill(i.id)
    );

    const payload = {
      idUsuario: Number(idUsuario),
      idEmpresa: Number(idEmpresa),
      idsEmbalagens: ids,
      observacao
    };

    try {
      const res = await envioService.criarEnvio(payload);

      if (res.sucesso || res.data) {
        setFeedback({ tipo: 'sucesso', msg: 'Envio registrado!' });

        setIdUsuario('');
        setIdEmpresa('');
        setObservacao('');
        setItensSelecionados([]);
        setMenuAberto(false);
      } else {
        setFeedback({ tipo: 'erro', msg: res.mensagem });
      }
    } catch {
      setFeedback({ tipo: 'erro', msg: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  const embalagensFiltradas = embalagens.filter(e =>
    (e.descricao || e.tipo || '')
      .toLowerCase()
      .includes(termoBusca.toLowerCase())
  );

  return (
    <>
      <Navbar tipoUsuario="empresa" />

      <div className="cadastro-wrapper">
        <div className="cadastro-card">

          <h2>Registrar Envio</h2>

          {feedback.msg && (
            <div className={`alerta ${feedback.tipo}`}>
              {feedback.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">

  <div className="campo">
    <CampoTexto
      label="ID Usuário"
      type="number"
      valor={idUsuario}
      aoAlterado={setIdUsuario}
      obrigatorio
    />
  </div>

  <div className="campo">
    <CampoSelect
      label="Empresa"
      options={opcoesEmpresas}
      value={idEmpresa}
      aoAlterado={setIdEmpresa}
    />
  </div>

  <div className="campo">
    <label>Embalagens</label>

    <div className="dropdown" ref={dropdownRef}>
      <div
        className="dropdown-header"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        {itensSelecionados.length
          ? `${itensSelecionados.length} selecionado(s)`
          : 'Selecione...'}
      </div>

      {menuAberto && (
        <div className="dropdown-box">
          <input
            className="search"
            placeholder="Buscar..."
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
          />

          {embalagensFiltradas.map(e => (
            <label key={e.id} className="item">
              <input
                type="checkbox"
                checked={itensSelecionados.some(i => i.id === e.id)}
                onChange={() => toggleEmbalagem(e)}
              />
              {e.descricao || e.tipo}
            </label>
          ))}
        </div>
      )}
    </div>
  </div>

  {itensSelecionados.length > 0 && (
    <div className="lista">
      {itensSelecionados.map(i => (
        <div key={i.id} className="item-card">
          <span>{i.nome}</span>

          <input
            type="number"
            min="1"
            value={i.quantidade}
            onChange={e => atualizarQtd(i.id, e.target.value)}
          />

          <button type="button" onClick={() => toggleEmbalagem(i)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )}

  <div className="campo">
    <CampoTexto
      label="Observação"
      valor={observacao}
      aoAlterado={setObservacao}
      obrigatorio
    />
  </div>

  <Botao disabled={loading}>
    {loading ? 'Enviando...' : 'Cadastrar'}
  </Botao>

</form>
        </div>
      </div>
    </>
  );
}