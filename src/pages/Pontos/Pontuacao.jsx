import Navbar from "../../componentes/Navbar/Navbar";
import './pontuacao.css'
import { useEffect, useState, useMemo } from "react";
import { getPontuacaoUsuario } from "../../services/pontuacaoService";
import envioService from "../../services/envioService";
import { getUserId } from "../../services/auth";
import Card from "../../componentes/Card/Card";

const Pontos = () => {
  const [pontuacao, setPontuacao] = useState(null);
  const [idsConcluidos, setIdsConcluidos] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);

  const itensPorPagina = 10;

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

  const historicoFiltrado = useMemo(() => {
    return (pontuacao?.historico || []).filter(
      (item) => idsConcluidos.includes(String(item.idEnvio))
    );
  }, [pontuacao, idsConcluidos]);

  const totalPaginas = Math.ceil(historicoFiltrado.length / itensPorPagina);

  const historicoPaginado = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return historicoFiltrado.slice(inicio, fim);
  }, [historicoFiltrado, paginaAtual]);

  const totalPontosCalculado = historicoFiltrado.reduce(
    (acc, item) => acc + item.pontos,
    0
  );

  if (carregando)
    return (
      <>
        <Navbar tipoUsuario={"comum"} />
        <p className="msg-carregando">Carregando...</p>
      </>
    );

  if (erro)
    return (
      <>
        <Navbar tipoUsuario={"comum"} />
        <p className="msg-erro">{erro}</p>
      </>
    );

  return (
    <>
      <Navbar tipoUsuario={"comum"} />

      <div className="titulo-pontos">
        Minha Pontuação
      </div>

      <div className="pontuacao-container">
        <span className="subtitulo-pontos">Total de pontos:</span>

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
          historicoPaginado.map((item) => (
            <Card
              key={item.idEnvio}
              titulo={`Envio #${item.idEnvio}`}
              subtitulo={new Date(item.dataPontuacao).toLocaleDateString("pt-BR")}
              descricao={`${item.pontos.toLocaleString("pt-BR")} pontos gerados`}
            />
          ))
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className="paginacao">

          <button
            className="paginacao-btn"
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(p => p - 1)}
          >
            Anterior
          </button>

          <span className="paginacao-info">
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            className="paginacao-btn"
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual(p => p + 1)}
          >
            Próxima
          </button>

        </div>
      )}
    </>
  );
};

export default Pontos;