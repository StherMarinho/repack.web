import { useEffect, useState } from "react";

import "./EmbalagensAdmin.css";
import Navbar from "../../componentes/Navbar/Navbar";

import Formulario from "../../componentes/Formulario/Formulario";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import CampoSelect from "../../componentes/CampoSelect/CampoSelect";
import Botao from "../../componentes/Botao/Botao";

import embalagemService from "../../services/embalagemService";
import materialService from "../../services/materialService";

function EmbalagensAdmin() {
    // lista
    const [embalagens, setEmbalagens] = useState([]);

    // materiais
    const [materiais, setMateriais] = useState([]);

    // form
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [idEdicao, setIdEdicao] = useState(null);

    const [descricao, setDescricao] = useState("");
    const [materialId, setMaterialId] = useState("");

    useEffect(() => {
        carregarEmbalagens();
        carregarMateriais();
    }, []);

    const carregarEmbalagens = async () => {
        try {
            const dados = await embalagemService.listarEmbalagens();
            setEmbalagens(dados);
        } catch (err) {
            alert(err.message);
        }
    };

    const carregarMateriais = async () => {
        try {
            const dados = await materialService.listarMateriais();
            setMateriais(dados);
        } catch (err) {
            console.log("Erro ao carregar materiais", err.message);
        }
    };

    const novaEmbalagem = () => {
        setIdEdicao(null);
        setDescricao("");
        setMaterialId("");
        setMostrarFormulario(true);
    };

    const salvar = async (e) => {
        e.preventDefault();

        const dto = {
            descricao,
            materialId: Number(materialId)
        };

        try {
            if (idEdicao) {
                await embalagemService.atualizarEmbalagem(idEdicao, dto);
            } else {
                await embalagemService.criarEmbalagem(dto);
            }

            setMostrarFormulario(false);
            carregarEmbalagens();
        } catch (err) {
            alert(err.message);
        }
    };

    const editar = (embalagem) => {
        setIdEdicao(embalagem.id);
        setDescricao(embalagem.descricao);
        setMaterialId(embalagem.materialId);
        setMostrarFormulario(true);
    };

    const deletar = async (id) => {
        if (!window.confirm("Deseja realmente excluir?")) return;

        try {
            await embalagemService.deletarEmbalagem(id);
            carregarEmbalagens();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="embalagens-page">
            <Navbar />

            <div className="container">
                <h1>Embalagens</h1>

                {!mostrarFormulario && (
                    <Botao onClick={novaEmbalagem}>
                        Nova Embalagem
                    </Botao>
                )}

                {/* LISTA */}
                {!mostrarFormulario && (
                    <div className="lista">
                        {embalagens.map((e) => (
                            <div key={e.id} className="card">
                                <div>
                                    <strong>{e.descricao}</strong>
                                    <p>Material: {e.materialDescricao}</p>
                                </div>

                                <div className="acoes">
                                    <Botao onClick={() => editar(e)}>
                                        Editar
                                    </Botao>

                                    <Botao onClick={() => deletar(e.id)}>
                                        Excluir
                                    </Botao>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FORMULÁRIO */}
                {mostrarFormulario && (
                    <Formulario
                        titulo={idEdicao ? "Editar Embalagem" : "Nova Embalagem"}
                        onSubmit={salvar}
                    >
                        <CampoTexto
                            label="Descrição"
                            valor={descricao}
                            aoAlterado={setDescricao}
                            obrigatorio
                        />

                        <CampoSelect
                            label="Material"
                            value={materialId}
                            aoAlterado={setMaterialId}
                            options={materiais}
                        />

                        <div className="botoes">
                            <Botao type="submit">
                                Salvar
                            </Botao>

                            <Botao
                                type="button"
                                onClick={() => setMostrarFormulario(false)}
                            >
                                Cancelar
                            </Botao>
                        </div>
                    </Formulario>
                )}
            </div>
        </div>
    );
}

export default EmbalagensAdmin;