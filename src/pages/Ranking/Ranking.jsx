import { useEffect, useState } from "react";
import Navbar from "../../componentes/Navbar/Navbar";
import rankingService from "../../services/rankingService";
import { getUserId, getRole } from "../../services/auth";
import "./Ranking.css";

const medalhas = ["🥇", "🥈", "🥉"];
const ITENS_POR_PAGINA = 10;

const roleParaTipoUsuario = {
    "Administrador": "administrador",
    "Funcionario": "empresa",
    "Usuario": "comum"
};

const Ranking = () => {

    const [dados, setDados] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const idUsuarioLogado = getUserId();
    const tipoUsuario = roleParaTipoUsuario[getRole()] ?? "comum";

    const usuarioLogado = dados?.itens?.find(
        (item) => String(item.idUsuario) === String(idUsuarioLogado)
    );

    const posicaoUsuario = usuarioLogado
        ? (pagina - 1) * ITENS_POR_PAGINA + usuarioLogado.posicao
        : null;

    useEffect(() => {
        carregarRanking(pagina);
    }, [pagina]);

    const carregarRanking = async (p) => {
        try {
            setCarregando(true);
            setErro(null);

            const resultado =
                await rankingService.getRanking(
                    p,
                    ITENS_POR_PAGINA
                );

            setDados(resultado);

        } catch {

            setErro(
                "Não foi possível carregar o ranking. Verifique se a API está rodando."
            );

        } finally {

            setCarregando(false);

        }
    };

    const irParaPagina = (p) => {

        if (p < 1 || p > (dados?.totalPaginas ?? 1))
            return;

        setPagina(p);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            <Navbar tipoUsuario={tipoUsuario} />

            <div className="rank-container">

                <div className="rank-header">

                    <div className="rank-titulo">
                        🏆 Ranking de Reciclagem
                    </div>

                    <div className="rank-subtitulo">
                        Os usuários que mais acumularam pontos com a reciclagem de embalagens
                    </div>

                    {!carregando && !erro && dados && posicaoUsuario && (
                        <p className="rank-posicao-usuario">
                            Sua posição é: {posicaoUsuario}º
                        </p>
                    )}

                </div>

                {carregando && (
                    <div className="rank-loading">
                        <div className="rank-spinner" />
                        <p>Carregando ranking...</p>
                    </div>
                )}

                {erro && (
                    <div className="rank-erro">
                        <span>⚠️</span>

                        <p>{erro}</p>

                        <button
                            className="rank-btn-tentar"
                            onClick={() => carregarRanking(pagina)}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!carregando && !erro && dados && (
                    <>
                        <p className="rank-total">
                            {dados.totalUsuarios} participante
                            {dados.totalUsuarios !== 1 ? "s" : ""}
                        </p>

                        <div className="rank-lista">

                            {dados.itens.map((item) => {

                                const ehLogado =
                                    String(item.idUsuario) ===
                                    String(idUsuarioLogado);

                                const posicaoGlobal =
                                    (pagina - 1) * ITENS_POR_PAGINA +
                                    item.posicao;

                                return (
                                    <div
                                        key={item.idUsuario}
                                        className={`rank-item ${
                                            ehLogado
                                                ? "rank-item--destaque"
                                                : ""
                                        }`}
                                    >
                                        <div className="rank-posicao">
                                            {posicaoGlobal <= 3 ? (
                                                <span className="rank-medalha">
                                                    {medalhas[posicaoGlobal - 1]}
                                                </span>
                                            ) : (
                                                <span className="rank-numero">
                                                    #{posicaoGlobal}
                                                </span>
                                            )}
                                        </div>

                                        <div className="rank-nome-area">

                                            <span className="rank-nome">
                                                {item.nomeUsuario}
                                            </span>

                                            {ehLogado && (
                                                <span className="rank-voce">
                                                    Você
                                                </span>
                                            )}

                                        </div>

                                        <div className="rank-envios">
                                            <span className="rank-envios-num">
                                                {item.totalEnvios}
                                            </span>

                                            <span className="rank-envios-label">
                                                envio
                                                {item.totalEnvios !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>

                                        <div className="rank-pontos">
                                            <span className="rank-pontos-num">
                                                {item.totalPontos.toLocaleString("pt-BR")}
                                            </span>

                                            <span className="rank-pontos-label">
                                                pts
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                        {dados.totalPaginas > 1 && (
                            <div className="rank-paginacao">

                                <button
                                    className="rank-pg-btn"
                                    onClick={() => irParaPagina(pagina - 1)}
                                    disabled={pagina === 1}
                                >
                                    ← Anterior
                                </button>

                                <span className="rank-pg-info">
                                    Página {pagina} de {dados.totalPaginas}
                                </span>

                                <button
                                    className="rank-pg-btn"
                                    onClick={() => irParaPagina(pagina + 1)}
                                    disabled={
                                        pagina === dados.totalPaginas
                                    }
                                >
                                    Próxima →
                                </button>

                            </div>
                        )}
                    </>
                )}

            </div>
        </>
    );
};

export default Ranking;