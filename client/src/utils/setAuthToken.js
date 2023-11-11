import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
        // Aplica token de autorização a cada requisição se estiver logado
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Exclui o cabeçalho de usuário
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAuthToken;
