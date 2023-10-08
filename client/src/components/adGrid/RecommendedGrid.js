import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserPreferences } from "../../actions/authActions";
import "./RecommendedGrid.css"; // Import the CSS file
import axios from "axios"; // Import axios for making API requests