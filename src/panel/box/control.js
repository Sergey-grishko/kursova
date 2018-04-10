import React, { Component } from 'react';
import '../../App.css';
import {withRouter,NavLink} from 'react-router-dom';
import {connect} from 'react-redux';


class Control extends Component {

    render() {
        return (
            <div className="sidebar">
                <div className="sidebar_title">
                    <span>Bon Appetit<sup>Pre alpha</sup></span>
                </div>
                <div>
                    <ul className="sidebar_li">
                        <li><NavLink to="/panel/dashboard"><i className="material-icons">dashboard</i> Dashboard</NavLink></li>
                        <li><NavLink to="/panel/users"><i className="material-icons">group</i> Users</NavLink></li>
                        <li><NavLink to="/panel/reports"><i className="material-icons">inbox</i> Reports</NavLink></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default (withRouter(connect(store => ({store: store}))(Control)))
