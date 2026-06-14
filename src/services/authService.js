import { API_URL } from "./api";
const API = API_URL+"/usuarios";

export const login = async (data) => {
    const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        let respostaErro = await response.json()
        throw new Error(respostaErro.erro || "Erro no login");
    }
    const retorno = await response.text()
    return retorno;
};

export const register = async (data) => {
    const response = await fetch(`${API}/cadastro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.erro || "Erro no cadastro");
    }

    return result;
};