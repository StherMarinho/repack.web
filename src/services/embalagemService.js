import { API_URL } from "./api";
const BASE_URL = API_URL+"/embalagens";

const embalagemService = {

    listarEmbalagens: async () => {
        const response = await fetch(`${BASE_URL}`);

        if (!response.ok) {
            throw new Error("Erro ao listar embalagens");
        }

        return await response.json(); // EmbalagemDTO[]
    },

    obterEmbalagem: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Embalagem não encontrada");
        }

        return await response.json();
    },

    criarEmbalagem: async (dto) => {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto) // EmbalagemCreateDTO
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.erro || "Erro ao criar embalagem");
        }

        return await response.json();
    },

    atualizarEmbalagem: async (id, dto) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar embalagem");
        }

        return true;
    },

    deletarEmbalagem: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar embalagem");
        }

        return true;
    }
};

export default embalagemService;