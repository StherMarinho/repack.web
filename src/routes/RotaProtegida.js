import { Navigate } from "react-router-dom";
import { getUsuario, isAuthenticated } from "../services/auth";

const RotaProtegida = ({ children, role }) => {

    if (!isAuthenticated()) {
        return <Navigate to="/" />;
    }

    const usuario = getUsuario();

    if (role && usuario?.role !== role) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default RotaProtegida;