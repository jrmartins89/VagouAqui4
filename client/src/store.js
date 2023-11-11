import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

// Estado inicial do Redux
const initialState = {};

// Middleware utilizado (redux-thunk para ações assíncronas)
const middleware = [thunk];

// Configuração da loja Redux (store)
const store = createStore(
    rootReducer, // Reducer combinado
    initialState, // Estado inicial
    compose(
        applyMiddleware(...middleware), // Aplica middleware
        // Extensão para o navegador Redux DevTools (se disponível)
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
    )
);

export default store;
