import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import relatorioService from "../../services/relatorioService";
import "./DashboardAdministrador.css";

const DashboardAdministrador = () => {

    const navigate = useNavigate();

    const [usuarios, setUsuarios] =
        useState(null);

    const [envios, setEnvios] =
        useState(null);

    useEffect(() => {
        carregar();
    }, []);

    const carregar = async () => {

        const [
            dadosUsuarios,
            dadosEnvios
        ] = await Promise.all([
            relatorioService.getEstatisticasUsuarios(),
            relatorioService.getEstatisticasEnvios()
        ]);

        setUsuarios(dadosUsuarios);
        setEnvios(dadosEnvios);
    };

    return (
        <div className="admin-dashboard">

            <div className="admin-cards">

                <div className="admin-card">
                    <h3>👥 Usuários Ativos</h3>

                    <span className="admin-numero">
                        {usuarios?.totalUsuariosAtivos ?? 0}
                    </span>
                </div>

                <div className="admin-card">
                    <h3>📦 Total Envios</h3>

                    <span className="admin-numero">
                        {envios?.totalEnvios ?? 0}
                    </span>
                </div>

            </div>

            <div className="admin-botao-area">

                <button
                    className="admin-btn-relatorio"
                    onClick={() => navigate("/relatorios")}
                >
                    Ver Relatórios Completos
                </button>

            </div>

        </div>
    );
};

export default DashboardAdministrador;