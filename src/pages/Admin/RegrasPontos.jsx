import { useEffect, useState, useMemo } from "react";
import ReactDOM from "react-dom";

import {
  getRegras,
  createRegra,
  patchRegra,
  deleteRegra,
} from "../../services/regraPontuacaoService";

import { getMateriais } from "../../services/materialService";

import "./RegrasPontos.css";
import Navbar from "../../componentes/Navbar/Navbar";

function RegrasPontos() {
  const [regras, setRegras] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [regraEditando, setRegraEditando] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [form, setForm] = useState({
    idMaterial: "",
    pontosPorPeso: "",
    descricao: "",
  });

  const carregar = () => {
    setCarregando(true);
    Promise.all([getRegras(), getMateriais()])
      .then(([regrasData, materiaisData]) => {
        setRegras(regrasData || []);
        setMateriais(materiaisData || []);
      })
      .catch(() => setErro("Não foi possível carregar os dados."))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar();
  }, []);

  const totalPaginas = Math.ceil(regras.length / itensPorPagina);

  const regrasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return regras.slice(inicio, fim);
  }, [regras, paginaAtual]);

  const nomeMaterial = (idMaterial) =>
    materiais.find((m) => m.id === idMaterial)?.nome ?? `Material ${idMaterial}`;

  const abrirModalNova = () => {
    setErro(null);
    setModoEdicao(false);
    setRegraEditando(null);
    setForm({ idMaterial: "", pontosPorPeso: "", descricao: "" });
    setModalAberto(true);
  };

  const abrirModalEditar = (regra) => {
    setErro(null);
    setModoEdicao(true);
    setRegraEditando(regra);
    setForm({
      idMaterial: regra.idMaterial ?? "",
      pontosPorPeso: regra.pontosPorPeso ?? "",
      descricao: regra.descricao ?? "",
    });
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setRegraEditando(null);
  };

  const handleSalvar = async () => {
    try {
      const payload = {
        idMaterial: Number(form.idMaterial),
        pontosPorPeso: Number(form.pontosPorPeso),
        descricao: form.descricao,
      };

      if (modoEdicao) {
        await patchRegra(regraEditando.id, payload);
      } else {
        await createRegra(payload);
      }

      fecharModal();
      carregar();
    } catch {
      setErro("Erro ao salvar regra.");
    }
  };

  return (
    <>
      <Navbar tipoUsuario={"administrador"} />

      <div className="regras-page">

        {/* HEADER PADRÃO */}
        <div className="regras-header">
          <h1 className="regras-titulo">Regras de Pontuação</h1>

          <button className="btn-add" onClick={abrirModalNova}>
            + Nova Regra
          </button>
        </div>

        {erro && <p className="erro">{erro}</p>}

        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Material</th>
                  <th>Pontos por grama</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {regrasPaginadas.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Nenhuma regra cadastrada.
                    </td>
                  </tr>
                ) : (
                  regrasPaginadas.map((regra) => (
                    <tr key={regra.id}>
                      <td>{regra.id}</td>
                      <td>{nomeMaterial(regra.idMaterial)}</td>
                      <td>{regra.pontosPorPeso}</td>
                      <td>{regra.descricao}</td>
                      <td>{regra.ativo ? "Ativa" : "Inativa"}</td>
                      <td>
                        <button onClick={() => abrirModalEditar(regra)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="paginacao">

                <button
                  className="paginacao-btn"
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(p => p - 1)}
                >
                  Anterior
                </button>

                <span className="paginacao-info">
                  Página {paginaAtual} de {totalPaginas}
                </span>

                <button
                  className="paginacao-btn"
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(p => p + 1)}
                >
                  Próxima
                </button>

              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL (mantido) */}
      {modalAberto &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{modoEdicao ? "Editar Regra" : "Nova Regra"}</h3>

              <select
                value={form.idMaterial}
                onChange={(e) => setForm({ ...form, idMaterial: e.target.value })}
              >
                <option value="">Material</option>
                {materiais.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={form.pontosPorPeso}
                onChange={(e) => setForm({ ...form, pontosPorPeso: e.target.value })}
              />

              <input
                type="text"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />

              <div className="modal-actions">
                <button onClick={fecharModal}>Cancelar</button>
                <button onClick={handleSalvar}>Salvar</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default RegrasPontos;