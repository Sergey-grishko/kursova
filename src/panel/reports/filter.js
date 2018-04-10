import React, { Component } from 'react';
import '../../App.css';
import {connect} from "react-redux";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider'
import * as ReportFilter from "../../action/actionFilter";
import XlsExport from "xlsexport"


const style={
    customWidth: {
    width: 180,
    },
};

class Filter extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:'all',
            // paid:'all',
            dateFrom:{},
        };
    };

    async componentDidMount(){
        await ReportFilter.ReportFilter(this.state.reports)
    }

    searchReports() {
        if (this.state.id === "all") {
            ReportFilter.ReportFilter(this.props.reports);
        } else {
            let rList = this.props.reports.filter((val) => {
                return val.user_id === this.state.id;
            });
            ReportFilter.ReportFilter(rList);
        }
    }

    // PaidReports(){
    //     if(this.state.paid === 'all'){
    //         ReportFilter(this.props.reports)
    //     }else {
    //
    //     }
    // }

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

    userEmail(user_id) {
        let user = this.props.users.find(value => {
            return value._id === user_id
        });
        if (user === undefined) {
            return null;
        } else {
            return user.email;
        }
    }

    onExcel(typeFormat) {
        let allList = this.props.reportFilter === undefined ? this.props.reports : this.props.reportFilter;
        let reports = [["Name", "Email", "ID", "Approved"]];

        for (let i = 0; i < allList.length; i++) {
            let name = allList.map(value => this.userName(value.user_id));
            let email = allList.map(value => this.userEmail(value.user_id));
            let reportId = allList.map(value => value._id);
            let reportApproved = allList.map(value => value.approved);
            reports.push([name[i], email[i], reportId[i], reportApproved[i]])
        }
        let xls = new XlsExport(reports, "Reports");

        if (typeFormat === "xls") {
            xls.exportToXLS('reports.xls');
        } else if (typeFormat === "csv") {
            xls.exportToCSV('reports.csv');
        }

    }


        render() {
        const users = this.props.users.map((value, index) => {
            return(
            <MenuItem value={value._id} key={index} primaryText={value.fullName} />
            )
        });
        return (
            <div className="filter_content">
                <p><i className="material-icons">filter_list</i>Filter</p>
                <SelectField
                    floatingLabelText="Users"
                    value={this.state.id}
                    onChange={(event, index, value) => this.setState({id:value})}
                    style={style.customWidth}>
                    <MenuItem value={'all'} primaryText="All Users" />
                    {users}
                </SelectField>
                {/*<SelectField*/}
                    {/*floatingLabelText="Paid"*/}
                    {/*value={this.state.paid}*/}
                    {/*onChange={(event, index, value) => this.setState({paid:value})}*/}
                    {/*style={style.customWidth}>*/}
                    {/*<MenuItem value={'all'} primaryText="All" />*/}
                    {/*<MenuItem value={'paid'} primaryText="Paid"/>*/}
                    {/*<MenuItem value={'nopaid'} primaryText="Not Paid"/>*/}
                {/*</SelectField>*/}
                <DatePicker
                    hintText="Date from"
                    floatingLabelText="Date from"
                    mode="landscape"
                    onChange={(event, index, value) => this.setState({dateFrom: value})}
                    fullWidth
                />
                <DatePicker
                    hintText="Date to"
                    floatingLabelText="Date to"
                    mode="landscape"
                    fullWidth
                />
                {console.log("date", this.state.dateFrom)}
                <div className="filter_button">
                    <RaisedButton label="Refresh" primary={true} onClick={() => this.searchReports()}  fullWidth />
                    <FlatButton label="Clear" onClick={() => this.setState({id:"all"}, () => this.searchReports()) }  fullWidth />

                    <Divider className="line"/>

                    <FlatButton label="Export to xls" onClick={() => this.onExcel("xls")} icon={<i className="material-icons">file_download</i>} fullWidth />
                    <FlatButton label="Export to csv" onClick={() => this.onExcel("csv")} icon={<i className="material-icons">file_download</i>} fullWidth />
                </div>
            </div>
        );
    }
}

export default connect(store => ({store: store, users: store.infoUsers, reports: store.infoReports, reportFilter: store.filter}))(Filter)