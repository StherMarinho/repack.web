import { useEffect, useState } from "react";

import "./EmpresasAdmin.css";
import Navbar from "../../componentes/Navbar/Navbar";

import Formulario from "../../componentes/Formulario/Formulario";
import CampoTexto from "../../componentes/CampoTexto/CampoTexto";
import Botao from "../../componentes/Botao/Botao";

import empresaService from "../../services/empresaService";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// corrige ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// centro padrão (BH)
const CENTRO = [-19.9191, -43.9386];

function EmpresasAdmin() {

    // lista
    const [empresas, setEmpresas] = useState([]);

    // form
    const [mostrarForm, setMostrarForm] = useState(false);
    const [idEdicao, setIdEdicao] = useState(null);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

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

    // clique no mapa para pegar coordenadas
    function SeletorMapa() {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
            }
        });
        return null;
    }

    const novaEmpresa = () => {
        setIdEdicao(null);
        setNome("");
        setEmail("");
        setTelefone("");
        setLatitude(null);
        setLongitude(null);
        setMostrarForm(true);
    };

    const salvar = async (e) => {
        e.preventDefault();

        const dto = {
            nome,
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
        setEmail(empresa.email);
        setTelefone(empresa.telefone);
        setLatitude(empresa.latitude);
        setLongitude(empresa.longitude);
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
                            label="Email"
                            valor={email}
                            aoAlterado={setEmail}
                        />

                        <CampoTexto
                            label="Telefone"
                            valor={telefone}
                            aoAlterado={setTelefone}
                        />

                        <p><strong>Clique no mapa para definir localização:</strong></p>

                        <div className="mapa-mini">
                            <MapContainer
                                center={CENTRO}
                                zoom={13}
                                style={{ height: "250px", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <SeletorMapa />

                                {latitude && longitude && (
                                    <Marker position={[latitude, longitude]}>
                                        <Popup>
                                            Local selecionado
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>

                        <div className="botoes">
                            <Botao>
                                Salvar
                            </Botao>

                            <Botao onClick={() => setMostrarForm(false)}>
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