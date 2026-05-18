import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

const days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]
const priorityMap = {
  1: "Low",
  2: "Medium",
  3: "High"
}

export default function App() {

  const [taskName, setTaskName] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')
  const [tasks, setTasks] = useState([])

  useEffect(() =>{
    axios.get('http://localhost:5000/api/getTasks')
    .then((response) =>{
      setTasks(response.data)
    })
    .catch((err) => console.log(err))
  }, []);

  function handleSubmit() {

    setTaskName("")
    setTaskDesc("")
    setTaskDate("")
    setTaskPriority("Medium")

    const newTask = {
      title: taskName,
      desc: taskDesc,
      priority: taskPriority,
      date: taskDate
    };

    axios.post('http://localhost:5000/api/newTask', {
    'body': newTask
    })
    .then((response) => {
    setTasks(response.data)
    });
  }

  function deleteTask(idToDelete) {

    axios.delete(`http://localhost:5000/api/deleteTask/${idToDelete}`)
    .then((response) => {
      setTasks(response.data)
    });
  }

  function toggleDesc(id) {
    const desc = document.getElementById(id)
    if (desc.style.display === 'none'){
      desc.style.display = 'block'
    }
    else{
      desc.style.display = 'none'
    }

    }

  return (
    <>
      <div className="wrapper">
        <div id="listFrame">
          <div id="listTitleFrame">
            <h1 id="listTitle">To Do List</h1>
          </div>
          <div id="innerFrame">
            <TaskTemplate tasks={tasks} deleteTask={deleteTask} toggleDesc={toggleDesc} />
          </div>
        </div>
        <div id="taskFrame">
          <div id="taskTitleFrame">
            <h1 id="taskTitle">Create Task</h1>
          </div>
          <div id="setInfo">
            <div id="setWriting">
              <div id="setTitle">
                <TextBox
                  inputText={taskName}
                  setInputText={setTaskName}
                  textBoxId="titleInput"
                  textBoxTitle="Title"
                  inputType="input" />
              </div>
              <div id="setDesc">
                <TextBox
                  inputText={taskDesc}
                  setInputText={setTaskDesc}
                  textBoxId="descInput"
                  textBoxTitle="Description"
                  inputType="textarea" />
              </div>
            </div>
            <div id="setDropdown">
              <div id="setDate">
                <div style={{ paddingLeft: "20px" }}>
                  <h3>Due Date</h3>
                </div>
                <div id="pickDate">
                  <DatePicker taskDate={taskDate} setTaskDate={setTaskDate} />
                </div>
              </div>
              <div id="setPriority">
                <h3>Priority</h3>
                <SetPriority
                  taskPriority={taskPriority}
                  setTaskPriority={setTaskPriority} />
              </div>
              <div id="submitDiv">
                <SubmitButton
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function TextBox({ inputText, setInputText, textBoxTitle, textBoxId, inputType }) {

  const Tag = inputType
  return (
    <>
      <h3>{textBoxTitle}</h3>
      <Tag
        id={textBoxId}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} />
    </>
  )
}

function DatePicker({ taskDate, setTaskDate }) {
  return (
    <>
      {days.map((day => (
        <SetDate
          key={day}
          buttonDay={day}
          taskDate={taskDate}
          setTaskDate={setTaskDate}
        />
      )))}
    </>
  )
}

function SetDate({ taskDate, setTaskDate, buttonDay }) {
  return (
    <>
      <button
        className="dateButton"
        onClick={() => setTaskDate(buttonDay)}
        style={{ backgroundColor: buttonDay === taskDate ? 'coral' : 'lightgray' }}>
        {buttonDay}
      </button>
    </>
  )
}

function TaskTemplate({ tasks, deleteTask, toggleDesc }) {
  return (
    <>
      {tasks.map(task => (
        <div className="listTaskDiv" key={task.title}>
          <h2>{task.title}</h2>
          <block className="taskNotch">{task.date}</block>
          <block className="taskNotch" style={{
            backgroundColor:
              task.priority === "Low" ? 'green' :
                task.priority === "High" ? 'red' : 'yellow',
          }}>
            {task.priority}</block>
          <button className="taskButton" onClick={() => deleteTask(task._id)}>Delete</button>
          <button className="taskButton" onClick={() => toggleDesc(`${task.title}Div`)}>More</button>
          <div className="descDiv" id={`${task.title}Div`}>
            <p className="descText">{task.desc}</p>
          </div>
        </div>
      ))}
    </>
  );
}

function SetPriority({ taskPriority, setTaskPriority }) {
  return (
    <input
      id="priorityRange"
      type="range"
      min="0"
      max="2"
      onChange={(e) => {
        setTaskPriority(priorityMap[Number(e.target.value) + 1])
      }}
    ></input>
  )
}

function SubmitButton({ handleSubmit }) {
  return (
    <button
      id="submitButton"
      onClick={handleSubmit}
    >
      Submit
    </button>
  )
}