const initialState = {
    tasks: [],
    error: null,
};

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_TASKS_SUCCESS':
            return { ...state, tasks: action.payload, error: null };
        case 'ADD_TASK_SUCCESS':
            return { ...state, tasks: [...state.tasks, action.payload], error: null };
        case 'UPDATE_TASK_SUCCESS':
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task._id === action.payload._id ? action.payload : task
                ),
                error: null,
            };
        case 'DELETE_TASK_SUCCESS':
            return {
                ...state,
                tasks: state.tasks.filter((task) => task._id !== action.payload),
                error: null,
            };
        case 'FETCH_TASKS_FAIL':
        case 'ADD_TASK_FAIL':
        case 'UPDATE_TASK_FAIL':
        case 'DELETE_TASK_FAIL':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default taskReducer;