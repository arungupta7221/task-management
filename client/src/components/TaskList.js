import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/actions/taskActions';
import TaskItem from './TaskItem';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const error = useSelector((state) => state.tasks.error);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div className="task-list">
            {error && <p className="error">{error}</p>}
            {tasks.length === 0 ? (
                <p>No tasks yet. Add one above!</p>
            ) : (
                tasks.map((task) => <TaskItem key={task._id} task={task} />)
            )}
        </div>
    );
};

export default TaskList;