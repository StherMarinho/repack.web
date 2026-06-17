import { useEffect, useState } from "react";
import Navbar from "../../componentes/Navbar/Navbar";
import envioService from "../../services/envioService";
import "./VerEnvios.css";

const FILTROS = [
    { label: "Todos", valor: null },
    { label: "Pendentes", valor: 1 },
    { label: "Concluídos", valor: 2 },
    { label: "Cancelados", valor: 3 },
];

const badgeStatus = (status) => {
    if (!status) return <span className="badge-status badge-pendente">Pendente</span>;
    const s = status.toLowerCase();
    if (s.includes("conclu")) return <span className="badge-status badge-concluido">{status}</span>;
    if (s.includes("cancel")) return <span className="badge-status badge-cancelado">{status}</span>;
    return <span className="badge-status badge-pendente">{status}</span>;
};

const formatarData = (dataString) => {
    if (!dataString) return "—";
    const data = new Date(dataString);
    return (
        data.toLocaleDateString("pt-BR") + " " +
        data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
};

const VerEnvios = () => {
    const [envios, setEnvios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    const carregarEnvios = async (idStatus = null) => {
        try {
            setCarregando(true);
            setErro(null);
            const resposta = await envioService.listarEnvios(
                idStatus ? { idStatus } : {}
            );
            const lista =
                resposta?.dados?.dados ??
                resposta?.dados ??
                resposta ??
                [];
            setEnvios(Array.isArray(lista) ? lista : []);
        } catch (err) {
            setErro("Erro ao carregar os envios.");
            console.error(err);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarEnvios(filtroAtivo);
    }, [filtroAtivo]);

    return (
        <>
            <Navbar tipoUsuario={"empresa"} />
            <div className="cabecalho-pagina">
                <h1 className="titulo-pagina">Envios Recebidos</h1>
                <p className="subtitulo-pagina">
                    Acompanhe as embalagens entregues pelos usuários para análise e pontuação.
                </p>
            </div>

            <div className="painel-container">
                <div className="filtros">
                    {FILTROS.map((f) => (
                        <button
                            key={f.label}
                            className={`filtro-btn ${filtroAtivo === f.valor ? "ativo" : ""}`}
                            onClick={() => setFiltroAtivo(f.valor)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {carregando ? (
                    <p className="mensagem-carregando">Carregando envios...</p>
                ) : erro ? (
                    <p className="mensagem-erro">{erro}</p>
                ) : envios.length === 0 ? (
                    <div className="mensagem-vazia">
                        <p>Nenhum envio encontrado.</p>
                    </div>
                ) : (
                    <div className="tabela-wrapper">
                        <table className="tabela-envios">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuário</th>
                                    <th>Qtd. Itens</th>
                                    <th>Data e Hora</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {envios.map((envio) => (
                                    <tr key={envio.id}>
                                        <td>
                                            <span className="badge-id-envio">#{envio.id}</span>
                                        </td>
                                        <td>{envio.nomeUsuario ?? "—"}</td>
                                        <td><strong>{envio.quantidadeItens}</strong> itens</td>
                                        <td>{formatarData(envio.dataEnvio)}</td>
                                        <td>{badgeStatus(envio.statusEnvio)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default VerEnvios;