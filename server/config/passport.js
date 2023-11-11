const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users"); // Modelo de usuário do MongoDB
const keys = require("./keys"); // Chaves secretas e configurações
const opts = {};

// Extrai o JWT do cabeçalho de autorização como um token Bearer
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// Chave secreta para verificar a assinatura do token JWT
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    // Configuração da estratégia JWT para autenticação com Passport
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // Encontra o usuário pelo ID incluído no payload do JWT
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        // Se o usuário for encontrado, retorna o usuário
                        return done(null, user);
                    }
                    // Se o usuário não for encontrado, retorna false
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};
