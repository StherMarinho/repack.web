import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";
import Formulario from "../../componentes/Formulario/Formulario";
import Banner from "../../componentes/Banner/Banner";

import { login } from "../../services/authService";
import { salvarLogin } from "../../services/auth";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    async function aoLogar(e) {
        e.preventDefault();

        setCarregando(true);

        try {
            const res = await login({ email, senha });

            salvarLogin(res);

            setSucesso(true);

            setTimeout(() => {
                navigate("/home");
            }, 1200);

        } catch {
            alert("Erro ao realizar login");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <Banner />

            {carregando && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p>Entrando no sistema...</p>
                </div>
            )}

            {sucesso && (
                <div className="success-toast">
                    ✓ Login realizado com sucesso
                </div>
            )}

            <div className="login">
                <div className="login-card">
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

                        <div className="login-botao-area">
                            <Botao disabled={carregando}>
                                Entrar
                            </Botao>
                        </div>

                        <p
                            onClick={() => navigate("/cadastro")}
                            className="link"
                        >
                            Não tem conta? Cadastre-se
                        </p>

                    </Formulario>
                </div>
            </div>
        </>
    );
};

export default Login;