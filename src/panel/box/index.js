import React, { Component } from 'react';
import '../../App.css';
import Control from './control'
import Header from "./header";
import {Switch, Route,Redirect} from 'react-router-dom'
import Dashboard from "../dashboard/dashboard"
import User from "../Users/users"
import Reports from "../reports/reports"


export class Panel extends Component {

    render() {
        return (
            <div className="container">
            <div className="box">
                <Control />
                <div>
                    <header><Header/></header>
                    <main className="content_bg">
                            <Switch>
                                <Redirect exact from="/panel" to="/panel/dashboard"/>
                                <Route path="/panel/dashboard" component={Dashboard}/>
                                <Route path="/panel/users" component={User}/>
                                <Route path="/panel/reports/" component={Reports}/>
                            </Switch>
                    </main>
                </div>
            </div>
            </div>
        );
    }
}
