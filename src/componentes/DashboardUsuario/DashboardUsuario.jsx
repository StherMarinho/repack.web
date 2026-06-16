import { useEffect, useState } from "react";
import rankingService from "../../services/rankingService";
import { getUserId } from "../../services/auth";
import "./DashboardUsuario.css";

const DashboardUsuario = () => {

    const [ranking, setRanking] = useState([]);

    const [minhaPosicao, setMinhaPosicao] =
        useState(null);

    useEffect(() => {

        carregar();

    }, []);

    const carregar = async () => {

        const dados =
            await rankingService.getRanking(
                1,
                20
            );

        setRanking(
            dados.itens.slice(0, 3)
        );

        const usuario =
            dados.itens.find(
                x =>
                    String(x.idUsuario) ===
                    String(getUserId())
            );

        setMinhaPosicao(usuario);
    };

    return (
        <div className="dashboard-grid">

            <div className="dashboard-card">
                <h3>🏆 Minha Posição</h3>

                <span className="dashboard-numero">
                    {minhaPosicao?.posicao ?? "-"}
                </span>
            </div>

            <div className="dashboard-card">
                <h3>⭐ Meus Pontos</h3>

                <span className="dashboard-numero">
                    {minhaPosicao?.totalPontos ?? 0}
                </span>
            </div>

            <div className="dashboard-card dashboard-card-ranking">
                <h3>Top 3 Ranking</h3>

                {ranking.map((item, index) => (
                    <div
                        key={item.idUsuario}
                    >
                        {index + 1}º -
                        {" "}
                        {item.nomeUsuario}
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DashboardUsuario;