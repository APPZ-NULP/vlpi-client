import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Switch, Router} from 'react-router';

import HomePage from "./components/HomePage/HomePage";
import TaskListPage from "./components/TaskListPage/TaskListPage";
import GoJsDemo from "./components/GoJsDemo/GoJsDemo";
import Header from "./components/Header/Header";
import history from "./history"
import TaskCreatePage from "./components/TaskCreatePage/TaskCreatePage"
import SignIn from './components/LoginPage/LoginPage';
import TaskStatistics from './components/TaskStatistics/TaskStatistics';

class Routers extends Component {

    render() {
        return(
            <Router history={history}>
                <Header />
                <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/task-list' exact component={TaskListPage} />
                    <Route path='/gojs-demo' exact component={GoJsDemo} />
                    <Route path='/task-create' exact component={TaskCreatePage} />
                    <Route path='/login' exact component={SignIn} />
                    <Route path='/task/:id/statistics' exact component={TaskStatistics}/>
                </Switch>
            </Router>
        )
    }
}

export default Routers;