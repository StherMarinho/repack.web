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

        try {

            const dados =
                await relatorioService
                    .getEstatisticasEnvios();

            setEnvios(dados);

        } catch (erro) {

            console.error(erro);

        }
    };

    return (
        <div className="func-dashboard">

            <div className="func-cards">

                <div className="func-card func-card--pendente">

                    <h3>📦 Pendentes</h3>

                    <span className="func-numero">
                        {envios?.enviosPendentes ?? 0}
                    </span>

                </div>

                <div className="func-card func-card--concluido">

                    <h3>✅ Concluídos</h3>

                    <span className="func-numero">
                        {envios?.enviosConcluidos ?? 0}
                    </span>

                </div>

                <div className="func-card func-card--cancelado">

                    <h3>❌ Cancelados</h3>

                    <span className="func-numero">
                        {envios?.enviosCancelados ?? 0}
                    </span>

                </div>

            </div>

        </div>
    );
};

export default DashboardFuncionario;