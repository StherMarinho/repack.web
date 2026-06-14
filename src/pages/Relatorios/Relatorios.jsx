import { useEffect, useState } from "react";
import Navbar from "../../componentes/Navbar/Navbar";
import relatorioService from "../../services/relatorioService";
import "./Relatorios.css";

const Relatorios = () => {

    const [envios, setEnvios] = useState(null);
    const [embalagens, setEmbalagens] = useState([]);
    const [pontuacao, setPontuacao] = useState(null);
    const [usuarios, setUsuarios] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            setErro(null);

            const [dadosEnvios, dadosEmbalagens, dadosPontuacao, dadosUsuarios] =
                await Promise.all([
                    relatorioService.getEstatisticasEnvios(),
                    relatorioService.getEmbalagensMaisRecebidas(5),
                    relatorioService.getEstatisticasPontuacao(),
                    relatorioService.getEstatisticasUsuarios()
                ]);

            setEnvios(dadosEnvios);
            setEmbalagens(dadosEmbalagens);
            setPontuacao(dadosPontuacao);
            setUsuarios(dadosUsuarios);

        } catch (e) {
            setErro("Não foi possível carregar os relatórios. Verifique se a API está rodando.");
        } finally {
            setCarregando(false);
        }
    };

    // Calcula a largura proporcional das barras do gráfico de embalagens
    const maiorQuantidade = embalagens.length > 0
        ? Math.max(...embalagens.map(e => e.quantidadeRecebida))
        : 1;

    // Calcula percentuais para o gráfico de pizza de envios
    const totalEnvios = envios?.totalEnvios || 1;
    const pctConcluidos = Math.round((envios?.enviosConcluidos / totalEnvios) * 100) || 0;
    const pctPendentes = Math.round((envios?.enviosPendentes / totalEnvios) * 100) || 0;
    const pctCancelados = Math.round((envios?.enviosCancelados / totalEnvios) * 100) || 0;

    if (carregando) {
        return (
            <>
                <Navbar tipoUsuario="administrador" />
                <div className="rel-loading">
                    <div className="rel-spinner" />
                    <p>Carregando relatórios...</p>
                </div>
            </>
        );
    }

    if (erro) {
        return (
            <>
                <Navbar tipoUsuario="administrador" />
                <div className="rel-erro">
                    <span className="rel-erro-icone">⚠️</span>
                    <p>{erro}</p>
                    <button className="rel-btn-tentar" onClick={carregarDados}>
                        Tentar novamente
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar tipoUsuario="administrador" />

            <div className="rel-container">

                <div className="rel-header">
                    <h1 className="rel-titulo">Relatórios</h1>
                    <p className="rel-subtitulo">Visão geral do sistema Repack</p>
                </div>

                {/* SEÇÃO: USUÁRIOS */}
                <section className="rel-secao">
                    <h2 className="rel-secao-titulo">👥 Usuários</h2>
                    <div className="rel-cards">

                        <div className="rel-card rel-card--verde">
                            <span className="rel-card-numero">{usuarios?.totalUsuariosAtivos ?? 0}</span>
                            <span className="rel-card-label">Ativos</span>
                        </div>

                        <div className="rel-card rel-card--cinza">
                            <span className="rel-card-numero">{usuarios?.totalUsuariosInativos ?? 0}</span>
                            <span className="rel-card-label">Inativos</span>
                        </div>

                        <div className="rel-card rel-card--azul">
                            <span className="rel-card-numero">{usuarios?.novosUsuariosNoMes ?? 0}</span>
                            <span className="rel-card-label">Novos este mês</span>
                        </div>

                    </div>
                </section>

                {/* SEÇÃO: ENVIOS */}
                <section className="rel-secao">
                    <h2 className="rel-secao-titulo">📦 Envios</h2>
                    <div className="rel-envios-grid">

                        {/* Cards de envio */}
                        <div className="rel-cards rel-cards--coluna">
                            <div className="rel-card rel-card--destaque">
                                <span className="rel-card-numero">{envios?.totalEnvios ?? 0}</span>
                                <span className="rel-card-label">Total de envios</span>
                            </div>
                            <div className="rel-card rel-card--destaque">
                                <span className="rel-card-numero">{envios?.totalItens ?? 0}</span>
                                <span className="rel-card-label">Total de itens</span>
                            </div>
                        </div>

                        {/* Gráfico de barras por status */}
                        <div className="rel-grafico-status">
                            <h3 className="rel-grafico-titulo">Distribuição por status</h3>

                            <div className="rel-barra-item">
                                <span className="rel-barra-label">Concluídos</span>
                                <div className="rel-barra-track">
                                    <div
                                        className="rel-barra-fill rel-barra-fill--verde"
                                        style={{ width: `${pctConcluidos}%` }}
                                    />
                                </div>
                                <span className="rel-barra-valor">
                                    {envios?.enviosConcluidos ?? 0} ({pctConcluidos}%)
                                </span>
                            </div>

                            <div className="rel-barra-item">
                                <span className="rel-barra-label">Pendentes</span>
                                <div className="rel-barra-track">
                                    <div
                                        className="rel-barra-fill rel-barra-fill--amarelo"
                                        style={{ width: `${pctPendentes}%` }}
                                    />
                                </div>
                                <span className="rel-barra-valor">
                                    {envios?.enviosPendentes ?? 0} ({pctPendentes}%)
                                </span>
                            </div>

                            <div className="rel-barra-item">
                                <span className="rel-barra-label">Cancelados</span>
                                <div className="rel-barra-track">
                                    <div
                                        className="rel-barra-fill rel-barra-fill--vermelho"
                                        style={{ width: `${pctCancelados}%` }}
                                    />
                                </div>
                                <span className="rel-barra-valor">
                                    {envios?.enviosCancelados ?? 0} ({pctCancelados}%)
                                </span>
                            </div>

                        </div>
                    </div>
                </section>

                {/* SEÇÃO: PONTUAÇÃO */}
                <section className="rel-secao">
                    <h2 className="rel-secao-titulo">⭐ Pontuação</h2>
                    <div className="rel-cards">

                        <div className="rel-card rel-card--amarelo">
                            <span className="rel-card-numero">{pontuacao?.totalPontosDistribuidos ?? 0}</span>
                            <span className="rel-card-label">Total distribuído</span>
                        </div>

                        <div className="rel-card rel-card--azul">
                            <span className="rel-card-numero">{pontuacao?.mediaPontosPorUsuario ?? 0}</span>
                            <span className="rel-card-label">Média por usuário</span>
                        </div>

                        <div className="rel-card rel-card--verde">
                            <span className="rel-card-numero">{pontuacao?.maiorPontuacao ?? 0}</span>
                            <span className="rel-card-label">Maior pontuação</span>
                        </div>

                        <div className="rel-card rel-card--cinza">
                            <span className="rel-card-numero">{pontuacao?.usuariosComPontuacao ?? 0}</span>
                            <span className="rel-card-label">Usuários pontuados</span>
                        </div>

                    </div>
                </section>

                {/* SEÇÃO: EMBALAGENS */}
                <section className="rel-secao">
                    <h2 className="rel-secao-titulo">♻️ Embalagens mais recebidas</h2>

                    {embalagens.length === 0 ? (
                        <p className="rel-vazio">Nenhuma embalagem registrada ainda.</p>
                    ) : (
                        <div className="rel-grafico-embalagens">
                            {embalagens.map((emb, index) => (
                                <div key={index} className="rel-emb-item">
                                    <div className="rel-emb-info">
                                        <span className="rel-emb-nome">
                                            {emb.descricaoEmbalagem}
                                        </span>
                                        <span className="rel-emb-material">
                                            {emb.nomeMaterial}
                                        </span>
                                    </div>
                                    <div className="rel-emb-barra-track">
                                        <div
                                            className="rel-emb-barra-fill"
                                            style={{
                                                width: `${(emb.quantidadeRecebida / maiorQuantidade) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="rel-emb-numeros">
                                        <span className="rel-emb-qtd">{emb.quantidadeRecebida} un.</span>
                                        <span className="rel-emb-peso">{emb.pesoTotalGramas}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </>
    );
};

export default Relatorios;
