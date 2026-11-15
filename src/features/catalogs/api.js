import { apiRequest } from '@/api/client'

// Platforms (/platform) and digital stores (/digital-platform) share the same CRUD shape.
export function catalogApi(resource) {
  return {
    list: () => apiRequest(`/${resource}`),
    create: (body) => apiRequest(`/${resource}`, { method: 'POST', body }),
    update: ({ id, body }) => apiRequest(`/${resource}/${id}`, { method: 'PATCH', body }),
    remove: (id) => apiRequest(`/${resource}/${id}`, { method: 'DELETE' }),
  }
}
