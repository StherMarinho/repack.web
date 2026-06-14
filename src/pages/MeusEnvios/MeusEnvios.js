import { useEffect, useState } from "react";
import Card from "../../componentes/Card/Card.jsx";
import envioService from "../../services/envioService";
import { getPontuacaoUsuario } from "../../services/pontuacaoService";
import { getUsuario, getUserId } from "../../services/auth";
import "./MeusEnvios.css";
import Navbar from "../../componentes/Navbar/Navbar.jsx";

const MeusEnvios = () => {
    const [enviosConcluidos, setEnviosConcluidos] = useState([]);
    const [enviosCancelados, setEnviosCancelados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const usuario = getUsuario();
    const idUsuario = usuario?.usuario?.id ?? getUserId() ?? 1;

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resultadoEnvios, resultadoPontos] = await Promise.all([
                    envioService.listarEnvios({ idUsuario }),
                    getPontuacaoUsuario(idUsuario).catch(() => null)
                ]);

                if (resultadoEnvios.sucesso) {
                    const todosOsEnvios = resultadoEnvios.dados.dados;
                    const historicoPontos = resultadoPontos?.historico || [];

                    
                    const injetarPontosNoEnvio = (envio) => {
                        
                        const registroPonto = historicoPontos.find(
                            (ponto) => String(ponto.idEnvio) === String(envio.id)
                        );
                        
                        return {
                            ...envio,
                            pontos: registroPonto ? registroPonto.pontos : 0
                        };
                    };

                    const concluidosComPontos = todosOsEnvios
                        .filter(e => e.statusEnvio === "Concluído")
                        .map(injetarPontosNoEnvio);

                    const canceladosComPontos = todosOsEnvios
                        .filter(e => e.statusEnvio === "Cancelado")
                        .map(injetarPontosNoEnvio);

                    setEnviosConcluidos(concluidosComPontos);
                    setEnviosCancelados(canceladosComPontos);
                } else {
                    setErro("Não foi possível carregar os envios.");
                }
            }
            catch (err) {
                console.error(err);
                setErro("Erro ao conectar com o servidor.");
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [idUsuario]);

    const formatarData = (dataString) => {
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-br");
    };

    if(carregando) 
        return (<><Navbar tipoUsuario={"comum"}/><p className="meus-envios__mensagem">Carregando envios...</p></>);
    
    if(erro)
        return (<><Navbar tipoUsuario={"comum"}/><p className="meus-envios__mensagem--erro">{erro}</p></>);

    return(
        <>
        <Navbar tipoUsuario={"comum"}/>
        <div className="meus-envios">
            <h2 className="meus-envios__titulo">Meus envios</h2>

            {enviosConcluidos.length === 0 ? (
                <p className="meus-envios__mensagem">Você ainda não possui envios concluídos.</p>
            ) : (
                <div className="meus-envios__grid">
                    {enviosConcluidos.map((envio) => (
                        <Card
                            key={envio.id}
                            titulo={`Envio #${envio.id}`}
                            subtitulo={envio.nomeEmpresa}
                            descricao={
                                `Data: ${formatarData(envio.dataEnvio)} | ` + 
                                `Quantidade: ${envio.quantidadeItens} | ` +
                                `${envio.pontos.toLocaleString("pt-BR")} pontos gerados`
                            }
                        />
                    ))}
                </div>
            )}

            {enviosCancelados.length > 0 && (
                <div className="meus-envios__secao-cancelados">
                    <h3 className="meus-envios__subtitulo">Envios cancelados</h3>

                    <div className="meus-envios__grid">
                        {enviosCancelados.map((envio) => (
                            <Card
                                key={envio.id}
                                titulo={`Envio #${envio.id}`}
                                subtitulo={envio.nomeEmpresa}
                                descricao={
                                    `Data: ${formatarData(envio.dataEnvio)} | ` + 
                                    `Quantidade: ${envio.quantidadeItens}`
                                }
                                link={`/envios/${envio.id}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default MeusEnvios;