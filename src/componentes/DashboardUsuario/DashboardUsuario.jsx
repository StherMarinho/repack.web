import { useEffect, useState } from "react";
import rankingService from "../../services/rankingService";
import { getUserId } from "../../services/auth";
import "./DashboardUsuario.css";

const DashboardUsuario = () => {

    const [ranking, setRanking] = useState([]);
    const [minhaPosicao, setMinhaPosicao] = useState(null);

    const medalhas = [
        "🥇",
        "🥈",
        "🥉"
    ];

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
        <div className="usuario-dashboard">

            <div className="usuario-cards">

                <div className="usuario-card">
                    <h3>🏆 Minha Posição</h3>

                    <span className="usuario-numero">
                        {minhaPosicao?.posicao ?? "-"}
                    </span>
                </div>

                <div className="usuario-card">
                    <h3>⭐ Meus Pontos</h3>

                    <span className="usuario-numero">
                        {minhaPosicao?.totalPontos ?? 0}
                    </span>
                </div>

            </div>

            <div className="usuario-top3">

                <h3>🏅 Top 3 Ranking</h3>

                {ranking.map((item, index) => (

                    <div
                        key={item.idUsuario}
                        className="usuario-top3-item"
                    >

                        <span className="usuario-medalha">
                            {medalhas[index]}
                        </span>

                        <span className="usuario-nome">
                            {item.nomeUsuario}
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default DashboardUsuario;