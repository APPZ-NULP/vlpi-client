import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import axios from "axios";
import history from "../../history"

const styles = (theme) => ({
    root: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        "& > *": {
        margin: theme.spacing(4),
        width: "50vw",
        },
    },

    formControl: {
        // margin: theme.spacing(1),
        // minWidth: 120,
      },
    
      selectEmpty: {
        marginTop: theme.spacing(2),
      },

    paper: {
        padding: theme.spacing(4),
    },
});

class TaskCreatePage extends Component {
    state = {
        difficulty: "",
        type: "",
        module: "",
    }

    handleDifficulty = (event) => {
        this.setState({
            difficulty: event.target.value
        })
    };

    handleType = (event) => {
        this.setState({
            type: event.target.value
        })
    };

    handleModule = (event) => {
        this.setState({
            module: event.target.value
        })
    };

    handleCreateTask = (event) => {
        let title = document.getElementById("title").value
        let description = document.getElementById("description").value
        let maxMark = document.getElementById("maxMark").value
        
        axios.post(
            "http://localhost:8000/api/tasks/", {
                "title": title,
                "description": description,
                "difficulty": this.state.difficulty,
                "type": this.state.type,
                "max_mark": maxMark,
                "module": this.state.module,
            }
        ).then(response => {
            history.push("/task-list")
        }).catch(reason => {
            console.log(reason)
        })
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
            <Typography
                variant="h4"
                gutterBottom
                style={{ textAlign: "center", marginBottom: "1.2rem" }}
            >
                {"Task Creation"}
            </Typography>
            <TextField
                label="Title"
                variant="outlined"
                style={{ marginBottom: "1.2rem" }}
                fullWidth
                id="title"
            />

            <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                style={{ marginBottom: "1.2rem" }}
                fullWidth
                id="description"
            />

            <TextField
                label="Max Mark"
                variant="outlined"
                type="number"
                defaultValue={1}
                InputProps={{ inputProps: { min: 1, max: 100 } }}
                style={{ marginBottom: "1.2rem" }}
                id="maxMark"
                fullWidth
            />

            <FormControl variant="outlined" className={classes.formControl} style={{width:"32%"}}>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                labelId="difficulty-label"
                id="difficulty"
                value={this.state.difficulty}
                fullWidth
                onChange={this.handleDifficulty}
                label="Difficulty"
                >
                <MenuItem value={"EASY"}>Easy</MenuItem>
                <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                <MenuItem value={"HARD"}>Hard</MenuItem>

                </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl} style={{width:"32%", marginLeft: "2%"}}>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                labelId="type-label"
                id="type"
                value={this.state.type}
                fullWidth
                onChange={this.handleType}
                label="type"
                >
                <MenuItem value={"USE_CASE"}>Use Case</MenuItem>
                <MenuItem value={"SEQUENCE"}>Sequence</MenuItem>
                <MenuItem value={"COMMUNICATION"}>Communication</MenuItem>
                <MenuItem value={"ACTIVITY"}>Activity</MenuItem>
                <MenuItem value={"CLASS"}>Class</MenuItem>
                <MenuItem value={"OBJECT"}>Object</MenuItem>
                <MenuItem value={"PACKAGE"}>Package</MenuItem>
                <MenuItem value={"INTERNAL_STRUCTURE"}>Internal Structure</MenuItem>
                <MenuItem value={"COMPONENT"}>Component</MenuItem>
                <MenuItem value={"DEPLOYMENT"}>Deployment</MenuItem>

                </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl} style={{width:"32%", marginLeft: "2%"}}>
                <InputLabel id="module-label">Module</InputLabel>
                <Select
                labelId="module-label"
                id="module"
                value={this.state.module}
                fullWidth
                onChange={this.handleModule}
                label="module"
                >
                <MenuItem value={1}>Requirements</MenuItem>
                <MenuItem value={2}>Design</MenuItem>
                <MenuItem value={3}>Modelling</MenuItem>
                <MenuItem value={4}>Coding</MenuItem>
                <MenuItem value={5}>Testing</MenuItem>

                </Select>
            </FormControl>

            <div style={{width: "100%", textAlign: 'center', marginTop: "1.2rem"}}>
                <Button variant="contained" color="primary" onClick={this.handleCreateTask}>Create Task</Button>
            </div>

            </Paper>
        </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(TaskCreatePage);
