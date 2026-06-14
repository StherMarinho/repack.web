import { API_URL } from "./api";
const BASE_URL = API_URL;

export async function getPontuacaoUsuario(idUsuario) {
  const response = await fetch(`${BASE_URL}/pontuacoes/usuario/${idUsuario}`);
  if (!response.ok) throw new Error("Erro ao buscar pontuação");
  return response.json();
}

export async function getRanking(top = 10) {
  const response = await fetch(`${BASE_URL}/pontuacoes/ranking?top=${top}`);
  if (!response.ok) throw new Error("Erro ao buscar ranking");
  return response.json();
}