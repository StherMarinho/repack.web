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
            const res = await login({
                email,
                senha
            });

            salvarLogin(res);

            setSucesso(true);

            setTimeout(() => {
                navigate("/home");
            }, 1000);

        } catch (e) {
            alert("Erro ao realizar login");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <Banner />

            {/* OVERLAY DE LOADING */}
            {carregando && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Entrando no sistema...</p>
                </div>
            )}

            {/* TOAST DE SUCESSO */}
            {sucesso && (
                <div className="success-toast">
                    ✓ Login realizado com sucesso
                </div>
            )}

            <div className="login">
                <Formulario
                    titulo="Login"
                    onSubmit={aoLogar}
                >
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

                    <Botao disabled={carregando}>
                        Entrar
                    </Botao>

                    <p
                        onClick={() => navigate("/cadastro")}
                        className="link mt-4"
                    >
                        Não tem conta? Cadastre-se
                    </p>
                </Formulario>
            </div>
        </>
    );
};

export default Login;