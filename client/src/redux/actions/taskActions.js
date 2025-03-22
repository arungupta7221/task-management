// client/src/redux/actions/taskActions.js
import axios from 'axios';

export const fetchTasks = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await axios.get('/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: res.data });
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        dispatch({ type: 'FETCH_TASKS_FAIL', payload: error.response?.data.message || 'Error fetching tasks' });
    }
};

// Similarly update addTask, updateTask, deleteTask with /api/tasks
export const addTask = (task) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await axios.post('/api/tasks', task, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: 'ADD_TASK_SUCCESS', payload: res.data });
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        dispatch({ type: 'ADD_TASK_FAIL', payload: error.response?.data.message || 'Error adding task' });
    }
};

export const updateTask = (id, task) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await axios.put(`/api/tasks/${id}`, task, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: res.data });
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        dispatch({ type: 'UPDATE_TASK_FAIL', payload: error.response?.data.message || 'Error updating task' });
    }
};

export const deleteTask = (id) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        await axios.delete(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        dispatch({ type: 'DELETE_TASK_FAIL', payload: error.response?.data.message || 'Error deleting task' });
    }
};