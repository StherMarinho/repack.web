import React, { useState, useEffect } from 'react';
import './AvaliarEnvios.css';
import envioService from '../../services/envioService';
import { getRegras } from '../../services/regraPontuacaoService';
import Navbar from '../../componentes/Navbar/Navbar';

export default function AvaliarEnvio() {
  const [envios, setEnvios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [envioSelecionado, setEnvioSelecionado] = useState(null);
  const [statusAcao, setStatusAcao] = useState(""); 
  const [pontos, setPontos] = useState(0);
  const [carregandoPontos, setCarregandoPontos] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);

  const STATUS_PENDENTE = 1; 

  const carregarEnviosPendentes = async () => {
    try {
      setCarregando(true);
      const resposta = await envioService.listarEnvios({ idStatus: STATUS_PENDENTE });

      if (resposta && resposta.dados && Array.isArray(resposta.dados.dados)) {
        setEnvios(resposta.dados.dados);
      } else {
        setEnvios([]);
      }
    } catch (err) {
      setErro("Erro ao carregar os envios pendentes.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEnviosPendentes();
  }, []);

const calcularPontos = async (envio) => {
  try {
    setCarregandoPontos(true);

    const envioCompleto = await envioService.obterEnvio(envio.id);
    const regras = await getRegras();

    const itens =
      envioCompleto?.dados?.itens ||
      envioCompleto?.itens ||
      [];

    const regrasMap = {};

    regras.forEach(regra => {
      regrasMap[regra.idMaterial] =
        Number(regra.pontosPorPeso || 0);
    });

    let totalPontos = 0;

    itens.forEach(item => {
      const pontosPorPeso = regrasMap[item.idMaterial];

      if (pontosPorPeso !== undefined) {
        totalPontos +=
          Number(item.pesoMedio || 0) * pontosPorPeso;
      }
    });

    setPontos(totalPontos);
  } catch (err) {
    console.error("Erro ao calcular pontuação:", err);
    setPontos(0);
  } finally {
    setCarregandoPontos(false);
  }
};

  const abrirModal = async (envio, acao) => {
    setEnvioSelecionado(envio);
    setStatusAcao(acao);
    setJustificativa("");
    setPontos(0);

    if (acao === "Aprovado") {
      await calcularPontos(envio);
    }
  };

  const handleSalvarAvaliacao = async (e) => {
    e.preventDefault();
    if (!envioSelecionado || carregandoPontos) return;

    const avaliarDTO = {
      idStatusEnvio: statusAcao === "Aprovado" ? 2 : 3,
      observacao: statusAcao === "Rejeitado" ? justificativa : "Aprovado"
    };

    try {
      setEnviandoAvaliacao(true);
      await envioService.avaliarEnvio(envioSelecionado.id, avaliarDTO);
      setEnvioSelecionado(null);
      carregarEnviosPendentes();
    } catch (err) {
      alert("Erro ao salvar a avaliação do envio.");
      console.error(err);
    } finally {
      setEnviandoAvaliacao(false);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "—";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  if (carregando) return <div className="mensagem-carregando">Carregando envios pendentes...</div>;
  if (erro) return <div className="mensagem-erro">{erro}</div>;

  return (
    <>
    <Navbar tipoUsuario={"empresa"}/>
    <div className="painel-container">
      <h2 className="painel-titulo">Avaliar Envios</h2>
      
      {envios.length === 0 ? (
        <div className="mensagem-vazia">
          <h3>Não há nenhum envio pendente</h3>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-envios">
            <thead>
              <tr>
                <th>ID do Envio</th>
                <th>Usuário</th>
                <th>Empresa</th>
                <th>Qtd. Itens</th>
                <th>Data e Hora de Envio</th>
                <th>Status Atual</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(envios) && envios.map((envio) => (
                <tr key={envio.id}>
                  <td><span className="badge-id-envio">#{envio.id}</span></td>
                  <td><span className="nome-usuario-destaque">{envio.nomeUsuario}</span></td>
                  <td><span className="nome-empresa-texto">{envio.nomeEmpresa}</span></td>
                  <td><strong>{envio.quantidadeItens}</strong> itens</td>
                  <td>{formatarData(envio.dataEnvio)}</td>
                  <td><span className="badge-status-atual">{envio.statusEnvio || "Pendente"}</span></td>
                  <td>
                    <button onClick={() => abrirModal(envio, "Aprovado")} className="btn btn-aprovar">Aprovar</button>
                    <button onClick={() => abrirModal(envio, "Rejeitado")} className="btn btn-rejeitar">Rejeitar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {envioSelecionado && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Avaliar Envio #{envioSelecionado.id}</h3>
            
            <p className="modal-info">
              Atualizar o status deste envio para:{" "}
              <span className={`badge-status-modal ${statusAcao === "Aprovado" ? "aprovado" : "rejeitado"}`}>
                {statusAcao}
              </span>
            </p>

            <form onSubmit={handleSalvarAvaliacao}>
              {statusAcao === "Aprovado" ? (
                <div className="form-group">
                  <label>Pontuação dada pelas regras da empresa:</label>
                  {carregandoPontos ? (
                    <div className="texto-calculando-pontos">
                      Calculando
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      disabled
                      className="form-input input-pontos-automatico"
                      value={`${pontos} pontos correspondentes`} 
                    />
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label>Motivo da Rejeição:</label>
                  <textarea 
                    required
                    rows="4"
                    className="form-textarea"
                    value={justificativa} 
                    onChange={(e) => setJustificativa(e.target.value)} 
                    placeholder="Explique o motivo da rejection do envio"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setEnvioSelecionado(null)} 
                  disabled={enviandoAvaliacao}
                  className="btn btn-cancelar"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={enviandoAvaliacao || carregandoPontos}
                  className={`btn ${statusAcao === "Aprovado" ? "btn-aprovar" : "btn-rejeitar"}`}
                >
                  {enviandoAvaliacao ? "Processando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}