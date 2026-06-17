import { useEffect, useState } from "react";

import "./EmpresasAdmin.css";
import Navbar from "../../componentes/Navbar/Navbar";

import Formulario from "../../componentes/Formulario/Formulario";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";

import empresaService from "../../services/empresaService";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const CENTRO = [-19.9191, -43.9386];

function EmpresasAdmin() {

    const [empresas, setEmpresas] = useState([]);

    const [mostrarForm, setMostrarForm] = useState(false);
    const [idEdicao, setIdEdicao] = useState(null);

    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const [endereco, setEndereco] = useState("");

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    useEffect(() => {
        carregarEmpresas();
    }, []);

    const carregarEmpresas = async () => {
        try {
            const data = await empresaService.listarEmpresas();
            setEmpresas(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // 🌍 Geocoding
    const buscarCoordenadas = async () => {
        if (!endereco) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
            );

            const data = await response.json();

            if (data.length > 0) {
                setLatitude(parseFloat(data[0].lat));
                setLongitude(parseFloat(data[0].lon));
            } else {
                alert("Endereço não encontrado");
            }
        } catch (err) {
            alert("Erro ao buscar localização");
        }
    };

    const novaEmpresa = () => {
        setIdEdicao(null);
        setNome("");
        setCnpj("");
        setEmail("");
        setTelefone("");
        setEndereco("");
        setLatitude(null);
        setLongitude(null);
        setMostrarForm(true);
    };

    const salvar = async (e) => {
        e.preventDefault();

        const dto = {
            nome,
            cnpj,
            email,
            telefone,
            latitude,
            longitude,
            ativo: true
        };

        try {
            if (idEdicao) {
                await empresaService.atualizarEmpresa(idEdicao, dto);
            } else {
                await empresaService.criarEmpresa(dto);
            }

            setMostrarForm(false);
            carregarEmpresas();

        } catch (err) {
            alert(err.message);
        }
    };

    const editar = (empresa) => {
        setIdEdicao(empresa.id);
        setNome(empresa.nome);
        setCnpj(empresa.cnpj);
        setEmail(empresa.email);
        setTelefone(empresa.telefone);
        setLatitude(empresa.latitude);
        setLongitude(empresa.longitude);
        setEndereco("");
        setMostrarForm(true);
    };

    const deletar = async (id) => {
        if (!window.confirm("Deseja excluir essa empresa?")) return;

        try {
            await empresaService.deletarEmpresa(id);
            carregarEmpresas();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="empresas-page">
            <Navbar />

            <div className="container">
                <h1>Empresas</h1>

                {!mostrarForm && (
                    <Botao onClick={novaEmpresa}>
                        Nova Empresa
                    </Botao>
                )}

                {/* LISTA */}
                {!mostrarForm && (
                    <div className="lista">
                        {empresas.map((e) => (
                            <div key={e.id} className="card">
                                <div>
                                    <strong>{e.nome}</strong>
                                    <p>{e.cnpj}</p>
                                    <p>{e.email}</p>
                                    <p>{e.telefone}</p>
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
                {mostrarForm && (
                    <Formulario
                        titulo={idEdicao ? "Editar Empresa" : "Nova Empresa"}
                        onSubmit={salvar}
                    >

                        <CampoTexto
                            label="Nome"
                            valor={nome}
                            aoAlterado={setNome}
                            obrigatorio
                        />

                        <CampoTexto
                            label="CNPJ"
                            valor={cnpj}
                            aoAlterado={setCnpj}
                            obrigatorio
                            placeholder="00.000.000/0000-00"
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

                        <CampoTexto
                            label="Endereço"
                            valor={endereco}
                            aoAlterado={setEndereco}
                            placeholder="Ex: Av. Afonso Pena, BH"
                        />

                        <Botao type="button" onClick={buscarCoordenadas}>
                            Buscar localização
                        </Botao>

                        <p><strong>Pré-visualização no mapa:</strong></p>

                        <div className="mapa-mini">
                            <MapContainer
                                center={
                                    latitude && longitude
                                        ? [latitude, longitude]
                                        : CENTRO
                                }
                                zoom={13}
                                style={{ height: "250px", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {latitude && longitude && (
                                    <Marker position={[latitude, longitude]}>
                                        <Popup>
                                            Local da empresa
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>

                        <div className="botoes">
                            <Botao>Salvar</Botao>

                            <Botao
                                type="button"
                                onClick={() => setMostrarForm(false)}
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

export default EmpresasAdmin;