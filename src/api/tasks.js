import api from './interceptors'

export const getAllTasks = async ({ page = 1, limit = 20 }) => {
    const response = await api.get('/tasks', { params: { page, limit } })
    return response.data
}

export const addNewTask = async (taskData) => {
    const response = await api.post('/tasks', taskData)
    return response.data
}

export const editTask = async (idParams, taskData) => {
    const response = await api.put(`/tasks/${idParams}`, taskData)
    return response.data
}

export const deleteTask = async (idParams) => {
    const response = await api.delete(`/tasks/${idParams}`)
    return response.data
}

export const changesTaskStatus = async (idParams, statusData = null) => {
    const response = await api.patch(
        `/tasks/${idParams}/complete`,
        statusData ? { status: statusData } : {},
    )
    return response.data
}

export const deleteAllTasks = async () => {
    const response = await api.delete('/tasks/delete-all')
    return response
}
