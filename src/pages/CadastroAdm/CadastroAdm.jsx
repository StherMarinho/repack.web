import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import CampoSelect from "../../componentes/CampoSelect/CampoSelect";
import Botao from "../../componentes/Botao/Botao";
import Formulario from "../../componentes/Formulario/Formulario";
import Navbar from "../../componentes/Navbar/Navbar";

import { register } from "../../services/authService";

import "./CadastroAdm.css";

const CadastroAdm = () => {

    const navigate = useNavigate();

    const optionsTipoUsuario = [
        {
            id: 1,
            descricao: "Comum"
        },
        {
            id: 2,
            descricao: "Funcionário"
        },
        {
            id: 3,
            descricao: "Administrador"
        }
    ];

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState(1);

    const aoCadastrar = async (e) => {

        e.preventDefault();

        if (
            !nome ||
            !email ||
            !senha
        ) {
            alert(
                "Preencha os campos obrigatórios"
            );
            return;
        }

        if (
            senha !== confirmarSenha
        ) {
            alert(
                "As senhas não coincidem"
            );
            return;
        }

        try {

            await register({
                nome,
                email,
                senha,
                telefone,
                idTipoUsuario:
                    Number(tipoUsuario)
            });

            alert(
                "Usuário cadastrado com sucesso!"
            );

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");
            setTelefone("");
            setTipoUsuario(1);

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao cadastrar usuário"
            );
        }
    };

    return (
    <>
        <Navbar />

        <div className="cadastro-adm-page">

            <div className="cadastro-adm-container">

                <h1 className="cadastro-adm-titulo">
                    Cadastro de Usuários
                </h1>

                <p className="cadastro-adm-subtitulo">
                    Crie usuários comuns, funcionários ou administradores.
                </p>

                <Formulario
                    onSubmit={aoCadastrar}
                >

                    <CampoTexto
                        label="Nome"
                        valor={nome}
                        aoAlterado={setNome}
                        obrigatorio
                    />

                    <CampoTexto
                        label="Email"
                        valor={email}
                        aoAlterado={setEmail}
                        obrigatorio
                    />

                    <CampoTexto
                        label="Senha"
                        type="password"
                        valor={senha}
                        aoAlterado={setSenha}
                        obrigatorio
                    />

                    <CampoTexto
                        label="Confirmar Senha"
                        type="password"
                        valor={confirmarSenha}
                        aoAlterado={setConfirmarSenha}
                        obrigatorio
                    />

                    <CampoTexto
                        label="Telefone"
                        valor={telefone}
                        aoAlterado={setTelefone}
                    />

                    <CampoSelect
                        label="Tipo de Usuário"
                        options={optionsTipoUsuario}
                        value={tipoUsuario}
                        aoAlterado={setTipoUsuario}
                    />

                    <div className="cadastro-adm-botoes">

                        <Botao>
                            Cadastrar Usuário
                        </Botao>

                        <button
                            type="button"
                            className="botao-secundario"
                            onClick={() =>
                                navigate("/usuarios")
                            }
                        >
                            Gerenciar Usuários
                        </button>

                    </div>

                </Formulario>

            </div>

        </div>
    </>
);
};

export default CadastroAdm;