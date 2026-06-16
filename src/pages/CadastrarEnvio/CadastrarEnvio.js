import React, { useState, useEffect } from 'react';
import './CadastrarEnvio.css';

import envioService from '../../services/envioService';
import empresaService from '../../services/empresaService';
import embalagemService from '../../services/embalagemService';

import Navbar from '../../componentes/Navbar/Navbar';
import CampoTexto from '../../componentes/CampoTexto/CampoTexto';
import CampoSelect from '../../componentes/CampoSelect/CampoSelect';
import CampoMultiSelect from '../../componentes/CampoMultiSelect/CampoMultiSelect';
import Botao from '../../componentes/Botao/Botao';

export default function CadastroRecebimento() {

  const [empresas, setEmpresas] = useState([]);
  const [embalagens, setEmbalagens] = useState([]);

  const [idUsuario, setIdUsuario] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [observacao, setObservacao] = useState('');

  const [itensSelecionados, setItensSelecionados] = useState([]);

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
  }, []);

  const opcoesEmpresas = empresas.map(e => ({
    id: e.id,
    descricao: e.nome
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itensSelecionados.length) {
      return setFeedback({ tipo: 'erro', msg: 'Selecione embalagens.' });
    }

    if (!observacao.trim()) {
      return setFeedback({ tipo: 'erro', msg: 'Observação obrigatória.' });
    }

    setLoading(true);

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

      setFeedback({
        tipo: res.sucesso || res.data ? 'sucesso' : 'erro',
        msg: res.sucesso ? 'Envio registrado!' : res.mensagem
      });

      if (res.sucesso) {
        setIdUsuario('');
        setIdEmpresa('');
        setObservacao('');
        setItensSelecionados([]);
      }

    } catch {
      setFeedback({ tipo: 'erro', msg: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar tipoUsuario="empresa" />

      <div className="cadastro-wrapper">
        <div className="cadastro-card">

          <h2 className="titulo">Registrar Envio</h2>

          {feedback.msg && (
            <div className={`alerta ${feedback.tipo}`}>
              {feedback.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">

            <CampoTexto
              label="ID Usuário"
              type="number"
              valor={idUsuario}
              aoAlterado={setIdUsuario}
              obrigatorio
            />

            <CampoSelect
              label="Empresa"
              options={opcoesEmpresas}
              value={idEmpresa}
              aoAlterado={setIdEmpresa}
            />

            <CampoMultiSelect
              label="Embalagens"
              options={embalagens.map(e => ({
                id: e.id,
                descricao: e.descricao || e.tipo
              }))}
              value={itensSelecionados}
              aoAlterado={setItensSelecionados}
            />

            {itensSelecionados.length > 0 && (
              <div className="lista">

                {itensSelecionados.map(i => (
                  <div key={i.id} className="item-card">

                    <span>{i.nome}</span>

                    <input
                      type="number"
                      min="1"
                      value={i.quantidade}
                      onChange={(e) => {
                        const qtd = parseInt(e.target.value, 10);

                        if (!qtd || qtd < 1) return;

                        setItensSelecionados(prev =>
                          prev.map(item =>
                            item.id === i.id
                              ? { ...item, quantidade: qtd }
                              : item
                          )
                        );
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setItensSelecionados(prev =>
                          prev.filter(item => item.id !== i.id)
                        )
                      }
                    >
                      ✕
                    </button>

                  </div>
                ))}

              </div>
            )}

            <CampoTexto
              label="Observação"
              valor={observacao}
              aoAlterado={setObservacao}
              obrigatorio
            />

            <Botao disabled={loading}>
              {loading ? 'Enviando...' : 'Cadastrar'}
            </Botao>

          </form>
        </div>
      </div>
    </>
  );
}