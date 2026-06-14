import { API_URL } from "./api";
const BASE_URL = API_URL+"/empresas";

const empresaService = {

    listarEmpresas: async () => {
        const response = await fetch(`${BASE_URL}`);

        if (!response.ok) {
            throw new Error("Erro ao listar empresas");
        }

        return await response.json();
    },

    obterEmpresa: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error("Empresa não encontrada");
        }

        return await response.json();
    },

    criarEmpresa: async (dto) => {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.mensagem || "Erro ao criar empresa");
        }

        return await response.json(); // retorna { id }
    },

    atualizarEmpresa: async (id, dto) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar empresa");
        }

        return true;
    },

    patchEmpresa: async (id, dto) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar parcialmente empresa");
        }

        return true;
    },

    deletarEmpresa: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar empresa");
        }

        return true;
    }

};

export default empresaService;