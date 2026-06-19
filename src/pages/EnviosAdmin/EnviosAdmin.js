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
                    setEnvios(resultadoEnvios.dados.dados || []);
                } else {
                    setErro("Não foi possível carregar os envios.");
                }

                setEmpresas(resultadoEmpresas.filter(e => e.ativo));
            } catch {
                setErro("Erro ao conectar com o servidor.");
            } finally {
                setCarregando(false);
            }
        };

        carregar();
    }, []);

    // RESET página ao mudar lista
    useEffect(() => {
        setPaginaAtual(1);
    }, [envios.length]);

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

    const totalPaginas = Math.max(
        1,
        Math.ceil(envios.length / itensPorPagina)
    );

    if (carregando) {
        return (
            <>
                <Navbar />
                <p className="envios-admin__mensagem">Carregando envios...</p>
            </>
        );
    }

    if (erro) {
        return (
            <>
                <Navbar />
                <p className="envios-admin__mensagem envios-admin__mensagem--erro">
                    {erro}
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="envios-admin">

                <div className="envios__titulo">Gerenciar Envios</div>

                <p className="subtitulo-pagina">
                    Edite ou cancele os envios realizados pelos usuários.
                </p>

                {mensagem && (
                    <p className={`envios-admin__feedback envios-admin__feedback--${mensagem.tipo}`}>
                        {mensagem.texto}
                    </p>
                )}

                {envios.length === 0 ? (
                    <p className="envios-admin__mensagem">
                        Nenhum envio encontrado.
                    </p>
                ) : (
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
                )}

                {/* PAGINAÇÃO */}
                {envios.length > itensPorPagina && (
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
        </>
    );
};

export default EnviosAdmin;