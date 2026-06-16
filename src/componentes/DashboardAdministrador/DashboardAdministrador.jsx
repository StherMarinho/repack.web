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
            relatorioService
                .getEstatisticasUsuarios(),

            relatorioService
                .getEstatisticasEnvios()
        ]);

        setUsuarios(dadosUsuarios);

        setEnvios(dadosEnvios);
    };

    return (
        <div className="dashboard-grid">

            <div className="dashboard-card">
                <h3>👥 Usuários Ativos</h3>

                <span className="dashboard-numero">
                    {usuarios?.totalUsuariosAtivos ?? 0}
                </span>
            </div>

            <div className="dashboard-card">
                <h3>📦 Total Envios</h3>

                <span className="dashboard-numero">
                    {envios?.totalEnvios ?? 0}
                </span>
            </div>

            <div className="dashboard-card">
                <button
                    className="btn-relatorio"
                    onClick={() =>
                        navigate(
                            "/relatorios"
                        )
                    }
                >
                    Ver Relatórios
                </button>
            </div>

        </div>
    );
};

export default DashboardAdministrador;