const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    // Converte campos vazios para uma string vazia, para que possamos usar as funções do validador
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // Verificações do email
    if (Validator.isEmpty(data.email)) {
        errors.email = "O campo Email é necessário";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "O Email informado é inválido";
    }

    // Verificações da senha
    if (Validator.isEmpty(data.password)) {
        errors.password = "O campo Senha é obrigatório";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
