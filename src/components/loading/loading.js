import React, {Component} from 'react'
import {connect} from 'react-redux';
import ReactLoading from "react-loading";
import './loading.css'

class Loader extends Component {
    render() {
        return (
            this.props.loading.enable &&
            <div className="loading">
                <ReactLoading type="spinningBubbles" color="#00bcd4" height='200px' width='200px'/>
            </div>
        )
    }
}

export default connect(
    state => ({
        loading: state.loading
    })
)(Loader);

