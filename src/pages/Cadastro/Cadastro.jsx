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
    const [toast, setToast] = useState(null);

    const mostrarToast = (tipo, texto) => {
    setToast({ tipo, texto });

    setTimeout(() => {
        setToast(null);
    }, 3000);
};

    const aoCadastrar = async (e) => {
        e.preventDefault();

        if (!nome || !email || !senha) {
            mostrarToast("erro", "Preencha os campos obrigatórios");
            return;
        }

        if (senha !== confirmarSenha) {
            mostrarToast("erro", "As senhas não coincidem");
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

            mostrarToast("sucesso", "Cadastro realizado com sucesso");

            setTimeout(() => {
                navigate("/");
            }, 1200);

        } catch {
            mostrarToast("erro", "Erro no cadastro");
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
            {toast && (
                <div className={`toast toast--${toast.tipo}`}>
                    {toast.tipo === "sucesso" ? "✓" : "✕"} {toast.texto}
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