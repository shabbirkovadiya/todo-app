import { useState, useEffect } from "react";
import "./App.css";
import { MdModeEdit, MdDelete, MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const todoSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, "Please enter a task")
    .max(50, "Task is too long"),
});

export default function TodoApp() {
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: { task: "" },
  });

  // save todos in localstorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add / Update
  const onSubmit = (data) => {
    if (editId) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editId ? { ...todo, name: data.task } : todo
        )
      );
      setEditId(null);
    } else {
      setTodos((prev) => [
        ...prev,
        { name: data.task, id: uuidv4(), isCompleted: false },
      ]);
    }
    reset(); // clear input
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

  const handleEdit = (id) => {
    setEditId(id);
    const editTodo = todos.find((todo) => todo.id === id);
    setValue("task", editTodo.name); // put task into form
  };

  return (
    <div className="todo-wrapper">
      <div className="todo-card">
        <h1 className="title">My To-Do List</h1>
        <p className="title credit">github:- shabbirkovadiya</p>

        {/* form with react-hook-form */}
        <form className="input-row" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Add a task..."
            className="todo-input"
            {...register("task")}
          />
          <button className="add-btn" type="submit">
            {editId == null ? "ADD" : "UPDATE"}
          </button>
        </form>
        {/* error under input */}
        {errors.task && (
          <p style={{ color: "red", marginTop: "4px" }}>
            {errors.task.message}
          </p>
        )}

        <div className="todo-list">
          {todos && todos.length > 0 ? (
            todos.map((item) => (
              <div key={item.id} className="todo-item">
                <p className={item.isCompleted ? "task-completed" : ""}>
                  {item.name}
                </p>
                <span className="items-btns-wrapper">
                  <MdModeEdit
                    className={
                      item.isCompleted ? "display-none" : "editIcon icon"
                    }
                    onClick={() => handleEdit(item.id)}
                  />
                  <MdDelete
                    className="deleteIcon icon"
                    onClick={() => handleDelete(item.id)}
                  />
                  {item.isCompleted ? (
                    <MdCheckBox
                      className="icon completed-icon"
                      onClick={() => handleCompleted(item.id)}
                    />
                  ) : (
                    <MdCheckBoxOutlineBlank
                      className="icon completed-icon"
                      onClick={() => handleCompleted(item.id)}
                    />
                  )}
                </span>
              </div>
            ))
          ) : (
            <h2 style={{ textAlign: "center" }}>No Items To Do</h2>
          )}
        </div>
      </div>
    </div>
  );
}
