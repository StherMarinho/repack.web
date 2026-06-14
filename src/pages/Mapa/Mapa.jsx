import {useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Navbar from "../../componentes/Navbar/Navbar";
import empresaService from "../../services/empresaService";
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

    useEffect (() => {
        const carregarEmpresas = async () => {
            try{
                const data = await empresaService.listarEmpresas();
                const ativas = data.filter(
                    (e) => e.ativo && e.longitude !== null && e.latitude !== null
                );
                setEmpresas(ativas);
            }catch (err)
            {
                setErro ("Erro ao carregar a página");
            } finally{
                setCarregando(false)
            }
        };

        carregarEmpresas();

    }, []);

    if(carregando) return <p className="mapa_mensagem">Caregando página...</p>
    if(erro) return <p className="mapa_mensagem_erro">{erro}</p>

    return (
        <>
        <Navbar />
        <div className="mapa">
            <h2 className="mapa_titulo">Pontos de Coleta</h2>
            <p className="mapa_subtitulo">Encontre o ponto de coleta mais próximo de você!</p>

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
                        <div className="mapa_popop">
                        <strong>{empresa.nome}</strong>
                        <p>{empresa.logradouro}, {empresa.numero}</p>
                        <p>{empresa.bairro} - {empresa.cidade}/{empresa.estado}</p>
                        <p>CEP: {empresa.cep}</p>
                        {empresa.telefone && <p>{empresa.email}</p>}
                        </div>
                    </Popup>
                    </Marker>
                ))}

            </MapContainer>

        </div>

        </>    
    );
};

export default Mapa;


