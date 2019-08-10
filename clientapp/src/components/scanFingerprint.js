import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
var timeout;

class ScanFingerprint extends Component {
    constructor(props)
    {
        super(props);
        this.state = {email : ''};
    }
    componentWillMount(){
        this.setState({email : this.props.email})
    }
    async componentDidMount(){
        
        timeout = setInterval(() => {
            if(!this.props.isAuthenticated)
                this.props.login(this.state.email);
            if(this.props.isAuthenticated)
                this.props.history.push('/dashboard');
            }
        ,1000 )
    }
    componentWillUnmount(){
        clearInterval(timeout);
    }
    render() {
        return (
            <div>
                Please scan your fingerprint on device associated with this account.
            </div>
        );
    }

}
function mapStateToProps(state){
    return{
        email : state.auth.email,
        isAuthenticated : state.auth.isAuthenticated,
        token : state.auth.token,
    }
};
export default connect(mapStateToProps,actions)(ScanFingerprint);