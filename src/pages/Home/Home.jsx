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

            <div className="titulo-home">
                <h1>Recicle embalagens e ganhe pontos!</h1>
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
                            <h2>Painel da Empresa</h2>
                            <p>
                                Utilize o menu superior para registrar novos envios recebidos dos clientes 
                                ou gerenciar as aprovações pendentes.
                            </p>
                            <p>
                                Cada validação ajuda a manter nossa comunidade sustentável e engajada!
                            </p>
                        </>
                    ) : roleUsuario === "Administrador" ? (
                        <>
                            <h2>Painel Administrativo</h2>
                            <p>
                                Visão geral do ecossistema RePack. Acesse os relatórios gerenciais, 
                                gerencie usuários cadastrados e ajuste as regras de pontuação ativa.
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Conteúdo Padrão para "Usuario" comum ou qualquer outro */}
                            <h2>Como funciona?</h2>
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
                <h2 className="painel-home-titulo">
                    Meu Painel
                </h2>

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