import React, { Component } from 'react';
import '../../App.css';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import * as infoReports from "../../action/actionReports";
import * as infoUsers from "../../action/actionUsers";
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import dateFormat from 'dateformat';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Filter from "./filter"
import Snackbar from 'material-ui/Snackbar';
import {toast} from "react-toastify";
import ReactLoading from 'react-loading';
import {host} from '../../Host.js'

const defaultState={
    open:false,
    name:"",
    _id:"",
    rows:[],
    date:"",
    image: '',
    createdAt: '',
    category_id:'',
    comment:'',
    approved:'',
    isLoading: false

};

const style={
    textcolor:{
        color:"white"
    },
    titlestyle:{
        background: "#333",
    }
};
class Reports extends Component {
    constructor(props){
        super(props);
        this.state = {
            ...defaultState
         };
    };

    async componentDidMount(){
        // let  toke =  await localStorage.getItem("token");
        // toke == null ? this.props.history.push('/'): null;
        await  this.setState({isLoading: true});
        await infoReports.infoReports().then(() => {
            this.setState({isLoading:false})
        });
        await infoUsers.infoUsers();
        if (this.props.location.state !== undefined) {
            let id = this.props.location.state;
            this.handleOpen(id)
        }
    }


    handleOpen = (id, e = null) => {
        if (e) e.stopPropagation();
        let report = this.props.reports.find(value => value._id === id);
        this.setState({...report, open: true, rows: [], name: this.userName(report.user_id)})
    };
    handleClose = () => {
        this.setState({open: false});
        this.props.history.push('/panel/reports/')
    };

    OnPaid(_id, category_id, comment,approved ){
        approved = !approved;
        infoReports.EditReport(_id, category_id, comment, approved );
        this.setState({approved: true});
        toast.success("Report is paid");
    }


    userName(user_id) {
        let user = this.props.users.find(value => {
            return value._id === user_id
        });
        if (user === undefined) {
            return null;
        } else {
            return user.fullName;
        }
    }

    SelectedRow(selected){
        if(selected === 'all'){
            this.setState({rows:this.props.reports.map(value => value._id)})
        }else if(selected === 'none' || selected.length === 0){
            this.setState({rows:[]})
        }else {
            let reports = this.props.reports.filter((value, index) => selected.indexOf(index) > -1);
            console.log(reports);
            this.setState({rows: reports.map(value => value._id)})
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
                label="Paid"
                primary={true}
                disabled={this.state.approved}
                keyboardFocused={true}
                onClick={() =>this.OnPaid(this.state._id, this.state.category_id, this.state.comment, this.state.approved)}
            />,
        ];
        let text_sneck = this.state.rows.length + " reports where selected for the amount of " + this.state.rows.length * this.props.store.infoCompany.orderValue ;
        let aList = this.props.filter === undefined  ? this.props.reports : this.props.filter;
        const reports = aList.map((value, index) => {
            return (
                <TableRow key={index} selected={this.state.rows.indexOf(value._id) > -1} selectable={!value.approved}>
                    <TableRowColumn  style={{width:110}}>{dateFormat(value.date, "dd-mm-yyyy HH:MM")}</TableRowColumn>
                    <TableRowColumn>{this.userName(value.user_id)}</TableRowColumn>
                    <TableRowColumn>{value.approved ? "Paid" :  "Not paid"}</TableRowColumn>
                    <TableRowColumn>
                        <IconButton
                            onClick={this.handleOpen.bind(this, value._id)}
                            children={<i className="material-icons">details</i>}/>
                    </TableRowColumn>
                </TableRow>
            );
        });
        let sum = reports.length * this.props.store.infoCompany.orderValue;
        return (
            <div> {this.state.isLoading ? (
                <div className="Loading_div">
                    <ReactLoading className="Loading" type="spinningBubbles" color="#00bcd4" height='200px' width='200px'/>
                </div>) : null}
            <div className="content" style={this.state.isLoading ? {opacity: 0.4} : null}>
                <div className="reports">
                    {reports.length === 0 ? (
                            <h3 className="report_empty"><i className="material-icons">info_outline</i>Report list is empty</h3>
                        ):(
                        <div className="reports_content">
                            <div className="reports_list">
                                <Snackbar
                                    bodyStyle={style.titlestyle}
                                    contentStyle ={style.textcolor}
                                    open={this.state.rows.length > 0}
                                    message={text_sneck}
                                    action="Paid"
                                    onActionClick={() =>this.OnPaid(this.state.rows, this.state.category_id, this.state.comment, false)}
                                />
                                {console.log(this.state.rows)}
                                <Dialog
                                    title="Report details"
                                    actions={actions}
                                    modal={false}
                                    open={this.state.open}
                                    onRequestClose={this.handleClose}
                                >
                                   <div className="details">
                                       <a href={host+`images/${this.state.image}`} className="img_block">
                                           <img src={ host +`images/${this.state.image}`} alt={this.state.name} className="img_reports"/>
                                       </a>
                                       <List className="list_block" >
                                           <Subheader inset={true} >Information</Subheader>
                                           <ListItem
                                               style={style.textcolor}
                                               leftIcon={<i className="material-icons">person</i> }
                                               primaryText={this.state.name}
                                               secondaryText="Name"
                                              />
                                           <ListItem
                                               style={style.textcolor}
                                               leftIcon={<i className="material-icons">create</i>}
                                               primaryText={dateFormat(this.state.date, "dd-mm-yyyy HH:MM")}
                                               secondaryText="Was created at"
                                           />
                                           <ListItem
                                               style={style.textcolor}
                                               leftIcon={<i className="material-icons">file_upload</i>}
                                               primaryText={dateFormat(this.state.createdAt, "dd-mm-yyyy HH:MM")}
                                               secondaryText="Was loaded at"
                                           />
                                           <ListItem
                                               style={style.textcolor}
                                               leftIcon={<i className="material-icons">attach_money</i>}
                                               primaryText={this.state.approved? "Paid": "Not Paid"}
                                               secondaryText="Status of report"
                                           />
                                       </List>
                                   </div>
                                </Dialog>
                                <div className="users_body">
                                <Table multiSelectable={true} style={{width:550}} onRowSelection={this.SelectedRow.bind(this)}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHeaderColumn style={{width:110}}>Date</TableHeaderColumn>
                                            <TableHeaderColumn>Users</TableHeaderColumn>
                                            <TableHeaderColumn>Status</TableHeaderColumn>
                                            <TableHeaderColumn >Details</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody deselectOnClickaway={false}>
                                        {reports}
                                    </TableBody>
                                </Table>
                                </div>
                                <h3>Summary reports price is {sum}</h3>
                            </div>
                        </div>
                    )}
                    <div className="reports_filter">
                        <Filter/>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default connect(store => ({store: store, reports: store.infoReports, users:store.infoUsers, filter:store.list }))(withRouter(Reports))