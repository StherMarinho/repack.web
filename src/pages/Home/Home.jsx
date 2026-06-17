import { useEffect, useState } from "react";

import Navbar from "../../componentes/Navbar/Navbar";

import { getRole, getToken } from "../../services/auth";
import { API_URL } from "../../services/api";

import DashboardUsuario from "../../componentes/DashboardUsuario/DashboardUsuario";
import DashboardFuncionario from "../../componentes/DashboardFuncionario/DashboardFuncionario";
import DashboardAdministrador from "../../componentes/DashboardAdministrador/DashboardAdministrador";

import "./Home.css";

const Home = () => {
    const roleUsuario = getRole();

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        carregarUsuario();
    }, []);

    const carregarUsuario = async () => {
        try {
            const response = await fetch(
                API_URL + "/usuarios/perfil",
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();

            setUsuario(data);
        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
        }
    };

    return (
        <>
            <Navbar />

            <img
                src="../imagens/bannerHome2.jpg"
                alt="Banner"
                className="banner-home"
            />

            <div className="cabecalho-home">
                <div className="titulo-home">
                    Olá{usuario?.nome ? `, ${usuario.nome}` : ""}! Bem-vindo(a) ao RePack
                </div>

                <div className="subtitulo-home">
                    Recicle embalagens, ganhe pontos, gere impacto!
                </div>

                {roleUsuario === "Usuario" && (
                    <div className="painel-home-titulo painel-home-titulo-home">
                        Meu Painel
                    </div>
                )}
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
                    {roleUsuario === "Funcionario" ? (
                        <>
                            <div className="secao-titulo">
                                Recebimentos da Empresa
                            </div>

                            <p>
                                Gerencie as embalagens entregues pelos usuários,
                                acompanhe os recebimentos e realize as avaliações
                                pendentes.
                            </p>

                            <p>
                                Cada recebimento validado contribui para a
                                reciclagem adequada e para a distribuição de
                                pontos aos participantes.
                            </p>
                        </>
                    ) : roleUsuario === "Administrador" ? (
                        <>
                            <div className="secao-titulo">
                                Gestão da Plataforma
                            </div>

                            <p>
                                Visão geral do ecossistema RePack. Acesse os
                                relatórios gerenciais, gerencie usuários
                                cadastrados e ajuste as regras de pontuação
                                ativa.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="secao-titulo">
                                Como funciona?
                            </div>

                            <p>
                                Entregue suas embalagens em pontos de coleta
                                para promover a reciclagem e acumule pontos de
                                recompensa.
                            </p>

                            <p>
                                Acompanhe seus envios e suba no ranking dos
                                usuários que mais reciclam.
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="painel-home">
                {roleUsuario !== "Usuario" && (
                    <div className="painel-home-titulo">
                        Meu Painel
                    </div>
                )}

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