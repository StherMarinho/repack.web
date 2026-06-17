import Navbar from "../../componentes/Navbar/Navbar";
import { getRole } from "../../services/auth";

import DashboardUsuario from "../../componentes/DashboardUsuario/DashboardUsuario";
import DashboardFuncionario from "../../componentes/DashboardFuncionario/DashboardFuncionario";
import DashboardAdministrador from "../../componentes/DashboardAdministrador/DashboardAdministrador";

import "./Home.css";

const Home = () => {
    // Descobre automaticamente quem está logado: "Usuario", "Funcionario" ou "Administrador"
    const roleUsuario = getRole(); 

    return (
        <>
            {/* A Navbar se adapta sozinha lá dentro */}
            <Navbar />

            <img 
                src="../imagens/bannerHome2.jpg"
                alt="Banner"
                className="banner-home"
            />

            <div className="cabecalho-home">
                <div className="titulo-home">
                    Sistema de Logística Reversa
                </div>

                <div className="subtitulo-home">
                    Conectando usuários e empresas para o descarte correto de embalagens e geração de recompensas sustentáveis.
                </div>
            </div>

            <div className="conteudo-home">
                <div className="imagem-home">
                    <img
                        src="../imagens/imagemHome.png"
                        alt="Ilustração de reciclagem"
                        className="imagem-home__img"
                    />
                </div>

                <div className="texto-home">
                    {/* ====== CONTEÚDO DINÂMICO BASEADO NA ROLE ====== */}
                    {roleUsuario === "Funcionario" ? (
                        <>
                            <div className="secao-titulo">
                                Recebimentos da Empresa
                            </div>
                            <p>
                                Gerencie as embalagens entregues pelos usuários, acompanhe os recebimentos e realize as avaliações pendentes.
                            </p>

                            <p>
                                Cada recebimento validado contribui para a reciclagem adequada e para a distribuição de pontos aos participantes.
                            </p>
                        </>
                    ) : roleUsuario === "Administrador" ? (
                        <>
                            <div className="secao-titulo">
                                Gestão da Plataforma
                            </div>
                            <p>
                                Visão geral do ecossistema RePack. Acesse os relatórios gerenciais, 
                                gerencie usuários cadastrados e ajuste as regras de pontuação ativa.
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Conteúdo Padrão para "Usuario" comum ou qualquer outro */}
                            <div className="secao-titulo">
                                Como funciona?
                            </div>
                            <p>
                                Entregue suas embalagens em pontos de coleta para promover a reciclagem
                                e acumule pontos de recompensa.
                            </p>
                            <p>
                                Acompanhe seus envios e suba no ranking dos usuários
                                que mais reciclam!
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="painel-home">
                <div className="painel-home-titulo">
                    Meu Painel
                </div>

                {roleUsuario === "Usuario" && (
                    <DashboardUsuario />
                )}

                {roleUsuario === "Funcionario" && (
                    <DashboardFuncionario />
                )}

                {roleUsuario === "Administrador" && (
                    <DashboardAdministrador />
                )}
            </div>
        </>
    );
};

export default Home;