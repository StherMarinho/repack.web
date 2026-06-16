import { API_URL } from "./api";
const BASE_URL = API_URL+"/relatorios";

const rankingService = {

    getRanking: async (pagina = 1, itensPorPagina = 20) => {
        const response = await fetch(
            `${BASE_URL}/ranking?pagina=${pagina}&itensPorPagina=${itensPorPagina}`
        );

        if (!response.ok) throw new Error("Erro ao carregar ranking");

        return await response.json();
    }

};

export default rankingService;