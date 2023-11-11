import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions.js";
import "./Login.css"; // Importa o arquivo CSS personalizado

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {},
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
            });
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        this.props.loginUser(userData);
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="login-container">
                <div className="login-content">
                    <Link to="/" className="back-link">
                        Voltar ao início
                    </Link>
                    <div className="heading">
                        <h4>Faça o login</h4>
                        <p>
                            <b>Ainda não é cadastrado?</b>{" "}
                            <Link to="/register">Cadastre-se</Link>
                        </p>
                    </div>
                    <form noValidate onSubmit={this.onSubmit}>
                        <div className="input-field">
                            <input
                                onChange={this.onChange}
                                value={this.state.email}
                                error={errors.email || errors.emailnotfound}
                                id="email"
                                type="email"
                                placeholder="Email"
                            />
                            <span className="error-text">
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </div>
                        <div className="input-field">
                            <input
                                onChange={this.onChange}
                                value={this.state.password}
                                error={errors.password || errors.passwordincorrect}
                                id="password"
                                type="password"
                                placeholder="Password"
                            />
                            <span className="error-text">
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </div>
                        <div className="button-container">
                            <button type="submit" className="login-button">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
