import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import './auth.css';
import { ToastContainer, toast } from 'react-toastify';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';



const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export class Reg extends Component {
    constructor(props) {
        super(props);
        this.state ={
            name: "",
            description: "",
            ownerEmail: "",
            ownerPassword:"",
            orderValue: "100",
            imageQuality: "low",
            language: 'en',
        };
        this.onSubmit = this.onSubmit.bind(this)
    };

     onSubmit(e){
        e.preventDefault();
        let company = Object.assign({}, this.state);

        try{
            if(company.name.length < 3) throw new Error('Company name to small');
            if(company.description.length < 3) throw new Error('Company description to small');
            if(company.ownerPassword.length < 6) throw new Error('Password to small');
            if(!EmailRegex.test(company.ownerEmail)) throw new Error('Email is invalid');
            company.orderValue = company.orderValue.replace(',','.');
            if(isNaN(company.orderValue)) throw new Error('Report value is invalid. Must be a number');
            toast.success('Your company successfully registered. Now you can login in panel and start work.');
            fetch("http://web.bidon-tech.com:65059/company",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({
                        name: this.state.name,
                        ownerEmail: this.state.ownerEmail,
                        ownerPassword: this.state.ownerPassword,
                        description: this.state.description,
                        logo: "noLogo",
                        imageQuality: this.state.imageQuality,
                        orderValue: this.state.orderValue,
                        active: true,
                        language: this.state.language
                    })
                }).then((response) => response.json())
                .then((res) => {
                    if (res.error) {
                        toast.error(res.message);
                    } else {
                        this.props.history.push('/')
                    }
                });
        } catch(e) {
            console.log(e);
            toast.error(e.message || e)
        }
    }






    render() {
        return (
        <div className="container" style={{margin: "40px auto"}}>
            <div className="form">
                <div className="title">
                    <img alt="logo" src="http://bonland.web.bidon-tech.com:65050/static/media/logo.5caa6c54.png" height="30" width="30"/>
                    <p>Bon Apetit</p>
                </div>
                <TextField
                    fullWidth
                    hintText="Your Company name"
                    floatingLabelText="Company name"
                    value={this.state.name}
                    onChange={e => this.setState({name:e.target.value})}
                    multiLine={false}
                />
                <TextField
                    fullWidth
                    hintText="Enter A few words about your company"
                    floatingLabelText="Company description"
                    multiLine={false}
                    value={this.state.description}
                    onChange={e => this.setState({description:e.target.value})}
                    rows={2}
                />
                <TextField
                    fullWidth
                    hintText="Enter your Email"
                    floatingLabelText="Email"
                    value={this.state.ownerEmail}
                    onChange={e => this.setState({ownerEmail:e.target.value})}
                    multiLine={false}
                />
                <TextField
                    fullWidth
                    hintText="Enter your password"
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.ownerPassword}
                    onChange={e => this.setState({ownerPassword:e.target.value})}
                    multiLine={false}
                />
                <TextField
                    fullWidth
                    hintText="Yours value per report"
                    floatingLabelText="Report value"
                    value={this.state.orderValue}
                    onChange={e => this.setState({ orderValue: e.target.value })}
                    multiLine={false}
                />
                <SelectField
                    fullWidth
                    floatingLabelText="Photo resolution"
                    value={this.state.imageQuality}
                    onChange={(event, index, value) => this.setState({imageQuality: value})}
                >
                    <MenuItem value='low' primaryText="Low"/>
                    <MenuItem value='medium' primaryText="Medium"/>
                    <MenuItem value='high' primaryText="High"/>
                </SelectField>
                <SelectField
                    fullWidth
                    floatingLabelText="Language"
                    value={this.state.language}
                    onChange={(event, index, value) => this.setState({language: value})}
                >
                    <MenuItem value='en' primaryText="English"/>
                    <MenuItem value='ru' primaryText="Русский" disabled />
                </SelectField>
                <FlatButton
                    onClick={this.onSubmit}
                    label="SING IN"
                    fullWidth={true} />
            </div>
            <ToastContainer autoClose={5000} />
        </div>
        );
    }
}

