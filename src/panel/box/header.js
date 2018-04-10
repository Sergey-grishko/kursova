import React, { Component } from 'react';
import '../../App.css';
import {toast, ToastContainer} from "react-toastify";
import {withRouter} from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as Info from '../../action/action'



const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            open:false,
            isLoading: false
        };
        this.Logout = this.Logout.bind(this);
        this.onSubmit = this.onSubmit.bind(this)
    };



    Logout(){
        localStorage.clear();
        this.props.history.push('/');
        Info.defaultInfo();
    }

    handleOpen = () => {
        let info = this.props.store.infoCompany;
        info.ownerPassword = "";
        this.setState({...info, open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    async componentDidMount(){
        await Info.infoCompany()
    }

    onSubmit () {
        try {
            if (this.state.name.length <= 3) throw new Error('Company name must be at least 3 characters');
            if (this.state.description.length < 3) throw new Error('Company description must be at least 16 characters');
            if (!EmailRegex.test(this.state.ownerEmail)) throw new Error('Email is invalid');
            if (this.state.ownerPassword.length >=1 && this.state.ownerPassword.length < 6) throw new Error('Password must be at least 6 characters');
            if (isNaN(this.state.orderValue)) throw new Error('Report value is invalid. Must be a number');
            //------------
            let company = {...this.state};
            Info.changeCompany(company);
            toast.success("success");
            this.setState({open: false});
        }
        catch (e) {
            toast.error(e.message);
        }
    }



    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Save"
                primary={true}
                keyboardFocused={true}
                onClick={this.onSubmit}
            />,
        ];
        return (
                  <ul className="nav_mani">
                      <li onClick={this.handleOpen}>{this.props.store.infoCompany.name} <i className="material-icons">settings</i></li>
                      <li onClick={this.Logout} ><i className="material-icons">exit_to_app</i></li>
                      <Dialog
                          style={this.state.isLoading ? {opacity: 0.9} : null}
                          title="Settings"
                          actions={actions}
                          modal={false}
                          contentStyle={{width:500}}
                          open={this.state.open}
                          onRequestClose={this.handleClose}
                          autoScrollBodyContent={true}
                      >
                          <TextField
                              hintText="Company name"
                              floatingLabelText="Name"
                              fullWidth
                              value={this.state.name}
                              onChange={(e) => this.setState({name:e.target.value})}
                              multiLine={false}
                          />
                          <TextField
                              hintText="Company description"
                              floatingLabelText="Description"
                              fullWidth
                              rows={2}
                              value={this.state.description}
                              onChange={(e) => this.setState({description:e.target.value})}
                              multiLine={false}
                          />
                          <TextField
                              hintText="Email"
                              floatingLabelText="Email"
                              fullWidth
                              value={this.state.ownerEmail}
                              onChange={(e) => this.setState({ownerEmail: e.target.value})}
                              multiLine={false}
                          />
                          <TextField
                              hintText="Password"
                              floatingLabelText="Password"
                              fullWidth
                              type="password"
                              value={this.state.ownerPassword}
                              onChange={(e) => this.setState({ownerPassword: e.target.value})}
                              multiLine={false}
                          />
                          <TextField
                              hintText="Report value"
                              floatingLabelText="Report value"
                              value={this.state.orderValue}
                              onChange={(e) => this.setState({orderValue: e.target.value})}
                              fullWidth
                              multiLine={false}
                          />
                          <SelectField
                              value={this.state.imageQuality}
                              onChange={(event, index, value) => this.setState({imageQuality: value})}
                              fullWidth
                              floatingLabelText="Photo resolution"
                          >
                              <MenuItem value='low' primaryText="Low"/>
                              <MenuItem value='medium' primaryText="Medium"/>
                              <MenuItem value='high' primaryText="High"/>
                          </SelectField>
                          <SelectField
                              value={this.state.language}
                              onChange={(event, index, value) => this.setState({language:value})}
                              fullWidth
                              floatingLabelText="Language"
                          >
                              <MenuItem value='en' primaryText="English"/>
                              <MenuItem value='ru' primaryText="Русский" disabled />
                          </SelectField>
                      </Dialog>
                      <ToastContainer/>
                  </ul>
        );
    }
}

export default connect(store => ({store: store}))(withRouter(Header))
