import { GET_ERRORS } from "../actions/types";

// Estado inicial do reducer
const initialState = {};

// Reducer que manipula as ações relacionadas a erros
export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            // Atualiza o estado com os erros recebidos na ação
            return action.payload;
        default:
            // Retorna o estado atual se a ação não for reconhecida
            return state;
    }
}
