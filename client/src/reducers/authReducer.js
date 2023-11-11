import {
    SET_CURRENT_USER,
    USER_LOADING
} from "../actions/types";

const isEmpty = require("is-empty");

// Estado inicial do reducer
const initialState = {
    isAuthenticated: false, // Inicialmente, o usuário não está autenticado
    user: {}, // Informações do usuário (será preenchido quando autenticado)
    loading: false // Indica se o carregamento está em andamento
};

// Reducer que manipula as ações relacionadas à autenticação do usuário
export default function(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            // Atualiza o estado com as informações do usuário atual
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload), // Define como autenticado se o payload não estiver vazio
                user: action.payload // Atualiza as informações do usuário
            };
        case USER_LOADING:
            // Atualiza o estado indicando que o carregamento está em andamento
            return {
                ...state,
                loading: true
            };
        default:
            // Retorna o estado atual se a ação não for reconhecida
            return state;
    }
}
