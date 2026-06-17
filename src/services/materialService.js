import { API_URL } from "./api";
const BASE_URL = API_URL;

export async function getMateriais() {
  const response = await fetch(`${BASE_URL}/materiasembalagens`);
  if (!response.ok) throw new Error("Erro ao buscar materiais");
  return response.json();
}