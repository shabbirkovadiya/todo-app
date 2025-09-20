import { useState, useEffect } from "react";
import "./App.css";
import { MdModeEdit, MdDelete,MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const todoSchema = z
  .string()
  .trim()
  .min(1, "Please enter a task")
  .max(50, "Task is too long");

export default function TodoApp() {
  const [todos, setTodos] = useState(
      JSON.parse(localStorage.getItem("todos")) || []
  )
  const [todoItem, setTodoItem] = useState("");
  const [editId,setEditId] = useState(null)

//use effect on every todo changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleClick = () => {
    const parsed = todoSchema.safeParse(todoItem);
    if (!parsed.success) {
    alert(parsed.error.errors[0].message);
      return;
    }
    if(editId){
      setTodos(todos.map(todo=>todo.id === editId ? {...todo, name:todoItem} : todo))
      setEditId(null)
      setTodoItem("")
    }
   else{
     setTodos((prev) => [
      ...prev,
      { name: todoItem, id: uuidv4(), isCompleted: false },
    ]);
    setTodoItem("");
   }
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompleted = (id) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };
 const handleEdit=(id)=>{
  setEditId(id);
  let editTodo = todos.find(todo=>todo.id == id)
  setTodoItem(editTodo.name);
 }

  return (
    <div className="todo-wrapper">
      <div className="todo-card">
        <h1 className="title">My To-Do List</h1>
        <p className="title credit">github:- shabbirkovadiya</p>

        <div className="input-row">
          <input
            type="text"
            placeholder="Add a task..."
            className="todo-input"
            onChange={(e) => setTodoItem(e.target.value)}
            value={todoItem}
          />
          <button className="add-btn" onClick={handleClick}>
            {editId == null ? "ADD" : "UPDATE"}
          </button>
        </div>

        <div className="todo-list">
       {todos && todos.length > 0 ?todos.map((item) => (
            <div
              key={item.id}
              className="todo-item"
            >
              <p className={item.isCompleted ? "task-completed" : ""}>
                {item.name}
              </p>
              <span className="items-btns-wrapper">
                <MdModeEdit
                  className={item.isCompleted ? "display-none" : "editIcon icon"}
                  onClick={() => {
                    handleEdit(item.id);
                  }}/>
                <MdDelete
                  className="deleteIcon icon"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                />
                {item.isCompleted ? <MdCheckBox className="icon completed-icon"   onClick={() => handleCompleted(item.id)}/>: <MdCheckBoxOutlineBlank  className="icon completed-icon"   onClick={() => handleCompleted(item.id)}/>}
              </span>
            </div>
          )) : (
            <h2 style={{textAlign : "center"}}>No Items To Do</h2>
          )}
   
        </div>
       
      </div>
    </div>
  );
}
