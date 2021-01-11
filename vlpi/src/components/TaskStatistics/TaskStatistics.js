import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core/styles";
import axios from 'axios';

const taskDifficulty = {
	EASY: "Easy",
	MEDIUM: "Medium",
	HARD: "Hard"
}

const taskType = {
	CLASS: "Class",
	USE_CASE: "Use Case",
}

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: "center",
        '& > *': {
            margin: theme.spacing(4),
            width: "50vw", 
        },
    },

    paper: {
        padding: theme.spacing(4),
    }
})

class TaskStatistics extends Component {

    state = {
        description: "",
        difficulty: "",
        max_mark: "",
        module: "",
        pk: 0,
        title: "",
        type: "",
        status: "",
        mark: "",
        user: "",
        passing_date: ""
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        axios.get(
            `http://127.0.0.1:8000/api/tasks/${params.id}`
        ).then (response => {
            let task = response.data
            axios.get(
                `http://127.0.0.1:8000/api/modules/${task.module}`
            ).then(response => {
                let module = response.data
                let user = JSON.parse(localStorage.getItem('user'));
                let taskProgress = ""
                let mark = "Not rated"
                let passingDate = "Not yet passed"
                
				if (task.users_progress.length === 0) {
					taskProgress = "To Do"
				}
				else {
                    taskProgress = "To Do"
					for (var userProgress of task.users_progress) {
                        if (userProgress.user === user.pk)
                        {
                            taskProgress = "In Progress"
                            if (userProgress.is_completed) {
                                taskProgress = "Done"
                                mark = userProgress.mark
                                let passingDateTimeStamp = new Date(userProgress.created_at)
                                passingDate = `${passingDateTimeStamp.getDate()}/${passingDateTimeStamp.getMonth() + 1}/${passingDateTimeStamp.getFullYear()}`
                                break;
                            }
                        }
					}
                }

                this.setState({
                    description: task.description,
                    difficulty: task.difficulty,
                    max_mark: task.max_mark,
                    module: module.name,
                    pk: task.pk,
                    title: task.title,
                    type: task.type,
                    status: taskProgress,
                    mark: mark,
                    user: user.first_name + " " + user.last_name,
                    passing_date: passingDate
                })
            })
            
        })
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <Paper className={classes.paper} elevation={3}>
                <Typography variant="h4" gutterBottom style={{textAlign: "center"}}>
                    {this.state.title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Description: </strong> {this.state.description}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Difficulty: </strong> {taskDifficulty[this.state.difficulty]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Module: </strong> {this.state.module}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Type: </strong> {taskType[this.state.type]}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Max Mark: </strong> {this.state.max_mark}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Status: </strong> {this.state.status}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>User: </strong> {this.state.user}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Mark: </strong> {this.state.mark}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    <strong>Date of passing: </strong> {this.state.passing_date}
                </Typography>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(TaskStatistics)