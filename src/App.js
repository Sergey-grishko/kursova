import React, {Component} from 'react';

//Material
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//Router
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {Sign} from './panel/Auth/login';
import {Reg} from './panel/Auth/reg'
import {Panel} from "./panel/box/index";
import Loader from './components/loading/loading'
import {ToastContainer} from "react-toastify";



class App extends Component {
    render() {
        return (
            <div>
                <Router>
                    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                        <Switch>
                            <Route exact path="/" component={Sign}/>
                            <Route path="/registration" component={Reg}/>
                            <Route path="/panel" component={Panel}/>
                        </Switch>
                    </MuiThemeProvider>
                </Router>
                <Loader/>
                <ToastContainer autoClose={5000}/>
            </div>
        );
    }
}

export default App;