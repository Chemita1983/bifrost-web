import { apiRequest } from '@/api/client'

export const fetchVideogames = () => apiRequest('/videogames')
export const createVideogame = (body) => apiRequest('/videogame', { method: 'POST', body })
export const updateVideogame = ({ id, body }) => apiRequest(`/videogame/${id}`, { method: 'PATCH', body })
export const deleteVideogame = (id) => apiRequest(`/videogame/${id}`, { method: 'DELETE' })
