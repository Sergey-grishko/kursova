import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {createStore, applyMiddleware} from 'redux';
import {Sign} from './Auth/login';
import {Reg} from './Auth/reg'
import {Provider} from 'react-redux';
import './App.css';
import {Panel} from "./panel/box/index";
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Info from  './panel/reducers/Company';
import logger from 'redux-logger';


export const store = createStore(Info,applyMiddleware(logger));




class App extends Component {


  render() {
    return (
        <Provider store={store}>
          <Router>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <Switch>
                          <Route exact  path="/" component={Sign} />
                          <Route path="/registration" component={Reg}/>
                          <Route path="/panel" component={Panel}/>
                  </Switch>
              </MuiThemeProvider>
          </Router>
        </Provider>
    );
  }
}

export default App;