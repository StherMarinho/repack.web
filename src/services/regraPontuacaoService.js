import { API_URL } from "./api";
const BASE_URL = API_URL;

export async function getRegras() {
  const response = await fetch(`${BASE_URL}/regrapontuacoes`);
  if (!response.ok) throw new Error("Erro ao buscar regras");
  return response.json();
}

export async function createRegra(dto) {
  const response = await fetch(`${BASE_URL}/regrapontuacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error("Erro ao criar regra");
  return response.json();
}

export async function patchRegra(id, dto) {
  const response = await fetch(`${BASE_URL}/regrapontuacoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error("Erro ao editar regra");
}

export async function deleteRegra(id) {
  const response = await fetch(`${BASE_URL}/regrapontuacoes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir regra");
}