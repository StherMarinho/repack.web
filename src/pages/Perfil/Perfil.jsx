import { useEffect, useState } from "react";

import Navbar from "../../componentes/Navbar/Navbar";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";

import { getToken } from "../../services/auth";
import { API_URL } from "../../services/api";

import "./Perfil.css";

const Perfil = () => {

    const [usuario, setUsuario] =
        useState(null);

    const [nome, setNome] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [telefone, setTelefone] =
        useState("");

    const [avatar, setAvatar] =
        useState("avatar1");

    const [senhaAtual, setSenhaAtual] =
        useState("");

    const [novaSenha, setNovaSenha] =
        useState("");

    useEffect(() => {

        carregarUsuario();

    }, []);

    const carregarUsuario = async () => {

        try {

            const response = await fetch(
                API_URL+"/usuarios/perfil",
                {
                    headers: {
                        Authorization:
                            `Bearer ${getToken()}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();
            
            console.log("PERFIL:", data);

            setUsuario(data);

            setNome(data.nome);

            setEmail(data.email);

            setTelefone(data.telefone);

            setAvatar(
                data.avatar || "avatar1"
            );

        } catch (error) {
            console.error(error);

            alert(
                "Erro ao carregar perfil"
            );
        }
    };

    const salvarDados = async () => {
        console.log("ENVIANDO:", {
        nome,
        email,
        telefone,
        avatar
    });
        try {

            const response = await fetch(
                API_URL+"/usuarios/perfil",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${getToken()}`
                    },

                    body: JSON.stringify({
                        nome,
                        email,
                        telefone,
                        avatar
                    })
                }
            );

            if (!response.ok) {

                const erro = await response.text();

                console.log("Erro API:", erro);

                throw new Error(erro);
            }

            alert(
                "Dados atualizados com sucesso"
            );

            carregarUsuario();

        } catch {

            alert(
                "Erro ao atualizar perfil"
            );

        }
    };

    const alterarSenha = async () => {

        try {

            const response = await fetch(
                API_URL+"/usuarios/perfil/senha",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${getToken()}`
                    },

                    body: JSON.stringify({
                        senhaAtual,
                        novaSenha
                    })
                }
            );

            if (!response.ok) {

                throw new Error();

            }

            alert(
                "Senha alterada"
            );

            setSenhaAtual("");

            setNovaSenha("");

        } catch {

            alert(
                "Erro ao alterar senha"
            );

        }
    };

    return (
        <>
            <Navbar />

            <div className="perfil-page">

                <div className="perfil-card">

                    <h1 className="perfil-titulo">
                        Meu Perfil
                    </h1>

                    <div className="perfil-foto-area">

                        <img
                            src={`/imagens/${avatar}.png`}
                            alt="Avatar"
                            className="foto-perfil"
                        />

                    </div>
                    
                        <h4>
                            Escolha seu Avatar
                        </h4>

                        <div className="lista-avatares">

                            {[1,2,3,4,5,6].map(numero => (

                                <img
                                    key={numero}
                                    src={`/imagens/avatar${numero}.png`}
                                    alt={`Avatar ${numero}`}
                                    className={
                                        avatar === `avatar${numero}`
                                            ? "avatar-opcao selecionado"
                                            : "avatar-opcao"
                                    }
                                    onClick={() => {
                                        console.log("Avatar selecionado:", `avatar${numero}`);
                                        setAvatar(`avatar${numero}`);
                                    }}
                                />

                            ))}

                        </div>

                    <h2 className="nome-usuario">
                        {usuario?.nome}
                    </h2>

                    {usuario?.pontuacaoTotal > 0 && (
                        <div className="pontuacao-box">
                            ⭐ {usuario.pontuacaoTotal} pontos
                        </div>
                    )}

                    <div className="linha"></div>

                    <div className="secao">

                        <h3>
                            Dados Pessoais
                        </h3>

                        <CampoTexto
                            label="Nome"
                            valor={nome}
                            aoAlterado={setNome}
                        />

                        <CampoTexto
                            label="Email"
                            valor={email}
                            aoAlterado={setEmail}
                        />

                        <CampoTexto
                            label="Telefone"
                            valor={telefone}
                            aoAlterado={setTelefone}
                        />

                        <div className="botao-area">

                            <Botao
                                onClick={salvarDados}
                            >
                                Salvar Alterações
                            </Botao>

                        </div>

                    </div>

                    <div className="linha"></div>

                    <div className="secao">

                        <h3>
                            Alterar Senha
                        </h3>

                        <CampoTexto
                            label="Senha Atual"
                            type="password"
                            valor={senhaAtual}
                            aoAlterado={setSenhaAtual}
                        />

                        <CampoTexto
                            label="Nova Senha"
                            type="password"
                            valor={novaSenha}
                            aoAlterado={setNovaSenha}
                        />

                        <div className="botao-area">

                            <Botao
                                onClick={alterarSenha}
                            >
                                Alterar Senha
                            </Botao>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
};

export default Perfil;