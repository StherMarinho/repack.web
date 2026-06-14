export const salvarLogin = (res) => {
    localStorage.setItem("token", res);
    //localStorage.setItem("usuario", JSON.stringify(atob(res.split(".")[1])));
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUsuario = () => {
    const data = localStorage.getItem("token");
    return data ? JSON.parse(atob(data.split(".")[1])) : null;
};

export const logout = () => {
    localStorage.removeItem("token");
    //localStorage.removeItem("usuario");
};

export const isAuthenticated = () => {
    return !!getToken();
};

// ROLES
export const isAdmin = () => {
    const usuario = getUsuario();
    return usuario?.role === "Administrador";
};

export const isFuncionario = () => {
    const usuario = getUsuario();
    return usuario?.role === "Funcionario";
};

export const isUsuario = () => {
    const usuario = getUsuario();
    return usuario?.role === "Usuario";
};

// ID DO USUÁRIO

export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    return payload.UserId; 
  } catch (error) {
    return null;
  }
};

// ROLE

export const getRole = () => {

    const usuario =
        getUsuario();

    return usuario?.role;
};

// PONTUAÇÃO

export const podeVerPontuacao = () => {

    return getRole() === "Usuario";
};