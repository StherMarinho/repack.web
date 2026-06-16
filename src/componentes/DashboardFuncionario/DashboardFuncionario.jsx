import { useEffect, useState } from "react";
import relatorioService from "../../services/relatorioService";
import "./DashboardFuncionario.css";

const DashboardFuncionario = () => {

    const [envios, setEnvios] =
        useState(null);

    useEffect(() => {

        carregar();

    }, []);

    const carregar = async () => {

        const dados =
            await relatorioService
                .getEstatisticasEnvios();

        setEnvios(dados);
    };

    return (
        <div className="dashboard-grid">

            <div className="dashboard-card">
                <h3>📦 Pendentes</h3>

                <span className="dashboard-numero">
                    {envios?.enviosPendentes ?? 0}
                </span>
            </div>

            <div className="dashboard-card">
                <h3>✅ Concluídos</h3>

                <span className="dashboard-numero">
                    {envios?.enviosConcluidos ?? 0}
                </span>
            </div>

            <div className="dashboard-card">
                <h3>❌ Cancelados</h3>

                <span className="dashboard-numero">
                    {envios?.enviosCancelados ?? 0}
                </span>
            </div>

        </div>
    );
};

export default DashboardFuncionario;