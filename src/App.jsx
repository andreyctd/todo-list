import { useState } from 'react'
import './App.css'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function App() {
  const [newTodo, setNewTodo] = useState('Example Text')
  
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm />
      <p>{newTodo}</p>
      <TodoList />
    </div>
  )
}

export default App
