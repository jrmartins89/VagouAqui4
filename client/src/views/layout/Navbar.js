import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions.js";
import "./Navbar.css";

class Navbar extends Component {
    // Função chamada ao clicar no botão de logout
    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        // Extrai informações sobre autenticação e usuário do estado Redux
        const { isAuthenticated, user } = this.props.auth;

        return (
            <div className="navbar">
                <nav className="z-depth-0">
                    <div className="nav-wrapper">
                        {/* Link para a página inicial */}
                        <Link to="/" className="col s5 brand-logo center black-text">
                            <b className="home-link"> Início</b>
                        </Link>

                        {/* Botões de navegação condicionais com base na autenticação */}
                        <div className="nav-buttons">
                            {isAuthenticated && (
                                <Link to="/preferences" className="btn-edit-prefs">
                                    <p>Editar Preferências</p>
                                </Link>
                            )}
                            {isAuthenticated && (
                                <Link to="/recommendation" className="btn-show-recommendations">
                                    <p>Recomendações</p>
                                </Link>
                            )}
                        </div>

                        {/* Se autenticado, exibe informações do usuário e botão de logout */}
                        {isAuthenticated ? (
                            <div className="user-info">
                                <span className="user-email">{user.email}</span>
                                <button
                                    onClick={this.onLogoutClick}
                                    className="btn btn-logout"
                                >
                                    <b>Logout</b>
                                </button>
                            </div>
                        ) : null}
                    </div>
                </nav>
            </div>
        );
    }
}

// Mapeia o estado do Redux para as propriedades do componente
const mapStateToProps = (state) => ({
    auth: state.auth,
});

// Conecta o componente ao Redux e ao Router
export default withRouter(connect(mapStateToProps, { logoutUser })(Navbar));
