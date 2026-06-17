import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Home from "../pages/Home/Home";
import Perfil from "../pages/Perfil/Perfil";
import Ranking from "../pages/Ranking/Ranking";
import Mapa from "../pages/Mapa/Mapa";

import Pontuacao from "../pages/Pontos/Pontuacao";
import MeusEnvios from "../pages/MeusEnvios/MeusEnvios";

import CadastrarEnvio from "../pages/CadastrarEnvio/CadastrarEnvio";
import VerEnvios from "../pages/VerEnvios-Empresa/VerEnvios";
import AvaliarEnvios from "../pages/AvaliarEnvios/AvaliarEnvios";

import GerenciarUsuarios from "../pages/GerenciarUsuarios/GerenciarUsuarios";
import Relatorios from "../pages/Relatorios/Relatorios";
import CadastroAdm from "../pages/CadastroAdm/CadastroAdm";
import EnviosAdmin from "../pages/EnviosAdmin/EnviosAdmin";
import RegrasPontos from "../pages/Admin/RegrasPontos";
import Embalagens from "../pages/Embalagens/Embalagens";
import Empresas from "../pages/Empresas/Empresas";


import RotaProtegida from "./RotaProtegida";

const AppRoutes = () => {
    return (
        <Routes>
            
            {/* ================= ROTAS PÚBLICAS ================= */}
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* ================= ROTAS LOGADAS (QUALQUER ROLE) ================= */}
            <Route path="/home" element={
                <RotaProtegida>
                    <Home />
                </RotaProtegida>
            } />
            <Route path="/perfil" element={
                <RotaProtegida>
                    <Perfil />
                </RotaProtegida>
            } />
            <Route path="/ranking" element={
                <RotaProtegida>
                    <Ranking />
                </RotaProtegida>
            } />
            <Route path="/mapa" element={
                <RotaProtegida>
                    <Mapa />
                </RotaProtegida>
            } />

            {/* ================= ROTAS: APENAS USUÁRIO COMUM ================= */}
            <Route path="/pontos" element={
                <RotaProtegida role="Usuario">
                    <Pontuacao />
                </RotaProtegida>
            } />
            <Route path="/envios" element={
                <RotaProtegida role="Usuario">
                    <MeusEnvios />
                </RotaProtegida>
            } />

            {/* ================= ROTAS: APENAS FUNCIONÁRIO / EMPRESA ================= */}
            <Route path="/cadastrar-envio" element={
                <RotaProtegida role="Funcionario">
                    <CadastrarEnvio />
                </RotaProtegida>
            } />
            <Route path="/envios-empresa" element={
                <RotaProtegida role="Funcionario">
                    <VerEnvios />
                </RotaProtegida>
            } />
            <Route path="/aprovar-envios" element={
                <RotaProtegida role="Funcionario">
                    <AvaliarEnvios />
                </RotaProtegida>
            } />

            {/* ================= ROTAS: APENAS ADMINISTRADOR ================= */}
            <Route path="/admin/envios" element={
                <RotaProtegida role="Administrador">
                    <EnviosAdmin />
                </RotaProtegida>
            } />
            <Route path="/usuarios" element={
                <RotaProtegida role="Administrador">
                    <GerenciarUsuarios />
                </RotaProtegida>
            } />
            <Route path="/cadastroAdm" element={
                <RotaProtegida role="Administrador">
                    <CadastroAdm />
                </RotaProtegida>
            } />
            <Route path="/mapa" element={
                <RotaProtegida role="Administrador">
                    <Mapa />
                </RotaProtegida>
            } />
            <Route path="/regras" element={
                <RotaProtegida role="Administrador">
                    <RegrasPontos />
                </RotaProtegida>
            } />
            <Route path="/relatorios" element={
                <RotaProtegida role="Administrador">
                    <Relatorios />
                </RotaProtegida>
            } />
            <Route path="/empresas" element={
                <RotaProtegida role="Administrador">
                    <Empresas />
                </RotaProtegida>
            } />
            <Route path="/embalagens" element={
                <RotaProtegida role="Administrador">
                    <Embalagens />
                </RotaProtegida>
            } />
        </Routes>
    );
};

export default AppRoutes;