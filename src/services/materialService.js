import { API_URL } from "./api";

const BASE_URL = API_URL;

const materialService = {
    listarMateriais: async () => {
        const response = await fetch(`${BASE_URL}/materiaisembalagens`);

        if (!response.ok) {
            throw new Error("Erro ao buscar materiais");
        }

        return await response.json();
    }
};

export default materialService;