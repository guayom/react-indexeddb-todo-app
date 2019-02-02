import React from "react"
import Layout from "../components/layout"
import TaskList from "../components/task-list";
import NewTask from "../components/new-task";
import NoTasks from "../components/no-tasks";
import ToggleCompleted from "../components/toggle-completed";
import { openDb } from "idb";

const originalShowOnlyIncomplete =
  JSON.parse(localStorage.getItem("__showOnlyIncomplete")) || false;

const dbPromise = openDb("TASKS-DB", 1, upgradeDB => {
  upgradeDB.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true
  });
});

class IndexPage extends React.Component {
  state = {
    showOnlyIncomplete: originalShowOnlyIncomplete,
    tasks: []
  };

  deleteTask = e => {
    const id = Math.trunc(e.target.value);
    dbPromise
      .then(db => {
        const tx = db.transaction("tasks", "readwrite");
        tx.objectStore("tasks").delete(id);
        return tx.complete;
      })
      .then(this.getTasksToState());
  };

  addTask = e => {
    e.preventDefault();
    const taskField = e.target.task;
    const taskTitle = taskField.value;
    taskField.value = "";
    dbPromise
      .then(db => {
        const tx = db.transaction("tasks", "readwrite");
        tx.objectStore("tasks").put({
          title: taskTitle,
          done: false
        });
        return tx.complete;
      })
      .then(this.getTasksToState());
  };

  editTask = e => {
    const taskId = Math.trunc(e.currentTarget.id);
    const newTitle = e.target.value;

    dbPromise
      .then(db => {
        return db
          .transaction("tasks")
          .objectStore("tasks")
          .get(taskId);
      })
      .then(obj => {
        obj.title = newTitle;
        this.updateTask(obj);
      });
  };

  updateTask = task => {
    dbPromise
      .then(db => {
        const tx = db.transaction("tasks", "readwrite");
        tx.objectStore("tasks").put(task);
        return tx.complete;
      })
      .then(this.getTasksToState());
  };

  changeStatus = e => {
    const value = e.target.checked;
    const id = Math.trunc(e.target.dataset.id);
    dbPromise
      .then(db => {
        return db
          .transaction("tasks")
          .objectStore("tasks")
          .get(id);
      })
      .then(obj => {
        obj.done = value;
        this.updateTask(obj);
      });
  };

  toggleShowOnlyIncomplete = () => {
    const newState = !this.state.showOnlyIncomplete;
    localStorage.setItem("__showOnlyIncomplete", newState);
    this.setState({ showOnlyIncomplete: newState });
  };

  getTasksToState = () => {
    dbPromise
      .then(db => {
        return db
          .transaction("tasks")
          .objectStore("tasks")
          .getAll();
      })
      .then(tasks => this.setState({ tasks }));
  };

  componentDidMount = () => {
    this.getTasksToState();
  };

  render() {
    const { tasks, showOnlyIncomplete } = this.state;
    return (
      <Layout>
        <div className="App">
          <NewTask addTask={e => this.addTask(e)} />
          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              deleteTask={this.deleteTask}
              changeStatus={this.changeStatus}
              showOnlyIncomplete={showOnlyIncomplete}
              editTask={e => this.editTask(e)}
            />
          ) : (
            <NoTasks />
          )}
          <ToggleCompleted
            handleChange={this.toggleShowOnlyIncomplete}
            checked={showOnlyIncomplete}
          />
        </div>
      </Layout>
    );
  }
}

export default IndexPage
