import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

// Combina os reducers em um único rootReducer
export default combineReducers({
    auth: authReducer,     // Reducer para o estado de autenticação do usuário
    errors: errorReducer   // Reducer para o estado de erros
});
