const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Converte campos vazios para uma string vazia, para que possamos usar as funções do validador
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // Verificações do nome
    if (Validator.isEmpty(data.name)) {
        errors.name = "O campo Nome é obrigatório";
    }

    // Verificações do email
    if (Validator.isEmpty(data.email)) {
        errors.email = "O campo Email é obrigatório";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "O campo Email está com informação inválida";
    }

    // Verificações da senha
    if (Validator.isEmpty(data.password)) {
        errors.password = "O campo Senha é obrigatório";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "O campo Confirmar senha é obrigatório";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "A Senha deve conter pelo menos 6 caracteres";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "As Senhas devem ser iguais";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
