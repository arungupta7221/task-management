import React, { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import './styles/App.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    return (
        <div className="app-container">
            <h1>Task Manager</h1>
            {!token ? (
                <Login setToken={setToken} />
            ) : (
                <>
                    <TaskForm />
                    <TaskList />
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            setToken('');
                        }}
                        className="logout-btn"
                    >
                        Logout
                    </button>
                </>
            )}
        </div>
    );
};

export default App;