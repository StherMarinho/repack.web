import { API_URL } from "./api";
import { getToken } from "./auth";

const API = API_URL+"/usuarios";

export const listarUsuarios = async () => {

    const response = await fetch(
        API,
        {
            headers: {
                Authorization:
                    `Bearer ${getToken()}`
            }
        }
    );

    if (!response.ok)
        throw new Error();

    return await response.json();
};

export const desativarUsuario = async (id) => {

    const response = await fetch(
        `${API}/desativar/${id}`,
        {
            method: "PUT",

            headers: {
                Authorization:
                    `Bearer ${getToken()}`
            }
        }
    );

    if (!response.ok)
        throw new Error();
};