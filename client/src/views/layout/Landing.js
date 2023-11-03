import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions.js";
import { Link } from "react-router-dom";
import "./Landing.css"; // Import the updated CSS file

class Landing extends Component {
    render() {
        const { user } = this.props.auth;

        return (
            <div className="landing-container"> {/* Apply the background image */}
                <div className="welcome-text">
                    <h4>
                        <b>Seja bem vindo(a),</b> {user.name.split(" ")[0]}
                    </h4>
                    <p className="welcome-text">
                        <b>Você está logado(a) no VagouAqui :D</b>
                    </p>
                    <div className="col s6">
                        <Link
                            to="/products"
                            className="btn produtos-btn"
                        >
                            Anúncios
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

Landing.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Landing);
