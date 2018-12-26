import React, {Component} from 'react';

//Material
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import './auth.css';
import {toast} from 'react-toastify';
import * as actionAuth from "../../action/actionAuth"
import logo from "../../img/logo.png";
import {loading} from "../../action/loading";


const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export class Reg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            ownerEmail: "",
            ownerPassword: "",
            orderValue: "100",
            imageQuality: "low",
            language: 'en',
        };
    };

    onSubmit = async (e) => {
        e.preventDefault();
        loading(true);
        let company = this.state;
        try {
            if (company.name.length < 3) throw new Error('Company name to small');
            if (company.description.length < 3) throw new Error('Company description to small');
            if (company.ownerPassword.length < 6) throw new Error('Password to small');
            if (!EmailRegex.test(company.ownerEmail)) throw new Error('Email is invalid');
            company.orderValue = company.orderValue.replace(',', '.');
            if (isNaN(company.orderValue)) throw new Error('Report value is invalid. Must be a number');
            await actionAuth.Reg({
                name: company.name,
                ownerEmail: company.ownerEmail,
                ownerPassword: company.ownerPassword,
                description: company.description,
                logo: "noLogo",
                imageQuality: company.imageQuality,
                orderValue: company.orderValue,
                active: true,
                language: company.language
            });
            this.props.history.push('/')
        } catch (e) {
            loading(false);
            toast.error(e.message || e)
        }
    };


    onChange = (field, data) => {
        this.setState({[field]: data})
    };

    render() {
        return (
            <div className="container">
                <div className="form">
                    <div className='title'>
                        <img alt="logo" src={logo} height='30' width="30"/>
                        <p>Bon Appetit</p>
                    </div>
                    <TextField
                        fullWidth
                        hintText="Your Company name"
                        floatingLabelText="Company name"
                        onChange={(e) => this.onChange('name', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        hintText="Enter A few words about your company"
                        floatingLabelText="Company description"
                        onChange={(e) => this.onChange('description', e.target.value)}
                        multiLine
                        rows={2}
                    />
                    <TextField
                        fullWidth
                        hintText="Enter your Email"
                        floatingLabelText="Email"
                        onChange={(e) => this.onChange('ownerEmail', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        hintText="Enter your password"
                        floatingLabelText="Password"
                        type="password"
                        onChange={(e) => this.onChange('ownerPassword', e.target.value)}
                    />
                    <TextField
                        fullWidth
                        hintText="Yours value per report"
                        floatingLabelText="Report value"
                        type="number"
                        onChange={(e) => this.onChange('orderValue', e.target.value)}
                    />
                    <SelectField
                        fullWidth
                        floatingLabelText="Photo resolution"
                        value={this.state.imageQuality}
                        onChange={(event, index, value) => this.onChange('imageQuality', value)}
                    >
                        <MenuItem value='low' primaryText="Low"/>
                        <MenuItem value='medium' primaryText="Medium"/>
                        <MenuItem value='high' primaryText="High"/>
                    </SelectField>
                    <SelectField
                        fullWidth
                        floatingLabelText="Language"
                        value={this.state.language}
                        onChange={(event, index, value) => this.onChange('language', value)}
                    >
                        <MenuItem value='en' primaryText="English"/>
                        <MenuItem value='ru' primaryText="Русский" disabled/>
                    </SelectField>
                    <FlatButton
                        onClick={this.onSubmit}
                        label="SING IN"
                        fullWidth={true}/>
                </div>
            </div>
        );
    }
}

