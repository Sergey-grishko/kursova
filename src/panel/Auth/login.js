import React, {Component} from 'react';
import './auth.css';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify';
import {loading} from "../../action/loading";
import * as actionAuth from "../../action/actionAuth"
import logo from '../../img/logo.png'


export class Sign extends Component {
    state = {
        email: "123@gmail.com",
        password: "1234567",
    };

    componentDidMount() {
        if (localStorage.getItem('token') !== null) {
            this.props.history.push('panel/dashboard')
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        loading(true);
        let res = await actionAuth.login({
            ownerEmail: this.state.email,
            ownerPassword: this.state.password,
        });
        if (res.error) {
            toast.error(res.message);
            loading(false);
            return
        }
        loading(false);
        this.props.history.push('/panel/dashboard')
    };

    onChange = (field, data) => {
        this.setState({[field]: data})
    };

    render() {
        return (
            <div className="container">
                <form className="form" onSubmit={this.onSubmit}>
                    <div className='title'>
                        <img alt="logo" src={logo} height='30' width="30"/>
                        <p>Bon Appetit</p>
                    </div>
                    <TextField
                        hintText="Enter your Email"
                        floatingLabelText="Email"
                        fullWidth
                        onChange={(e) => this.onChange('email', e.target.value)}
                    />
                    <TextField
                        hintText="Enter your password"
                        floatingLabelText="Password"
                        type="password"
                        fullWidth
                        onChange={(e) => this.onChange('password', e.target.value)}
                    />
                    <FlatButton
                        label="SING IN"
                        type="submit"
                        fullWidth={true}/>
                    <h5 className="fott_text">You don't have an account?<a>
                        <Link to="/registration">Sing
                            up</Link></a>&#160; your company</h5>
                </form>
            </div>
        );
    }
}
