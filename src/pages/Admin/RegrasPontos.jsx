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

  const abrirModalNova = () => {
    setErro(null); // Limpa erros antigos ao abrir o modal
    setModoEdicao(false);
    setRegraEditando(null);
    setForm({
      idMaterial: "",
      pontosPorPeso: "",
      descricao: "",
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (regra) => {
    if (!regra) return;
    setErro(null); // Limpa erros antigos ao abrir o modal
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
    setForm({
      idMaterial: "",
      pontosPorPeso: "",
      descricao: "",
    });
  };

  const handleSalvar = async () => {
    // 1. Validação local: Impede salvar sem escolher um material
    if (!form.idMaterial) {
      setErro("Por favor, selecione um material.");
      return;
    }

    const idMaterialSelecionado = Number(form.idMaterial);

    // 2. Validação de duplicidade:
    if (modoEdicao && regraEditando) {
      // Se for EDIÇÃO: Verifica se o material escolhido já existe em OUTRA regra (com ID diferente da atual)
      const materialJaExiste = regras.some(
        (r) => r.idMaterial === idMaterialSelecionado && r.id !== regraEditando.id
      );
      if (materialJaExiste) {
        setErro(`Já existe uma regra cadastrada para o material "${nomeMaterial(idMaterialSelecionado)}".`);
        return;
      }
    } else {
      // Se for NOVA REGRA: Verifica se o material escolhido já existe em qualquer regra da lista
      const materialJaExiste = regras.some((r) => r.idMaterial === idMaterialSelecionado);
      if (materialJaExiste) {
        setErro(`Já existe uma regra cadastrada para o material "${nomeMaterial(idMaterialSelecionado)}".`);
        return;
      }
    }

    try {
      const dadosParaEnviar = {
        idMaterial: idMaterialSelecionado,
        pontosPorPeso: Number(form.pontosPorPeso),
        descricao: form.descricao,
      };

      if (modoEdicao && regraEditando) {
        await patchRegra(regraEditando.id, dadosParaEnviar);
      } else {
        await createRegra(dadosParaEnviar);
      }

      fecharModal();
      carregar();
    } catch {
      setErro("Erro ao salvar regra.");
    }
  };

  const abrirModalDelete = (regra) => {
    setErro(null);
    setRegraParaExcluir(regra);
    setModalDelete(true);
  };

  const fecharModalDelete = () => {
    setModalDelete(false);
    setRegraParaExcluir(null);
  };

  const handleExcluir = async () => {
    try {
      if (regraParaExcluir) {
        await deleteRegra(regraParaExcluir.id);
      }
      fecharModalDelete();
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
          <div className="regras-titulo">
            Regras de pontuação
          </div>

          <p className="regras-subtitulo">
            Ajuste a regra dos pontos para um envio.
          </p>
          <button className="btn-add" onClick={abrirModalNova}>
            + Nova regra
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
                {regras.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                      Nenhuma regra cadastrada.
                    </td>
                  </tr>
                ) : (
                  regras.map((regra) => (
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
                          <button className="btn-icon" onClick={() => abrirModalEditar(regra)}>
                            Editar
                          </button>
                          <button className="btn-icon danger" onClick={() => abrirModalDelete(regra)}>
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CRIAR / EDITAR */}
      {modalAberto &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <p className="delete-msg" style={{ textAlign: "left", marginBottom: "15px" }}>
                {modoEdicao ? "Editar regra" : "Nova regra de pontuação"}
              </p>

              {/* Exibe o erro focado dentro do modal se ele acontecer ao salvar */}
              {erro && <p className="erro" style={{ textAlign: "left" }}>{erro}</p>}

              <div className="form-group" style={{ textAlign: "left" }}>
                <label>Material</label>
                <select
                  value={form.idMaterial}
                  onChange={(e) => setForm({ ...form, idMaterial: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {materiais.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ textAlign: "left" }}>
                <label>Pontos por grama</label>
                <input
                  type="number"
                  value={form.pontosPorPeso}
                  onChange={(e) => setForm({ ...form, pontosPorPeso: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ textAlign: "left" }}>
                <label>Descrição</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button className="btn-cancel" onClick={fecharModal}>
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSalvar}>
                  Salvar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL EXCLUIR */}
      {modalDelete &&
        regraParaExcluir &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={fecharModalDelete}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="delete-icon">🗑️</div>
              <p className="delete-msg">Excluir regra?</p>
              <p className="delete-sub">
                A regra de <strong>{nomeMaterial(regraParaExcluir.idMaterial)}</strong> será desativada e não gerará mais pontos em novos envios.
              </p>
              <div className="modal-actions" style={{ justifyContent: "center" }}>
                <button className="btn-cancel" onClick={fecharModalDelete}>
                  Cancelar
                </button>
                <button className="btn-delete" onClick={handleExcluir}>
                  Sim, excluir
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