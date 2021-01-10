import React, {Component} from 'react';
import {withStyles} from "@material-ui/core/styles";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '7vh'
    },
    title: {
        marginLeft: theme.spacing(5),
        flexGrow: 1,
    },
    accountName: {
        fontSize: 15
    },
    accountGroup: {
        textAlign: 'center'
    },
    accountIcon: {
        padding: 3
    }
})

class Header extends Component {

    render() {
        const {classes} = this.props

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            VLPI
                        </Typography>
                        <div className={classes.accountGroup}>
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
                                Oleg Dmytrash
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Header)
