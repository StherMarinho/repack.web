import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import empresaService from "../../services/empresaService";

import Navbar from "../../componentes/Navbar/Navbar";
import "./Empresas.css";

function Empresas() {

    const [empresas, setEmpresas] = useState([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);

    const [empresaEditando, setEmpresaEditando] = useState(null);

    const [modalDelete, setModalDelete] = useState(false);
    const [empresaExcluir, setEmpresaExcluir] = useState(null);

    const formInicial = {
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        latitude: "",
        longitude: "",
        ativo: true
    };

    const [form, setForm] = useState(formInicial);

    const carregar = async () => {

        setCarregando(true);

        try {
            const dados = await empresaService.listarEmpresas();
            setEmpresas(dados || []);

        } catch {
            setErro("Erro ao carregar empresas.");
        } finally {
            setCarregando(false);
        }

    };

    useEffect(() => {
        carregar();
    }, []);

    const abrirNovaEmpresa = () => {
        setErro("");
        setModoEdicao(false);
        setEmpresaEditando(null);
        setForm(formInicial);
        setModalAberto(true);
    };
    const abrirEditar = (empresa) => {
        setErro("");
        setModoEdicao(true);
        setEmpresaEditando(empresa);
        setForm({
            nome: empresa.nome ?? "",
            cnpj: empresa.cnpj ?? "",
            telefone: empresa.telefone ?? "",
            email: empresa.email ?? "",
            cep: empresa.cep ?? "",
            logradouro: empresa.logradouro ?? "",
            numero: empresa.numero ?? "",
            bairro: empresa.bairro ?? "",
            cidade: empresa.cidade ?? "",
            estado: empresa.estado ?? "",
            latitude: empresa.latitude ?? "",
            longitude: empresa.longitude ?? "",
            ativo: empresa.ativo
        });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setEmpresaEditando(null);
        setForm(formInicial);
    };

    const salvar = async () => {
        try {
            const dto = {
                ...form,
                latitude:
                    form.latitude === "" ? null : Number(form.latitude),
                longitude:
                    form.longitude === "" ? null : Number(form.longitude)
            };

            if (modoEdicao) {
                await empresaService.atualizarEmpresa(
                    empresaEditando.id,
                    dto
                );

            } else {
                await empresaService.criarEmpresa(dto);
            }

            fecharModal();
            carregar();

        } catch (e) {
            setErro(e.message);
        }
    };

    const abrirDelete = (empresa) => {
        setEmpresaExcluir(empresa);
        setModalDelete(true);
    };

    const excluir = async () => {
        try {
            await empresaService.deletarEmpresa(empresaExcluir.id);
            setModalDelete(false);
            carregar();
        } catch {
            setErro("Erro ao excluir empresa.");
        }
    };

    return (
        <>
            <Navbar tipoUsuario={"administrador"} />
            <div className="regras-page">
                <div className="regras-header">
                    <h1 className="regras-titulo">
                        Empresas
                    </h1>
                    <button
                        className="btn-add"
                        onClick={abrirNovaEmpresa}
                    >
                        + Nova empresa
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
                                <th>ID</th>
                                <th>Nome</th>
                                <th>CNPJ</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>CEP</th>
                                <th>Logradouro</th>
                                <th>Número</th>
                                <th>Bairro</th>
                                <th>Cidade</th>
                                <th>Estado</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                            <tbody>
                                {empresas.length === 0 ? (
                                    <tr>
                                        <td colSpan={15} style={{ textAlign: "center" }}>
                                            Nenhuma empresa cadastrada.
                                        </td>
                                    </tr>
                                ) : (empresas.map((empresa) => (
                                        <tr key={empresa.id}>
                                            <td>{empresa.id}</td>
                                            <td>{empresa.nome}</td>
                                            <td>{empresa.cnpj}</td>
                                            <td>{empresa.telefone}</td>
                                            <td>{empresa.email}</td>
                                            <td>{empresa.cep}</td>
                                            <td>{empresa.logradouro}</td>
                                            <td>{empresa.numero}</td>
                                            <td>{empresa.bairro}</td>
                                            <td>{empresa.cidade}</td>
                                            <td>{empresa.estado}</td>
                                            <td>{empresa.latitude}</td>
                                            <td>{empresa.longitude}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        empresa.ativo
                                                            ? "badge-active"
                                                            : "badge-inactive"
                                                    }`}
                                                >
                                                    {empresa.ativo ? "Ativa" : "Inativa"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => abrirEditar(empresa)}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="btn-icon danger"
                                                        onClick={() => abrirDelete(empresa)}
                                                    >
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
            {modalAberto &&
                ReactDOM.createPortal(
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2 className="modal-titulo">
                                {modoEdicao ? "Editar empresa" : "Nova empresa"}
                            </h2>

                            {erro && <p className="erro">{erro}</p>}

                            {/* AREA DE SCROLL INICIA AQUI */}
                            <div className="modal-content-scroll">
                                <div className="form-group">
                                    <label>Nome</label>
                                    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>CNPJ</label>
                                    <input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
                                </div>
                                <div className="form-group">
                                <label>Telefone</label>
                                <input
                                    value={form.telefone} onChange={(e) => setForm({
                                            ...form,
                                            telefone: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>CEP</label>
                                <input
                                    value={form.cep}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cep: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Logradouro</label>
                                <input
                                    value={form.logradouro}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            logradouro: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Número</label>
                                <input
                                    value={form.numero}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            numero: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Bairro</label>
                                <input
                                    value={form.bairro}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            bairro: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Cidade</label>
                                <input
                                    value={form.cidade}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            cidade: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <input
                                    value={form.estado}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            estado: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Latitude</label>
                                <input
                                    type="number"
                                    value={form.latitude}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            latitude: e.target.value
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Longitude</label>
                                <input
                                    type="number"
                                    value={form.longitude}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            longitude: e.target.value
                                        })
                                    }
                                />
                            </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.value === "true" })}>
                                        <option value={true}>Ativa</option>
                                        <option value={false}>Inativa</option>
                                    </select>
                                </div>
                            </div>
                            {/* AREA DE SCROLL TERMINA AQUI */}

                            {/* Os botões ficam fixos no rodapé do modal */}
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={fecharModal}>
                                    Cancelar
                                </button>
                                <button className="btn-save" onClick={salvar}>
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {modalDelete &&
                ReactDOM.createPortal(
                    <div
                        className="modal-overlay"
                        onClick={() => setModalDelete(false)}
                    >
                        <div
                            className="delete-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="delete-icon">🗑️</div>
                            <p className="delete-msg">
                                Excluir empresa?
                            </p>
                            <p className="delete-sub">
                                A empresa <strong>{empresaExcluir?.nome}</strong>
                                {" "}será removida do sistema.
                            </p>
                            <div
                                className="modal-actions"
                                style={{ justifyContent: "center" }}
                            >
                                <button
                                    className="btn-cancel"
                                    onClick={() => setModalDelete(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={excluir}
                                >
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

export default Empresas;