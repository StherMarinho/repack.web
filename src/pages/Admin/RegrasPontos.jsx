import { useEffect, useState } from "react";
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

  const [form, setForm] = useState({
    idMaterial: "",
    pontosPorPeso: "",
    descricao: "",
  });

  const [modalDelete, setModalDelete] = useState(false);
  const [regraParaExcluir, setRegraParaExcluir] = useState(null);

  // 🔥 PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

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

  const nomeMaterial = (idMaterial) =>
    materiais.find((m) => m.id === idMaterial)?.nome ??
    `Material ${idMaterial}`;

  // 🔥 PAGINAÇÃO CALCULADA
  const totalPaginas = Math.ceil(regras.length / itensPorPagina);

  const regrasPaginadas = regras.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const abrirModalNova = () => {
    setErro(null);
    setModoEdicao(false);
    setRegraEditando(null);
    setForm({ idMaterial: "", pontosPorPeso: "", descricao: "" });
    setModalAberto(true);
  };

  const abrirModalEditar = (regra) => {
    if (!regra) return;
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

  const abrirModalDelete = (regra) => {
    setRegraParaExcluir(regra);
    setModalDelete(true);
  };

  const handleExcluir = async () => {
    try {
      await deleteRegra(regraParaExcluir.id);
      setModalDelete(false);
      carregar();
    } catch {
      setErro("Erro ao excluir regra.");
    }
  };

  return (
    <>
      <Navbar tipoUsuario={"administrador"} />

      <div className="regras-page">

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
                  <th>Pontos</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {regras.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
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
                      <td>
                        <span className={`badge ${regra.ativo ? "badge-active" : "badge-inactive"}`}>
                          {regra.ativo ? "Ativa" : "Inativa"}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button onClick={() => abrirModalEditar(regra)}>Editar</button>
                          <button onClick={() => abrirModalDelete(regra)}>Excluir</button>
                        </div>
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

      {/* MODAIS (inalterados) */}
      {modalAberto &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>{modoEdicao ? "Editar Regra" : "Nova Regra"}</h3>

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