import React, { Component } from 'react';
import '../../App.css';
import {AreaChart,Area,XAxis,YAxis,Tooltip} from 'recharts';
import LinearProgress from 'material-ui/LinearProgress';
import {NavLink, withRouter} from 'react-router-dom';
import * as DasInfo from '../../action/actionDashboard';
import * as userInfo from '../../action/actionUsers';
import Avatar from 'material-ui/Avatar';
import dateFormat from 'dateformat'
import {List, ListItem} from 'material-ui/List'
import {connect} from "react-redux";
import ReactLoading from 'react-loading';
import {host} from '../../Host'


const data = [
    {name: '12.03.18', paid: 20, total: 28},
    {name: '13.03.18', paid: 18, total: 21},
    {name: '14.03.18', paid: 25, total: 25},
    {name: '15.03.18', paid: 10, total: 16},
    {name: '16.03.18', paid: 14, total: 15},
    {name: '17.03.18', paid: 0, total: 3},
    {name: '18.03.18', paid: 0, total: 0},
];


class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading: false
        };
        this.userName =this.userName.bind(this);
    };

   async componentDidMount(){
      // let  toke =  await localStorage.getItem("token");
      //   toke == null ? this.props.history.push('/') : null ;
      await  this.setState({isLoading: true});
      await  DasInfo.infoDashboard();
      await  userInfo.infoUsers();
      await  this.setState({isLoading:false})
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

    reportOnClick(id) {
        this.props.history.push('/panel/reports/',id)
    }

    render() {
        let report =this.props.store.infoDashboard.reportCount === 0 ? (
            <div className="R_empty">
                Reports list is empty
            </div>
            ): this.props.store.infoDashboard.lastFiveReports.map((value, index) =>{
            return(
                <ListItem
                    key={index}
                    primaryText={this.userName(value.user_id) + " at "  + dateFormat(value.date, "dd-mm-yyyy HH:MM")}
                    rightIcon={<i className="material-icons">inbox</i>}
                    leftAvatar={<Avatar src={host + `images/${value.image}`} />}
                    onClick={this.reportOnClick.bind(this, value._id)}
                >
                </ListItem>
            )
        });
        console.log(report);
        let totalSpace = this.props.store.infoCompany.totalSpace;
        let useSpace = this.props.store.infoCompany.useSpace;
        let perce = useSpace*100/totalSpace;
        let userCount = this.props.store.infoDashboard.userCount;
        let reportCount = this.props.store.infoDashboard.reportCount;
        return (
            <div>{this.state.isLoading ? (
                <div className="Loading_div">
                    <ReactLoading className="Loading" type="spinningBubbles" color="#00bcd4" height='200px' width='200px'/>
                </div>) : null}
            <div className="content" style={this.state.isLoading ? {opacity: 0.4} : null}>
                <div className="dashboard_1">
                    <p className="content_title">Overview</p>
                    <AreaChart width={750} height={160} data={data}
                               margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <XAxis dataKey="name" stroke="white"/>
                        <YAxis stroke="white"/>
                        <Tooltip/>
                        <Area type='monotone' dataKey='total' stroke='#11111' fill='#11111' fillOpacity={1}/>
                        <Area type='monotone' dataKey='paid' stroke='none' fill='#00bcd4' fillOpacity={0.5}/>
                       </AreaChart>
                </div>
                <div className="dashboard_2">
                    <div className="dashboard_2_1">
                        <p className="content_title">Disk Space</p>
                        <div className="date_s">
                            <LinearProgress mode="determinate"  value={useSpace} max={totalSpace}  />
                            <span>
                                <h4>{useSpace.toFixed(1)}Mb</h4>
                                <h4>{totalSpace}Mb</h4>
                            </span>
                            <div>Currently you use {useSpace.toFixed(1)}Mb ({perce.toFixed(1)}%) of {totalSpace}Mb.</div>
                        </div>

                    </div>
                    <div className="dashboard_2_2">
                        <p className="content_title">Users</p>
                        <span>{userCount}</span>
                        <NavLink to="/panel/users">Go to users list</NavLink>
                    </div>
                    <div className="dashboard_2_3">
                        <p className="content_title">Reports</p>
                        <span>{reportCount}</span>
                        <NavLink to="/panel/reports">Go to reports list</NavLink>
                    </div>
                </div>
                <div className="dashboard_3">
                    <div className="fiveReport">
                        <p className="content_title">Last 5 reports</p>
                        <List>{report}</List>
                    </div>
                    <div className="Upgrade">
                        <p className="content_title">Upgrade your disk space</p>
                        <h4><i className="material-icons">info_outline</i>Get&nbsp;<b>10Gb</b>&nbsp;disk space for only&nbsp;<b>$1.99</b><br />
                        Use&nbsp;<a href="">this form</a>&nbsp;to contact us</h4>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default connect(store => ({store: store,users: store.infoUsers}))(withRouter(Dashboard))
