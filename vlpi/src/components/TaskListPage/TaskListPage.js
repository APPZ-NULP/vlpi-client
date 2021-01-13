import React, {Component} from 'react'
import {DataGrid} from '@material-ui/data-grid';
import DifficultCell from "./DifficultyCell";
import axios from "axios";
import { Button } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DeleteIcon from '@material-ui/icons/Delete';
import history from "../../history";

const taskDifficulty = {
	EASY: "Easy",
	MEDIUM: "Medium",
	HARD: "Hard"
}

const taskType = {
	CLASS: "Class",
    USE_CASE: "Use Case",
    SEQUENCE: "Sequence",
    COMMUNICATION: "Communication",
    ACTIVITY: "Activity",
    OBJECT: "Object",
    PACKAGE: "Package",
    INTERNAL_STRUCTURE: "Internal Structure",
    COMPONENT: "Component",
    DEPLOYMENT: "Deployment"
}


class TaskListPage extends Component {

    state = {
        tasks: [],
		formattedRows: []
    }

    handleCreateTaskVisible = () => {
        let user = JSON.parse(localStorage.getItem('user'));
        
        if (user.type === "ADMIN") {
            return (
                <Button variant="contained" color='primary' onClick={() => history.push('/task-create/')}>Create Task</Button>
            )
        }
        else {
            return (
                <div>Link</div>
            )
        }
    }

    handleLinkTaskVisible = (taskId) => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.type === "STUDENT") {
            return (
                <Fab color="primary" aria-label="add" size="small" onClick={() => {
                    history.push(`/tasks/${taskId}/complete`)
                }}>
                    <ArrowForwardIosIcon />
                </Fab>
            )
        }
        else {
            return (
                <Fab color="primary" aria-label="add" size="small" onClick={() => {
                    axios.delete(
                        `http://127.0.0.1:8000/api/tasks/${taskId}`
                    ).then(response => {
                        let formattedRows = []

                        formattedRows = this.state.formattedRows.filter(function(task, index, arr){ 
                            return task.id !== taskId;
                        });

                        this.setState({
                            formattedRows: formattedRows
                        })
                    })
                }}>
                    <DeleteIcon />
                </Fab>
            )
        }
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        axios.get(`http://127.0.0.1:8000/api/tasks/?user=${user.pk}&module=3`, {
            // withCredentials: true,
        })
            .then(res => {
                const tasks = res.data;
                let user = JSON.parse(localStorage.getItem('user'));
				
                let formattedRows = []
				for (var task of tasks) {
                    let taskProgress = NaN
                    let mark = "Not rated"
                    
                    if (user.type === "ADMIN") {
                        taskProgress = "Done"
                        mark = task.max_mark
                    }
                    else {
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
                                        break;
                                    }
                                }
                                
                            }
                        }
                    }
					formattedRows.push({
						id: task.pk,
                        title: task.title,
                        maxMark: task.max_mark,
                        mark: mark,
						progress: taskProgress,
						difficulty: taskDifficulty[task.difficulty],
                        type: taskType[task.type],
                        task: task.pk
					})
				} 
                this.setState({tasks: tasks, formattedRows: formattedRows})
				
            })
    };

    render() {
        console.log(this.state)
        return (
            <div style={{
                display: 'flex', height: '93vh'
            }}>
                <div style={{flexGrow: 1}}>
                    <DataGrid   showToolbar 
                                density="standard" 
                                autoPageSize={true}
                                columns={[
                                    {field: 'title', headerName: 'Title', flex: 4,},
                                    {field: 'maxMark', headerName: 'Max Mark', flex: 1,},
                                    {field: 'mark', headerName: 'Mark', flex: 1,},
                                    {field: 'progress', headerName: 'Progress', flex: 2,},
                                    {field: 'difficulty', headerName: 'Difficulty', flex: 2,
                                        renderCell: (params) => (
                                            <DifficultCell difficulty={params.value}/>
                                        )},
                                    {field: 'type', headerName: 'Type', flex: 2},
                                    {field: 'task', flex: 1.25, sortable: false, filterable: false,
                                        renderCell: (params) => (
                                            this.handleLinkTaskVisible(params.value)
                                        ),
                                        renderHeader: (params) => (
                                            this.handleCreateTaskVisible()
                                        )}]}
                                rows={this.state.formattedRows}/>
                </div>
            </div>
        )
    }
}

export default TaskListPage