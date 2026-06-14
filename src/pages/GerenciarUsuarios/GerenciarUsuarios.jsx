import { useEffect, useState } from "react";

import Navbar from "../../componentes/Navbar/Navbar";

import {
    listarUsuarios,
    desativarUsuario
}
from "../../services/usuarioService";

import "./GerenciarUsuarios.css";

const GerenciarUsuarios = () => {

    const [usuarios, setUsuarios] =
        useState([]);

    useEffect(() => {

        carregarUsuarios();

    }, []);

    const carregarUsuarios = async () => {

        try {

            const data =
                await listarUsuarios();

            console.log(data);

            setUsuarios(data);

        } catch {

            alert(
                "Erro ao carregar usuários"
            );
        }
    };

    const obterTipo = (id) => {

        switch (id) {

            case 1:
                return "Comum";

            case 2:
                return "Funcionário";

            case 3:
                return "Administrador";

            default:
                return "-";
        }
    };

    const desativar = async (id) => {

        const confirmar =
            window.confirm(
                "Deseja realmente desativar este usuário?"
            );

        if (!confirmar)
            return;

        try {

            await desativarUsuario(id);

            alert(
                "Usuário desativado!"
            );

            carregarUsuarios();

        } catch {

            alert(
                "Erro ao desativar usuário"
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="usuarios-container">

                <h1>
                    Gerenciar Usuários
                </h1>

                <div className="tabela-wrapper">

                    <table className="usuarios-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Tipo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>

                        </thead>

                        <tbody>

                            {usuarios.map(usuario => (

                                <tr key={usuario.id}>

                                    <td>
                                        {usuario.id}
                                    </td>

                                    <td>
                                        {usuario.nome}
                                    </td>

                                    <td>
                                        {usuario.email}
                                    </td>

                                    <td>
                                        {
                                            obterTipo(
                                                usuario.idTipoUsuario
                                            )
                                        }
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                usuario.ativo
                                                    ? "status-ativo"
                                                    : "status-inativo"
                                            }
                                        >
                                            {
                                                usuario.ativo
                                                    ? "Ativo"
                                                    : "Inativo"
                                            }
                                        </span>

                                    </td>

                                    <td>

                                        {usuario.ativo ? (

                                            <button
                                                className="btn-desativar"
                                                onClick={() =>
                                                    desativar(
                                                        usuario.id
                                                    )
                                                }
                                            >
                                                Desativar
                                            </button>

                                        ) : (

                                            <span className="texto-inativo">
                                                Usuário desativado
                                            </span>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
};

export default GerenciarUsuarios;