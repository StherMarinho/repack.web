import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";
import Formulario from "../../componentes/Formulario/Formulario";
import Banner from "../../componentes/Banner/Banner";

import { login } from "../../services/authService";
import { salvarLogin, getUsuario } from "../../services/auth";
import "./Login.css"

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function aoLogar(e) {
        e.preventDefault();
        setCarregando(true);

        try {
            const res = await login({ email, senha });

            salvarLogin(res);

            alert("Login realizado!");

            const role = getUsuario()?.role;

            if (role === "Administrador") {
                navigate("/home");
            } else if (role === "Funcionario") {
                navigate("/home");
            } else {
                navigate("/home");
            }

        } catch (e){
            alert(e);
        } finally {
            setCarregando(false);
        }
    };
    

    return (
        <>
            <Banner />

            <Formulario titulo="Login" onSubmit={aoLogar}>
                <CampoTexto
                    obrigatorio
                    label="Email"
                    valor={email}
                    aoAlterado={setEmail}
                />

                <CampoTexto
                    obrigatorio
                    label="Senha"
                    type="password"
                    valor={senha}
                    aoAlterado={setSenha}
                />

                <Botao disabled={carregando}>Entrar</Botao>
                <p onClick={() => navigate("/cadastro")} className="link mt-4">
                    Não tem conta? Cadastre-se
                </p>

                {carregando && <p className="mt-2">Carregando...</p>}
            </Formulario>
        </>
    );
};

export default Login;