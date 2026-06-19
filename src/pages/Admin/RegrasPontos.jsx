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

  const [modalDelete, setModalDelete] = useState(false);
  const [regraParaExcluir, setRegraParaExcluir] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const [form, setForm] = useState({
    idMaterial: "",
    pontosPorPeso: "",
    descricao: "",
  });

  const carregar = async () => {
    try {
      setCarregando(true);
      const [regrasData, materiaisData] = await Promise.all([
        getRegras(),
        getMateriais(),
      ]);

      setRegras(regrasData || []);
      setMateriais(materiaisData || []);
    } catch {
      setErro("Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(regras.length / itensPorPagina));
  }, [regras]);

  const regrasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return regras.slice(inicio, inicio + itensPorPagina);
  }, [regras, paginaAtual]);

  // 🔥 garante pagina válida SEM bug
  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
    if (paginaAtual < 1) {
      setPaginaAtual(1);
    }
  }, [totalPaginas, paginaAtual]);

  const nomeMaterial = (id) =>
    materiais.find((m) => m.id === id)?.nome ?? "Material";

  const abrirModalNova = () => {
    setModoEdicao(false);
    setRegraEditando(null);
    setForm({ idMaterial: "", pontosPorPeso: "", descricao: "" });
    setModalAberto(true);
  };

  const abrirModalEditar = (regra) => {
    setModoEdicao(true);
    setRegraEditando(regra);
    setForm({
      idMaterial: regra.idMaterial,
      pontosPorPeso: regra.pontosPorPeso,
      descricao: regra.descricao,
    });
    setModalAberto(true);
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

      setModalAberto(false);
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

  if (carregando) return <p>Carregando...</p>;

  return (
    <>
      <Navbar tipoUsuario="administrador" />

      <div className="regras-page">

        <div className="regras-header">
          <h1 className="regras-titulo">Regras de Pontuação</h1>

          <button className="btn-add" onClick={abrirModalNova}>
            + Nova Regra
          </button>
        </div>

        {erro && <p className="erro">{erro}</p>}

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
              {regrasPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={6}>Nenhuma regra cadastrada.</td>
                </tr>
              ) : (
                regrasPaginadas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{nomeMaterial(r.idMaterial)}</td>
                    <td>{r.pontosPorPeso}</td>
                    <td>{r.descricao}</td>
                    <td>{r.ativo ? "Ativa" : "Inativa"}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => abrirModalEditar(r)}>Editar</button>
                        <button onClick={() => abrirModalDelete(r)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPaginas > 1 && (
            <div className="paginacao">

              <button
                className="paginacao-btn"
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual((p) => p - 1)}
              >
                Anterior
              </button>

              <span className="paginacao-info">
                Página {paginaAtual} de {totalPaginas}
              </span>

              <button
                className="paginacao-btn"
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual((p) => p + 1)}
              >
                Próxima
              </button>

            </div>
          )}
        </div>
      </div>

      {/* MODAL DELETE */}
      {modalDelete &&
        ReactDOM.createPortal(
          <div className="modal-overlay">
            <div className="delete-modal">

              <h3>Confirmar exclusão?</h3>
              <p>{regraParaExcluir?.descricao}</p>

              <div className="modal-actions">
                <button onClick={() => setModalDelete(false)}>
                  Cancelar
                </button>

                <button onClick={handleExcluir}>
                  Excluir
                </button>
              </div>

            </div>
          </div>,
          document.body
        )}

    </>
  );
}

export default RegrasPontos;