import Navbar from "../../componentes/Navbar/Navbar";
import './pontuacao.css'
import { useEffect, useState } from "react";
import { getPontuacaoUsuario } from "../../services/pontuacaoService";
import envioService from "../../services/envioService"; 
import { getUserId } from "../../services/auth";
import Card from "../../componentes/Card/Card";

const Pontos = () => {
  const [pontuacao, setPontuacao] = useState(null);
  const [idsConcluidos, setIdsConcluidos] = useState([]); 
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const idUsuario = getUserId();

  useEffect(() => {
    if (!idUsuario) {
      setErro("Usuário não autenticado.");
      setCarregando(false);
      return;
    }

    Promise.all([
      getPontuacaoUsuario(idUsuario),
      envioService.listarEnvios({ idUsuario }) 
    ])
      .then(([resultadoPontos, resultadoEnvios]) => {
        setPontuacao(resultadoPontos);
        
        if (resultadoEnvios && resultadoEnvios.sucesso) {
          const todosOsEnvios = resultadoEnvios.dados?.dados || [];
          
          
          const apenasIdsConcluidos = todosOsEnvios
            .filter((e) => e.statusEnvio === "Concluído")
            .map((e) => String(e.id)); 

          setIdsConcluidos(apenasIdsConcluidos);
        }
      })
      .catch(() => setErro("Não foi possível carregar os dados de pontuação."))
      .finally(() => setCarregando(false));
  }, [idUsuario]);

  if (carregando) 
    return (<> <Navbar tipoUsuario={"comum"} /> <p className="msg-carregando">Carregando...</p></>);
  if (erro)  
    return (<> <Navbar tipoUsuario={"comum"} /> <p className="msg-erro">{erro}</p></>);

  const historicoFiltrado = pontuacao?.historico?.filter(
    (item) => idsConcluidos.includes(String(item.idEnvio))
  ) || [];

  const totalPontosCalculado = historicoFiltrado.reduce(
    (acumulador, item) => acumulador + item.pontos, 
    0
  );

  return (
    <>
      <Navbar tipoUsuario={"comum"} />

      <div className="titulo-pontos">
          Minha Pontuação
      </div>

      <div className="pontuacao-container">
          <span className="subtitulo-pontos">
              Total de pontos:
          </span>

          <strong className="valor-pontos">
              {totalPontosCalculado.toLocaleString("pt-BR")} pontos
          </strong>
      </div>

      <div className="enviosPontuados">
          Envios que pontuaram:
      </div>
      
      <div className="cards">
        {historicoFiltrado.length === 0 ? (
          <p>Nenhum envio concluído ainda.</p>
        ) : (
          historicoFiltrado.map((item) => (
            <Card
              key={item.idEnvio}
              titulo={`Envio #${item.idEnvio}`}
              subtitulo={new Date(item.dataPontuacao).toLocaleDateString("pt-BR")}
              descricao={`${item.pontos.toLocaleString("pt-BR")} pontos gerados`}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Pontos;