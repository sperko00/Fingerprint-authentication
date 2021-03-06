import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Header extends Component {
    constructor(props)
    {
        super(props);
        this.signOut = this.signOut.bind(this);
    }
    signOut(){
        this.props.signOut();
        this.props.history.push('/');
    }
    render() {
        return (
           <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">Fingerprint Authentication</Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>
                    
                    <ul className="navbar-nav ml-auto">
                        { 
                            !this.props.isAuthenticated ? 
                            [
                            <li key={0} className="nav-item">
                                <Link className="nav-link" to="/signup">Sign Up</Link>
                            </li>,
                            <li key={1} className="nav-item">
                                <Link className="nav-link" to="/signin">Sign In</Link>
                            </li>
                            ] 
                            :
                            <li className="nav-item">
                                <Link className="nav-link" to="/signout" onClick = {this.signOut}>Sign Out</Link>
                            </li>
                        }
                    </ul>
                </div>
           </nav>
        );
    }
}
function mapStateToProps(state){
    return {
        isAuthenticated : state.auth.isAuthenticated,
    }
}
export default connect(mapStateToProps,actions)(Header);


