import React, {Component} from 'react';
import {Route, Switch, Router} from 'react-router';

import HomePage from "./components/HomePage/HomePage";
import TaskListPage from "./components/TaskListPage/TaskListPage";
import GoJsDemo from "./components/GoJsDemo/GoJsDemo";
import Header from "./components/Header/Header";
import history from "./history"
import TaskCreatePage from "./components/TaskCreatePage/TaskCreatePage"
import SignIn from './components/LoginPage/LoginPage';
import TaskStatistics from './components/TaskStatistics/TaskStatistics';
import UserProfilePage from './components/UserProfilePage/UserProfilePage';
import SignUp from './components/SignUp/SignUp';
import TaskCompletePage from './components/TaskCompletePage/TaskCompletePage';

class Routers extends Component {

    render() {
        return(
            <Router history={history}>
                <Header />
                <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/tasks' exact component={TaskListPage} />
                    <Route path='/gojs-demo' exact component={GoJsDemo} />
                    <Route path='/task-create' exact component={TaskCreatePage} />
                    <Route path='/tasks/:id/complete' exact component={TaskCompletePage} />
                    <Route path='/login' exact component={SignIn} />
                    <Route path='/sign-up' exact component={SignUp}/>
                    <Route path='/tasks/:id/statistics' exact component={TaskStatistics}/>
                    <Route path='/profile' exact component={UserProfilePage}/>
                </Switch>
            </Router>
        )
    }
}

export default Routers;