import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";
import Formulario from "../../componentes/Formulario/Formulario";
import Banner from "../../componentes/Banner/Banner";

import { register } from "../../services/authService";

import "./Cadastro.css";

const Cadastro = () => {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erroCadastro, setErroCadastro] = useState(false);

    const aoCadastrar = async (e) => {
        e.preventDefault();

        if (!nome || !email || !senha) {
            alert("Preencha os campos obrigatórios");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem");
            return;
        }

        setCarregando(true);

        try {
            await register({
                nome,
                email,
                senha,
                telefone,
                idTipoUsuario: 1
            });

            setSucesso(true);

            setTimeout(() => {
                navigate("/");
            }, 1200);

        } catch {
            setErroCadastro(true);

            setTimeout(() => {
                setErroCadastro(false);
            }, 3000);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
            <Banner />

            {/* LOADING OVERLAY */}
            {carregando && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Criando sua conta...</p>
                </div>
            )}

            {/* TOAST SUCESSO */}
            {sucesso && (
                <div className="success-toast">
                    ✓ Cadastro realizado com sucesso
                </div>
            )}

            {/* TOAST ERRO */}
            {erroCadastro && (
                <div className="error-toast">
                    ✕ Erro ao realizar cadastro
                </div>
            )}

            <div className="cadastro-page">
                <Formulario titulo="Cadastro" onSubmit={aoCadastrar}>

                    <CampoTexto label="Nome" valor={nome} aoAlterado={setNome} obrigatorio />
                    <CampoTexto label="Email" valor={email} aoAlterado={setEmail} obrigatorio />
                    <CampoTexto label="Senha" type="password" valor={senha} aoAlterado={setSenha} obrigatorio />
                    <CampoTexto label="Confirmar Senha" type="password" valor={confirmarSenha} aoAlterado={setConfirmarSenha} obrigatorio />
                    <CampoTexto label="Telefone" valor={telefone} aoAlterado={setTelefone} />

                    <Botao disabled={carregando}>
                        Cadastrar
                    </Botao>

                    <p
                        onClick={() => navigate("/")}
                        className="link"
                    >
                        Já tem conta? Faça login
                    </p>

                </Formulario>
            </div>
        </>
    );
};

export default Cadastro;