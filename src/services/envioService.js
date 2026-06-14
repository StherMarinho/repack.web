import { API_URL } from "./api";
const BASE_URL = API_URL;

const envioService = {

    listarEnvios: async (filtro = {}) => {
        const params = new URLSearchParams();

        if (filtro.idUsuario) params.append("IdUsuario", filtro.idUsuario);
        if (filtro.idStatus) params.append("idStatus", filtro.idStatus);
        if (filtro.pagina) params.append("Pagina", filtro.pagina);
        if (filtro.tamanhoPagina) params.append("TamanhoPagina", filtro.tamanhoPagina);

        const response = await fetch(`${BASE_URL}/Envios?${params.toString()}`);
        const data = await response.json();
        return data;
    },

    obterEnvio: async (id) => {
        const response = await fetch(`${BASE_URL}/Envios/${id}`);
        const data = await response.json();
        return data;
    },

    criarEnvio: async (envioDTO) => {
        const response = await fetch(`${BASE_URL}/Envios`, {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(envioDTO),
        });
        const data = await response.json();
        return data;
    },

    cancelarEnvio: async (id) =>{
        const response = await fetch(`${BASE_URL}/Envios/${id}/cancelar`, {
            method: "PATCH",
        });

        const data = await response.json();
        return data;
    },

    avaliarEnvio: async (id, avaliarDTO) =>{
        const response = await fetch(`${BASE_URL}/Envios/${id}/avaliar`,{
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(avaliarDTO),
        });
        const data = await response.json();
        return data;
    },

    excluirEnvio: async (id) => {
        const response = await fetch(`${BASE_URL}/Envios/${id}`,{
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    },

    editarEnvio: async (id, editarDto) => {
        const response = await fetch(`${BASE_URL}/Envios/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(editarDto),
        });

        const data = await response.json();
        return data;

    }

};

export default envioService;