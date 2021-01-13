import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Button } from '@material-ui/core';
import history from '../../history'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '7vh'
    },
    title: {
        marginLeft: theme.spacing(5),
        flexGrow: 1,
        cursor: "pointer"
    },
    accountName: {
        fontSize: 15
    },
    accountGroup: {
        textAlign: 'center'
    },
    accountIcon: {
        padding: 3
    },
})

class Header extends Component {

    state = {
        isAuth: false,
        user: {},
        anchorEl: null,
        open: false
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        let isAuth = false
        if (user !== null) {
            isAuth = true
        }
        else {
            history.push("/login")
        }

        this.setState({isAuth: isAuth, user: user})
    }

    handleClose = () => {
        this.setState({anchorEl: null})
        console.log("close")
    }

    handleClick = (event) => {
        this.setState({anchorEl: event.currentTarget, open: !this.state.open})
        console.log("click")
    }

    handleLogout = () => {
        localStorage.removeItem("user")
        this.setState({
            isAuth: false,
            user: null,
        })

        history.push("/login")
    }

    handleProfile = () => {
        history.push("/profile")
    }

    handleLogin = (classes) => {
        if(!this.state.isAuth) {
            return (
                <Button onClick={() => history.push("/login")} color="secondary">Login</Button>
            )
        }
        else {
            return(
                <div aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                    <IconButton
                                className={classes.accountIcon}
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle fontSize="large"/>
                    </IconButton>
                    <Typography variant="h1" className={classes.accountName}>
                        {this.state.user.first_name + " " + this.state.user.last_name}
                    </Typography>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            )
        }
    }

    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title} onClick={() => history.push("/")}>
                            VLPI
                        </Typography>
                        <div className={classes.accountGroup}>
                            {this.handleLogin(classes)}
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Header)
