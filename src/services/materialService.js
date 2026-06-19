import { API_URL } from "./api";
const BASE_URL = API_URL;

export async function getMateriais() {
  const response = await fetch(`${BASE_URL}/materiasembalagens`);
  if (!response.ok) throw new Error("Erro ao buscar materiais");
  return response.json();
}

const materialService = {
  obterMaterial: async (id) => {
        const response = await fetch(`${BASE_URL}/materiasembalagens/${id}`);

        if (!response.ok) {
            throw new Error("Embalagem não encontrada");
        }

        return await response.json();
    },

    criarMaterial: async (dto) => {
        const response = await fetch(`${BASE_URL}/materiasembalagens`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dto) 
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.erro || "Erro ao criar embalagem");
        }

        return await response.text();
    },

    atualizarMaterial: async (id, dto) => {
        const response = await fetch(`${BASE_URL}/materiasembalagens/${id}`, {
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

    deletarMaterial: async (id) => {
        const response = await fetch(`${BASE_URL}/materiasembalagens/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar embalagem");
        }

        return true;
    }

}
export default materialService;