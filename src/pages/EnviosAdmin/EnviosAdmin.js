import { useEffect, useState } from "react";
import envioService from "../../services/envioService";
import empresaService from "../../services/empresaService";
import "./EnviosAdmin.css";
import Navbar from "../../componentes/Navbar/Navbar";

const EnviosAdmin = () => {
    const [envios, setEnvios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);

    const [envioEditando, setEnvioEditando] = useState(null);
    const [dataEnvio, setDataEnvio] = useState("");
    const [idEmpresa, setIdEmpresa] = useState("");
    const [quantidadeItens, setQuantidadeItens] = useState("");

    // PAGINAÇÃO
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 10;

    useEffect(() => {
        const carregar = async () => {
            try {
                const [resultadoEnvios, resultadoEmpresas] = await Promise.all([
                    envioService.listarEnvios({}),
                    empresaService.listarEmpresas()
                ]);

                if (resultadoEnvios.sucesso) {
                    setEnvios(resultadoEnvios.dados.dados);
                } else {
                    setErro("Não foi possível carregar os envios.");
                }

                setEmpresas(resultadoEmpresas.filter(e => e.ativo));
            } catch (err) {
                setErro("Erro ao conectar com o servidor.");
            } finally {
                setCarregando(false);
            }
        };

        carregar();
    }, []);

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR");
    };

    const handleCancelar = async (id) => {
        const confirmar = window.confirm("Deseja cancelar este envio?");
        if (!confirmar) return;

        const resultado = await envioService.cancelarEnvio(id);

        if (resultado.sucesso) {
            setEnvios((prev) =>
                prev.map((e) =>
                    e.id === id ? { ...e, statusEnvio: "Cancelado" } : e
                )
            );

            setMensagem({ tipo: "sucesso", texto: "Envio cancelado com sucesso!" });
        } else {
            setMensagem({ tipo: "erro", texto: resultado.mensagem });
        }
    };

    const abrirEdicao = (envio) => {
        setEnvioEditando(envio);
        setDataEnvio(new Date(envio.dataEnvio).toISOString().split("T")[0]);
        setIdEmpresa(envio.idEmpresa);
        setQuantidadeItens(envio.quantidadeItens);
    };

    const handleEditar = async (e) => {
        e.preventDefault();

        const resultado = await envioService.editarEnvio(envioEditando.id, {
            dataEnvio: new Date(dataEnvio).toISOString(),
            idEmpresa: parseInt(idEmpresa),
            quantidadeItens: parseInt(quantidadeItens),
        });

        if (resultado.sucesso) {
            setEnvios((prev) =>
                prev.map((env) =>
                    env.id === envioEditando.id
                        ? {
                            ...env,
                            dataEnvio,
                            nomeEmpresa: empresas.find(e => e.id === parseInt(idEmpresa))?.nome,
                            quantidadeItens: parseInt(quantidadeItens),
                        }
                        : env
                )
            );

            setMensagem({ tipo: "sucesso", texto: "Envio atualizado com sucesso!" });
            setEnvioEditando(null);
        } else {
            setMensagem({ tipo: "erro", texto: resultado.mensagem });
        }
    };

    // =========================
    // PAGINAÇÃO
    // =========================
    const indiceUltimo = paginaAtual * itensPorPagina;
    const indicePrimeiro = indiceUltimo - itensPorPagina;

    const enviosPaginados = envios.slice(indicePrimeiro, indiceUltimo);

    const totalPaginas = Math.ceil(envios.length / itensPorPagina);

    const mudarPagina = (pagina) => {
        setPaginaAtual(pagina);
    };

    if (carregando)
        return (
            <>
                <Navbar />
                <p className="envios-admin__mensagem">Carregando envios...</p>
            </>
        );

    if (erro)
        return (
            <>
                <Navbar />
                <p className="envios-admin__mensagem envios-admin__mensagem--erro">{erro}</p>
            </>
        );

    return (
        <>
            <Navbar />

            <div className="envios-admin">

                <div className="envios__titulo">
                    Gerenciar Envios
                </div>

                <p className="subtitulo-pagina">
                    Edite ou cancele os envios realizados pelos usuários.
                </p>

                {mensagem && (
                    <p className={`envios-admin__feedback envios-admin__feedback--${mensagem.tipo}`}>
                        {mensagem.texto}
                    </p>
                )}

                {envios.length === 0 ? (
                    <p className="envios-admin__mensagem">Nenhum envio encontrado.</p>
                ) : (
                    <div className="tabela-wrapper">

                        <table className="envios-admin__tabela">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Usuário</th>
                                    <th>Empresa</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Qtd.</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {enviosPaginados.map((envio) => (
                                    <tr key={envio.id}>
                                        <td>{envio.id}</td>
                                        <td>{envio.nomeUsuario}</td>
                                        <td>{envio.nomeEmpresa}</td>
                                        <td>{formatarData(envio.dataEnvio)}</td>
                                        <td>
                                            <span className={`envios-admin__status envios-admin__status--${envio.statusEnvio?.toLowerCase()}`}>
                                                {envio.statusEnvio}
                                            </span>
                                        </td>
                                        <td>{envio.quantidadeItens}</td>
                                        <td className="envios-admin__acoes">
                                            <button
                                                className="envios-admin__btn envios-admin__btn--editar"
                                                onClick={() => abrirEdicao(envio)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="envios-admin__btn envios-admin__btn--excluir"
                                                onClick={() => handleCancelar(envio.id)}
                                            >
                                                Cancelar
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
                                    onClick={() => mudarPagina(paginaAtual - 1)}
                                >
                                    Anterior
                                </button>

                                <span className="paginacao-info">
                                    Página {paginaAtual} de {totalPaginas}
                                </span>

                                <button
                                    className="paginacao-btn"
                                    disabled={paginaAtual === totalPaginas}
                                    onClick={() => mudarPagina(paginaAtual + 1)}
                                >
                                    Próxima
                                </button>

                            </div>
                        )}

                    </div>
                )}

                {/* MODAL */}
                {envioEditando && (
                    <div className="envios-admin__modal-overlay">
                        <div className="envios-admin__modal">

                            <div className="formEnvios__titulo">
                                Editar Envio #{envioEditando.id}
                            </div>

                            <form onSubmit={handleEditar}>

                                <div className="envios-admin__campo">
                                    <label>Data do envio</label>
                                    <input
                                        type="date"
                                        value={dataEnvio}
                                        onChange={(e) => setDataEnvio(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="envios-admin__campo">
                                    <label>Empresa</label>
                                    <select
                                        value={idEmpresa}
                                        onChange={(e) => setIdEmpresa(e.target.value)}
                                        required
                                    >
                                        <option value="">Selecione uma empresa</option>
                                        {empresas.map((empresa) => (
                                            <option key={empresa.id} value={empresa.id}>
                                                {empresa.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="envios-admin__campo">
                                    <label>Quantidade de embalagens</label>
                                    <input
                                        type="number"
                                        value={quantidadeItens}
                                        onChange={(e) => setQuantidadeItens(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="envios-admin__modal-acoes">

                                    <button type="submit" className="envios-admin__btn envios-admin__btn--editar">
                                        Salvar
                                    </button>

                                    <button
                                        type="button"
                                        className="envios-admin__btn envios-admin__btn--cancelar"
                                        onClick={() => setEnvioEditando(null)}
                                    >
                                        Cancelar
                                    </button>

                                </div>

                            </form>

                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default EnviosAdmin;