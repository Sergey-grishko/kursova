import React, {Component} from 'react';
import '../../App.css';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import * as UserInfo from "../../action/actionUsers";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import Toggle from 'material-ui/Toggle';
import {withRouter} from "react-router-dom";
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import ReactLoading from 'react-loading';


const defaultValue = {
    open: false,
    search: "",
    fullName: "",
    edit: false,
    email: "",
    password: "",
    confirmPassword: "",
    _id: null,
    active: true,
    isLoading: false
};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultValue
        };
        this.onSubmit = this.onSubmit.bind(this)
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({...defaultValue});
    };

    editOpen = (value) => {
        value.confirmPassword = "";
        value.password = "";
        this.setState({...value, edit: true, open: true})
    };

    async componentDidMount() {
        // let  toke =  await localStorage.getItem("token");
        // toke == null ? this.props.history.push('/'): null;
        await this.setState({isLoading: true});
        await UserInfo.infoUsers();
        await this.setState({isLoading: false})
    }

    onSubmit = async () => {
        try {
            if (this.state.fullName.length <= 1) throw new Error('FullName must be at least 2 characters');
            if (!emailRegex.test(this.state.email)) throw new Error('Email is invalid');
            if (this.state.password.length >= 1 && this.state.password.length < 6) throw new Error('Password must be at least 6 characters');
            if (this.state.password !== this.state.confirmPassword) {
                throw new Error('Passwords is invalid')
            } else if (this.state.password.length >= 1 && this.state.password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            //------------
            if (this.state.edit) {
                await UserInfo.EditUsers({
                    _id: this.state._id,
                    fullName: this.state.fullName,
                    email: this.state.email,
                    password: this.state.password,
                    active: this.state.active,
                })
                this.setState(defaultValue)
                toast.success('User has been changes')
            } else {
                let res = await UserInfo.addUser({
                    fullName: this.state.fullName,
                    email: this.state.email,
                    password: this.state.password,
                    active: true,
                });
                if (res.error) {
                    toast.error(res.message);
                } else {
                    toast.success('User has been creating');
                    UserInfo.infoUsers();
                    this.setState(defaultValue);
                }
            }
        }
        catch (e) {
            console.log("error");
            toast.error(e.message);
        }
    }

    OnToggled(value) {
        value.active = !value.active;
        UserInfo.EditUsers({
            _id: value._id,
            fullName: value.fullName,
            email: value.email,
            password: value.password,
            active: value.active,
        });
        toast.success("Status changed");
    }

    Search() {
        let Slist = this.props.users.filter((val) => {
            if (val.fullName.indexOf(this.state.search) !== -1 || val.email.indexOf(this.state.search) !== -1) {
                return true
            }
            // console.log(val.fullName.indexOf(this.state.search) !== -1);
            // return val.fullName.indexOf(this.state.search) !== -1
        });
        console.log(Slist)
        return Slist
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="Add"
                primary={true}
                keyboardFocused={true}
                onClick={this.onSubmit}
            />,
        ];
        let searchUser = this.state.search === 0 ? this.props.users : this.Search();
        const users = searchUser.map((value, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn>{value.fullName}</TableRowColumn>
                    <TableRowColumn>{value.email}</TableRowColumn>
                    <TableRowColumn>
                        <Toggle
                            toggled={value.active}
                            onToggle={() => this.OnToggled(value)}/>
                    </TableRowColumn>
                    <TableRowColumn>
                        <IconButton
                            children={<i className="material-icons">autorenew</i>}
                            onClick={() => this.editOpen(value)}/>
                    </TableRowColumn>
                </TableRow>
            );
        });
        return (
            <div>
                {this.state.isLoading ? (
                    <div className="Loading_div">
                        <ReactLoading className="Loading" type="spinningBubbles" color="#00bcd4" height='200px'
                                      width='200px'/>
                    </div>) : null}
                <div className="content" style={this.state.isLoading ? {opacity: 0.4} : null}>
                    <div>
                        <div className="users_header">
                            <RaisedButton className="button_users" onClick={this.handleOpen} primary={true}
                                          label="ADD NEW USER" icon={<i className="material-icons">person_add</i>}/>
                            <TextField
                                className="search"
                                hintText="Search"
                                value={this.state.search}
                                onChange={(e) => this.setState({search: e.target.value})}
                            />
                            <Dialog
                                title={this.state.edit ? "Edit users" : "Add users"}
                                actions={actions}
                                contentStyle={{width: 500}}
                                modal={false}
                                open={this.state.open}
                                onRequestClose={this.handleClose}
                                autoScrollBodyContent={true}
                            >
                                <TextField
                                    hintText="Enter user full name"
                                    floatingLabelText="Full name"
                                    fullWidth
                                    value={this.state.fullName}
                                    onChange={e => this.setState({fullName: e.target.value})}
                                    multiLine={false}
                                />
                                <TextField
                                    hintText="Enter user email"
                                    floatingLabelText="Email"
                                    fullWidth
                                    value={this.state.email}
                                    onChange={e => this.setState({email: e.target.value})}
                                    multiLine={false}
                                />
                                <TextField
                                    hintText="Enter Password"
                                    floatingLabelText="Password"
                                    fullWidth
                                    type="password"
                                    value={this.state.password}
                                    onChange={e => this.setState({password: e.target.value})}
                                    multiLine={false}
                                />
                                <TextField
                                    hintText="Enter Password confirm"
                                    floatingLabelText="Password confirm"
                                    fullWidth
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={e => this.setState({confirmPassword: e.target.value})}
                                    multiLine={false}
                                />
                            </Dialog>
                        </div>
                        <div className="users_body">
                            {searchUser.length === 0 ? (
                                <h3><i className="material-icons">info_outline</i>Users list is empty</h3>
                            ) : (
                                <div>
                                    <div className="table">
                                        <Table selectable={false}>
                                            <TableHeader
                                                displaySelectAll={false}
                                                adjustForCheckbox={false}>
                                                <TableRow>
                                                    <TableHeaderColumn>Full name</TableHeaderColumn>
                                                    <TableHeaderColumn>Email</TableHeaderColumn>
                                                    <TableHeaderColumn>Status</TableHeaderColumn>
                                                    <TableHeaderColumn>Action</TableHeaderColumn>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody displayRowCheckbox={false}>
                                                {users}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <h4>All {searchUser.length} users are list</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(store => ({store: store, users: store.infoUsers}))(withRouter(User))