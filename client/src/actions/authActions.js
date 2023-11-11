import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

// Registra Usuário
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => history.push("/login")) /// redireciona para o login em caso de registro bem-sucedido
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Login - obter token do usuário
export const loginUser = userData => dispatch => {
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Salva no localStorage
            // Define o token no localStorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);
            // Define o token no cabeçalho de autenticação
            setAuthToken(token);
            // Decodifica o token para obter os dados do usuário
            const decoded = jwt_decode(token);
            // Inclui o email no objeto do usuário
            decoded.email = userData.email;
            // Define o usuário atual
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Define usuário logado
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// Carregamento do usuário
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Desconectar usuário
export const logoutUser = () => dispatch => {
    // Remove o token do localStorage
    localStorage.removeItem("jwtToken");
    // Remove o cabeçalho de usuário para futuras requisições
    setAuthToken(false);
    // Define o usuário atual como um objeto vazio {} que definirá isAuthenticated como false
    dispatch(setCurrentUser({}));
};

// Atualizar Preferências do Usuário
export const updateUserPreferences = (updatedPreferences, history) => (dispatch) => {
    dispatch(setUserLoading()); // Indica que a atualização está em andamento
    axios
        .put("/api/users/preferences", updatedPreferences)
        .then((res) => {
            // Supondo que as preferências foram atualizadas com sucesso
            console.log(res)
            // Redireciona para uma página de sucesso
            history.push("/products");
        })
        .catch((err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data,
            })
        );
};
