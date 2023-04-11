import {useState} from "react"
import "./ToDoList.css"

if (localStorage.getItem("uploadedTaskList") === null) {
  localStorage.setItem("uploadedTaskList", JSON.stringify([]))
}

function ToDoList() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("uploadedTaskList"))
  )
  const [filterName, setFilterName] = useState("default")
  const [inputData, setInputData] = useState("")

  function handleFilterNameChange() {
    if (filterName === "default") {
      setFilterName("notCompleted")
    }

    if (filterName === "notCompleted") {
      setFilterName("default")
    }
  }

  function handleInputDataChange(e) {
    setInputData(e.target.value)
  }

  function handleAddTask() {
    setTasks([...tasks, {id: Date.now(), isDone: false, name: inputData}])
    localStorage.setItem(
      "uploadedTaskList",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("uploadedTaskList")),
        {id: Date.now(), isDone: false, name: inputData},
      ])
    )
    setInputData("")
  }

  function handleDeleteTask({task}) {
    setTasks(tasks.filter((item) => item.id !== task.id))
    localStorage.setItem(
      "uploadedTaskList",
      JSON.stringify(
        JSON.parse(localStorage.getItem("uploadedTaskList")).filter(
          (item) => item.id !== task.id
        )
      )
    )
  }

  function handleIsDoneChange({task}) {
    setTasks(
      tasks.map((t) => {
        if (task.id === t.id) {
          return {...task, isDone: !task.isDone}
        } else {
          return t
        }
      })
    )
    localStorage.setItem(
      "uploadedTaskList",
      JSON.stringify(
        JSON.parse(localStorage.getItem("uploadedTaskList")).map((t) => {
          if (task.id === t.id) {
            return {...task, isDone: !task.isDone}
          } else {
            return t
          }
        })
      )
    )
  }

  function handleChangeName({task, e}) {
    setTasks(
      tasks.map((t) => {
        if (task.id === t.id) {
          return {...task, name: e.target.value}
        } else {
          return t
        }
      })
    )
    localStorage.setItem(
      "uploadedTaskList",
      JSON.stringify(
        JSON.parse(localStorage.getItem("uploadedTaskList")).map((t) => {
          if (task.id === t.id) {
            return {...task, name: e.target.value}
          } else {
            return t
          }
        })
      )
    )
  }

  return (
    <div className="todo__container">
      <ToDoAddBlock
        inputData={inputData}
        filterName={filterName}
        onFilterChange={handleFilterNameChange}
        onInputChange={handleInputDataChange}
        onAddTask={handleAddTask}></ToDoAddBlock>
      <ToDoTaskList
        tasks={
          filterName === "default"
            ? tasks
            : tasks.filter((item) => !item.isDone)
        }
        itemFN={{
          onIsDoneChange: handleIsDoneChange,
          onDelete: handleDeleteTask,
          onChangeName: handleChangeName,
        }}></ToDoTaskList>
    </div>
  )
}

function ToDoAddBlock({
  inputData,
  filterName,
  onFilterChange,
  onInputChange,
  onAddTask,
}) {
  return (
    <div className="todo__add-container">
      <div onClick={onFilterChange} className="button-border">
        <div
          className={
            filterName === "default"
              ? "todo__filter-button filter-time"
              : "todo__filter-button filter-done"
          }></div>
      </div>
      <input
        type="text"
        value={inputData}
        onChange={onInputChange}
        className="todo__input"
        placeholder="ADD NEW TASK"></input>
      <div onClick={onAddTask} className="todo__add-button"></div>
    </div>
  )
}

function ToDoTaskList({tasks, itemFN}) {
  return (
    <ul className="todo__list">
      {tasks.map((obj) => {
        return (
          <ToDoItem
            key={obj.id}
            task={obj}
            onIsDoneChange={itemFN.onIsDoneChange}
            onDelete={itemFN.onDelete}
            onChangeName={itemFN.onChangeName}></ToDoItem>
        )
      })}
    </ul>
  )
}

function ToDoItem({task, onIsDoneChange, onDelete, onChangeName}) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isEditing) {
    return (
      <li className="todo__item">
        <div
          onClick={() => onIsDoneChange({task})}
          className={
            task.isDone
              ? "item__check-block button-border _completed"
              : "item__check-block button-border"
          }></div>
        <div className="item__content">{task.name}</div>
        <ul className="item__buttons-list">
          <li className="button-border" onClick={() => setIsEditing(true)}>
            <div className="item__edit-button"></div>
          </li>
          <li onClick={() => onDelete({task})} className="button-border">
            <div className="item__delete-button"></div>
          </li>
        </ul>
      </li>
    )
  } else {
    return (
      <li className="todo__item">
        <div
          onClick={() => onIsDoneChange({task})}
          className={
            task.isDone ? "button-border _completed" : "button-border"
          }></div>
        <div className="item__content">
          <input
            type="text"
            autoFocus
            value={task.name}
            onChange={(e) => onChangeName({task, e})}></input>
        </div>
        <ul className="item__buttons-list">
          <li className="button-border" onClick={() => setIsEditing(false)}>
            <div className="_completed"></div>
          </li>
          <li onClick={() => onDelete({task})} className="button-border">
            <div className="item__delete-button"></div>
          </li>
        </ul>
      </li>
    )
  }
}

export default ToDoList
