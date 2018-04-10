import React, {Component} from 'react';
import './auth.css';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify';
import ReactLoading from 'react-loading';
import * as actionAuth from "../../action/actionAuth"



export class Sign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoading: false
        };
        this.onSubmit = this.onSubmit.bind(this);
    };

    componentDidMount() {
        if (localStorage.getItem('token') !== null) {
            this.props.history.push('panel/dashboard')
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({isLoading: true});
        actionAuth.login(this.state.email, this.state.password)
            .then((response) => response.json())
            .then(async(res) => {
                    this.setState({isLoading: false});
                    if (res.error) {
                        toast.error(res.message);
                    } else {
                        console.log(localStorage.getItem("token"));
                       await localStorage.setItem("token", res.message.token);
                        this.props.history.push('/panel/dashboard')
                    }
            })
    }

    render() {
        return (
            <div className="container" style={{height: "100vh"}}>

                {this.state.isLoading ? (
                    <div className="Loading_div">
                    <ReactLoading className="Loading" type="spinningBubbles" color="#00bcd4" height='200px' width='200px'/>
                    </div>) : null}
                <form className="form" onSubmit={this.onSubmit} style={this.state.isLoading ? {opacity: 0.4} : null}>
                    <div className='title'>
                        <img alt="logo" src='http://bonpanel.web.bidon-tech.com:65050/static/media/logo.5caa6c54.png' height='30'
                             width="30"/>
                        <p>Bon Appetit</p>
                    </div>
                    <TextField
                        hintText="Enter your Email"
                        floatingLabelText="Email"
                        fullWidth
                        value={this.state.email}
                        onChange={e => this.setState({email: e.target.value})}
                        multiLine={false}
                    />
                    <TextField
                        hintText="Enter your password"
                        floatingLabelText="Password"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={e => this.setState({password: e.target.value})}
                        multiLine={false}
                    />
                    <FlatButton
                        label="SING IN"
                        type="submit"
                        fullWidth={true}/>
                    <h5 className="fott_text">You don't have an account?<a><Link to="/registration">Sing
                        up</Link></a>&#160; your company</h5>
                </form>
                <ToastContainer autoClose={5000}/>
            </div>
        );
    }
}
