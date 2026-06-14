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

        try {
            await register({
                nome,
                email,
                senha,
                telefone,
                idTipoUsuario: 1
            });

            alert("Cadastro realizado!");
            navigate("/");
        } catch {
            alert("Erro no cadastro");
        }
    };

    return (
        <>
            <Banner />

            <Formulario 
                titulo="Cadastro" 
                onSubmit={aoCadastrar}
            >
                <CampoTexto label="Nome" valor={nome} aoAlterado={setNome} obrigatorio />
                <CampoTexto label="Email" valor={email} aoAlterado={setEmail} obrigatorio />
                <CampoTexto label="Senha" type="password" valor={senha} aoAlterado={setSenha} obrigatorio />
                <CampoTexto label="Confirmar Senha" type="password" valor={confirmarSenha} aoAlterado={setConfirmarSenha} obrigatorio />
                <CampoTexto label="Telefone" valor={telefone} aoAlterado={setTelefone} />

                <Botao>Cadastrar</Botao>

                <p 
                    onClick={() => navigate("/")} className="link mt-4"
                >
                    Já tem conta? Faça login
                </p>
            </Formulario>
        </>
    );
};

export default Cadastro;