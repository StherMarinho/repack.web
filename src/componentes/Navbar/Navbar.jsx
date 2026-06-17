import { useState } from "react";
import './Navbar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRole } from "../../services/auth";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const esconderNavbar = ["/login", "/cadastro", "/"];

    const [menuAberto, setMenuAberto] = useState(false);

    const toggleMenu = () => setMenuAberto((prev) => !prev);
    const fecharMenu = () => setMenuAberto(false);
    const roleUsuario = getRole();

    console.log("roleUsuario atual:", roleUsuario);

    const handleLogout = () => {
        localStorage.removeItem("token");
        fecharMenu();
        navigate("/");
    };

    const renderizarMenu = () => {
        switch (roleUsuario) {
            case "Usuario":
                return (
                    <>
                        <li><Link to="/envios" onClick={fecharMenu}>Meus Envios</Link></li>
                        <li><Link to="/pontos" onClick={fecharMenu}>Meus Pontos</Link></li>
                        <li><Link to="/ranking" onClick={fecharMenu}>Rankings</Link></li>
                        <li><Link to="/mapa" onClick={fecharMenu}>Mapa</Link></li>
                    </>
                );
            case "Funcionario":
                return (
                    <>
                        <li><Link to="/cadastrar-envio" onClick={fecharMenu}>Cadastrar Envio</Link></li>
                        <li><Link to="/envios-empresa" onClick={fecharMenu}>Ver envios</Link></li>
                        <li><Link to="/aprovar-envios" onClick={fecharMenu}>Aprovar Envios</Link></li>
                    </>
                );
            case "Administrador":
                return (
                    <>
                        <li><Link to="/admin/envios" onClick={fecharMenu}>Envios</Link></li>
                        <li><Link to="/empresas" onClick={fecharMenu}>Empresa</Link></li> {/*tem que fazer */}
                        <li><Link to="/embalagens" onClick={fecharMenu}>Embalagens</Link></li> {/*tem que fazer */}
                        <li><Link to="/mapa" onClick={fecharMenu}>Mapa</Link></li>
                        <li><Link to="/regras" onClick={fecharMenu}>Regras de Pontuação</Link></li>
                        <li><Link to="/relatorios" onClick={fecharMenu}>Relatórios</Link></li>
                        <li><Link to="/cadastroAdm" onClick={fecharMenu}>Usuários</Link></li>
                    </>
                );
            default:
                return null;
        }
    };

    if (esconderNavbar.includes(location.pathname)) {
        return null;
    }

    return (
        <header className="navbar">
            <div className="navbar__container">

                <Link to="/home" className="navbar__brand" onClick={fecharMenu}>
                    <img
                        src="../imagens/logoRepack.png"
                        alt="RePack"
                        className="navbar__brand-logo"
                    />
                </Link>

                <nav className="navbar__main-nav">
                    <ul className="nav-list">
                        {renderizarMenu()}
                    </ul>
                </nav>

                {/* Desktop Actions */}
                <div className="navbar__user-actions">
                    <Link to="/perfil" className="nav-link--cta">
                        Meu Perfil
                    </Link>
                    <button onClick={handleLogout} className="nav-link--cta nav-link--logout">
                        Sair
                    </button>
                </div>

                <button
                    className="navbar__mobile-toggle"
                    onClick={toggleMenu}
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                    aria-controls="mobileMenu"
                >
                    {menuAberto ? "✕" : "☰"}
                </button>

            </div>

            {/* Menu Dropdown Mobile */}
            <div
                id="mobileMenu"
                className={`mobile-menu ${menuAberto ? "is-active" : ""}`}
            >
                <ul>
                    {renderizarMenu()}
                    <li>
                        <Link to="/perfil" className="nav-link--cta" onClick={fecharMenu}>
                            Meu Perfil
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="nav-link--cta nav-link--logout">
                            Sair
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;