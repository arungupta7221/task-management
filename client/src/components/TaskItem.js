import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../redux/actions/taskActions';

const TaskItem = ({ task }) => {
    const dispatch = useDispatch();

    const toggleStatus = () => {
        dispatch(
            updateTask(task._id, {
                ...task,
                status: task.status === 'pending' ? 'completed' : 'pending',
            })
        );
    };

    return (
        <div className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description || 'No description'}</p>
            <p className={`status ${task.status}`}>Status: {task.status}</p>
            <div className="buttons">
                <button className="toggle-btn" onClick={toggleStatus}>
                    Toggle Status
                </button>
                <button className="delete-btn" onClick={() => dispatch(deleteTask(task._id))}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;