import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Chart from "./Charts";

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

    paper: {
        padding: theme.spacing(4),
    },
});

class UserProfilePage extends Component {
    state = {
        email: "",
        first_name: "",
        last_name: "",
        pk: 0,
        type: "STUDENT",
        username: "",
        countAll: 0,
        countDone: 0,
        countInProgress: 0,
        data: [],
    };

    calculateChartData = (modules) => {
        let requirements = null;
        let design = null;
        let modelling = null;
        let coding = null;
        let testing = null;

        for (const module of modules) {
        if (module.name === "Requirements") {
            requirements = module;
        } else if (module.name === "Design") {
            design = module;
        } else if (module.name === "Modelling") {
            modelling = module;
        } else if (module.name === "Coding") {
            coding = module;
        } else if (module.name === "Testing") {
            testing = module;
        }
        }

        let data = [
        {
            name: "All Task",
            requirements: requirements.tasks_all,
            design: design.tasks_all,
            modelling: modelling.tasks_all,
            coding: coding.tasks_all,
            testing: testing.tasks_all,
        },
        {
            name: "In Progress",
            requirements: requirements.tasks_in_progress,
            design: design.tasks_in_progress,
            modelling: modelling.tasks_in_progress,
            coding: coding.tasks_in_progress,
            testing: testing.tasks_in_progress,
        },
        {
            name: "Done",
            requirements: requirements.tasks_done,
            design: design.tasks_done,
            modelling: modelling.tasks_done,
            coding: coding.tasks_done,
            testing: testing.tasks_done,
        },
        ];

        return data
    };

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem("user"));

        axios
        .get(`http://127.0.0.1:8000/api/tasks/?user=${user.pk}`)
        .then((response) => {
            const tasks = response.data;
            let countDone = 0;
            let countAll = 0;
            let countInProgress = 0;

            countAll = tasks.length;
            for (var task of tasks) {
            let taskProgress = NaN;

            if (task.users_progress.length === 0) {
                taskProgress = "To Do";
            } else {
                taskProgress = "To Do";
                for (var userProgress of task.users_progress) {
                if (userProgress.user === user.pk) {
                    taskProgress = "In Progress";
                    if (userProgress.is_completed) {
                    taskProgress = "Done";
                    break;
                    }
                }
                }
            }

            if (taskProgress === "In Progress") {
                countInProgress += 1;
            } else if (taskProgress === "Done") {
                countDone += 1;
            }

            axios
                .get(`http://127.0.0.1:8000/api/modules/?user=${user.pk}`)
                .then((response) => {
                const modules = response.data;

                let data = this.calculateChartData(modules)

                this.setState({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    pk: user.pk,
                    type: user.type,
                    username: user.username,
                    countAll: countAll,
                    countDone: countDone,
                    countInProgress: countInProgress,
                    data: data,
                });
                });
            }
        });
    }

    handleLogout = () => {
        localStorage.removeItem("user");
        document.location.href = "/login";
    };

    render() {
        const { classes } = this.props;
        const userType = {
        STUDENT: "Student",
        ADMIN: "Admin",
        };

        return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
            <Typography
                variant="h4"
                gutterBottom
                style={{ textAlign: "center", marginBottom: "1.2rem" }}
            >
                {"User Profile"}
            </Typography>
            <TextField
                label="User Name"
                variant="outlined"
                style={{ marginBottom: "1.2rem" }}
                value={this.state.first_name + " " + this.state.last_name}
                fullWidth
                aria-readonly={true}
            />

            <TextField
                label="Email"
                variant="outlined"
                style={{ marginBottom: "1.2rem" }}
                value={this.state.email}
                fullWidth
                aria-readonly={true}
            />

            <TextField
                label="User Type"
                variant="outlined"
                style={{ marginBottom: "1.2rem", width: "49%" }}
                value={userType[this.state.type]}
                aria-readonly={true}
            />

            <TextField
                label="User Login"
                variant="outlined"
                style={{ marginBottom: "1.2rem", marginLeft: "2%", width: "49%" }}
                value={this.state.username}
                aria-readonly={true}
            />

            <TextField
                label="All tasks"
                variant="outlined"
                style={{ marginBottom: "1.2rem", width: "32%" }}
                value={this.state.countAll}
                aria-readonly={true}
            />

            <TextField
                label="Tasks in progress"
                variant="outlined"
                style={{ marginBottom: "1.2rem", marginLeft: "2%", width: "32%" }}
                value={this.state.countInProgress}
                aria-readonly={true}
            />

            <TextField
                label="Completed tasks"
                variant="outlined"
                style={{ marginBottom: "1.2rem", marginLeft: "2%", width: "32%" }}
                value={this.state.countDone}
                aria-readonly={true}
            />

            <Chart data={this.state.data} />

            <div style={{ width: "100%", display: "flex" }}>
                <div style={{ flexGrow: 1 }}></div>
                <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={this.handleLogout}
                >
                Log out
                </Button>
            </div>
            </Paper>
        </div>
        );
    }
    }

export default withStyles(styles, { withTheme: true })(UserProfilePage);
