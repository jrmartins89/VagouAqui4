const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
    let errors = {};
// Convert empty fields to an empty string, so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
// Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "O campo Name é obrigatório";
    }
// Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "O campo Email é obrigatório";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "O campo Email está com informação inválida";
    }
// Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "O campo Password é obrigatório";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "O campo Confirm password é obrigatório";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "O Password deve conter pelo menos 6 caracteres";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Os Passwords devem ser iguais";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};