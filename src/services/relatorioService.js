import { API_URL } from "./api";
const BASE_URL = API_URL+"/relatorios";

const relatorioService = {

    getEstatisticasEnvios: async () => {
        const response = await fetch(`${BASE_URL}/envios`);
        if (!response.ok) throw new Error("Erro ao carregar estatísticas de envios");
        return await response.json();
    },

    getEmbalagensMaisRecebidas: async (top = 5) => {
        const response = await fetch(`${BASE_URL}/embalagens?top=${top}`);
        if (!response.ok) throw new Error("Erro ao carregar embalagens");
        return await response.json();
    },

    getEstatisticasPontuacao: async () => {
        const response = await fetch(`${BASE_URL}/pontuacao`);
        if (!response.ok) throw new Error("Erro ao carregar estatísticas de pontuação");
        return await response.json();
    },

    getEstatisticasUsuarios: async () => {
        const response = await fetch(`${BASE_URL}/usuarios`);
        if (!response.ok) throw new Error("Erro ao carregar estatísticas de usuários");
        return await response.json();
    }

};

export default relatorioService;
