import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../../componentes/Navbar/Navbar";
import empresaService from "../../services/empresaService";
import { getRole } from "../../services/auth";
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const CENTRO_INICIAL = [-19.9191, -43.9386];
const ZOOM_INICIAL = 13;

const Mapa = () => {
    const [empresas, setEmpresas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [mensagem, setMensagem] = useState(null);
    const [mostrarForm, setMostrarForm] = useState(false);

    // Formulário de nova empresa
    const [novaEmpresa, setNovaEmpresa] = useState({
        nome: "", cnpj: "", telefone: "", email: "",
        cep: "", logradouro: "", numero: "", bairro: "",
        cidade: "", estado: "", latitude: "", longitude: ""
    });

    const isAdmin = getRole() === "Administrador";

    useEffect(() => {
        const carregarEmpresas = async () => {
            try {
                const data = await empresaService.listarEmpresas();
                const ativas = data.filter(
                    (e) => e.ativo && e.longitude !== null && e.latitude !== null
                );
                setEmpresas(ativas);
            } catch (err) {
                setErro("Erro ao carregar a página");
            } finally {
                setCarregando(false);
            }
        };

        carregarEmpresas();
    }, []);

    const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado.");
            return;
        }

        setNovaEmpresa((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
        }));
    } catch (err) {
        alert("Erro ao buscar CEP.");
    }
};

    const handleExcluir = async (id) => {
        const confirmar = window.confirm("Deseja remover esta empresa do mapa?");
        if (!confirmar) return;

        try {
            await empresaService.deletarEmpresa(id);
            setEmpresas((prev) => prev.filter((e) => e.id !== id));
            setMensagem({ tipo: "sucesso", texto: "Empresa removida com sucesso!" });
        } catch (err) {
            setMensagem({ tipo: "erro", texto: "Erro ao remover empresa." });
        }
    };

    const handleIncluir = async (e) => {
        e.preventDefault();
        try {
            const dto = {
                ...novaEmpresa,
                latitude: parseFloat(novaEmpresa.latitude),
                longitude: parseFloat(novaEmpresa.longitude),
                ativo: true
            };
            await empresaService.criarEmpresa(dto);
            const data = await empresaService.listarEmpresas();
            setEmpresas(data.filter((e) => e.ativo && e.latitude && e.longitude));
            setMensagem({ tipo: "sucesso", texto: "Empresa adicionada com sucesso!" });
            setMostrarForm(false);
            setNovaEmpresa({
                nome: "", cnpj: "", telefone: "", email: "",
                cep: "", logradouro: "", numero: "", bairro: "",
                cidade: "", estado: "", latitude: "", longitude: ""
            });
        } catch (err) {
            setMensagem({ tipo: "erro", texto: "Erro ao adicionar empresa." });
        }
    };

    if (carregando) return <p className="mapa_mensagem">Carregando página...</p>;
    if (erro) return <p className="mapa_mensagem_erro">{erro}</p>;

    return (
        <>
            <Navbar />
                <div className="mapa">
                    <div className="mapa_titulo">
                        Pontos de Coleta
                    </div>

                    <p className="mapa_subtitulo">
                        Encontre o ponto de coleta mais próximo de você!
                    </p>
                {mensagem && (
                    <p className={`mapa_feedback mapa_feedback--${mensagem.tipo}`}>
                        {mensagem.texto}
                    </p>
                )}

                <div className="mapa_layout">
                    <MapContainer
                        center={CENTRO_INICIAL}
                        zoom={ZOOM_INICIAL}
                        scrollWheelZoom={true}
                        className="mapa_container"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {empresas.map((empresa) => (
                            <Marker
                                key={empresa.id}
                                position={[empresa.latitude, empresa.longitude]}
                            >
                                <Popup>
                                    <div className="mapa_popup">
                                        <strong>{empresa.nome}</strong>
                                        <p>{empresa.logradouro}, {empresa.numero}</p>
                                        <p>{empresa.bairro} - {empresa.cidade}/{empresa.estado}</p>
                                        <p>CEP: {empresa.cep}</p>
                                        {empresa.telefone && <p>{empresa.telefone}</p>}
                                        {empresa.email && <p>{empresa.email}</p>}
                                        {isAdmin && (
                                            <button
                                                className="mapa_btn mapa_btn--excluir"
                                                onClick={() => handleExcluir(empresa.id)}
                                            >
                                                Remover do mapa
                                            </button>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Painel lateral para admin */}
                    {isAdmin && (
                        <div className="mapa_painel">
                            <h3 className="mapa_painel__titulo">Gerenciar empresas</h3>
                            <button
                                className="mapa_btn mapa_btn--incluir"
                                onClick={() => setMostrarForm(!mostrarForm)}
                            >
                                {mostrarForm ? "Cancelar" : "+ Incluir empresa"}
                            </button>

                            {mostrarForm && (
                                    <form onSubmit={handleIncluir} className="mapa_form">

                                        {/* CEP com busca automática */}
                                        <div className="mapa_form__campo">
                                            <label>CEP</label>
                                            <input
                                                type="text"
                                                value={novaEmpresa.cep}
                                                onChange={(e) =>
                                                    setNovaEmpresa((prev) => ({ ...prev, cep: e.target.value }))
                                                }
                                                onBlur={(e) => buscarCep(e.target.value)}
                                                placeholder="00000-000"
                                                maxLength={9}
                                            />
                                        </div>

                                        {/* Preenchidos automaticamente pelo ViaCEP */}
                                        {[
                                            { label: "Logradouro", campo: "logradouro" },
                                            { label: "Bairro", campo: "bairro" },
                                            { label: "Cidade", campo: "cidade" },
                                            { label: "Estado", campo: "estado" },
                                        ].map(({ label, campo }) => (
                                            <div key={campo} className="mapa_form__campo">
                                                <label>{label}</label>
                                                <input
                                                    type="text"
                                                    value={novaEmpresa[campo]}
                                                    onChange={(e) =>
                                                        setNovaEmpresa((prev) => ({ ...prev, [campo]: e.target.value }))
                                                    }
                                                />
                                            </div>
                                        ))}

                                        {/* Preenchidos manualmente */}
                                        {[
                                            { label: "Nome", campo: "nome" },
                                            { label: "CNPJ", campo: "cnpj" },
                                            { label: "Telefone", campo: "telefone" },
                                            { label: "Email", campo: "email" },
                                            { label: "Número", campo: "numero" },
                                            { label: "Latitude", campo: "latitude" },
                                            { label: "Longitude", campo: "longitude" },
                                        ].map(({ label, campo }) => (
                                            <div key={campo} className="mapa_form__campo">
                                                <label>{label}</label>
                                                <input
                                                    type="text"
                                                    value={novaEmpresa[campo]}
                                                    onChange={(e) =>
                                                        setNovaEmpresa((prev) => ({ ...prev, [campo]: e.target.value }))
                                                    }
                                                    required={["nome", "cnpj", "latitude", "longitude"].includes(campo)}
                                                />
                                            </div>
                                        ))}

                                        <button type="submit" className="mapa_btn mapa_btn--incluir">
                                            Salvar
                                        </button>
                                    </form>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Mapa;