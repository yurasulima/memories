import api from './api.js'

export const groupsApi = {
  create: async (data) => {
    const response = await api.post('/memories/groups', data)
    return response.data
  },
  getMyGroups: async () => {
    const response = await api.get('/memories/groups')
    return response.data
  },
  getById: async (groupId) => {
    const response = await api.get(`/memories/groups/${groupId}`)
    return response.data
  },
  addMember: async (groupId, memberId) => {
    const response = await api.post(`/memories/groups/${groupId}/members/${memberId}`)
    return response.data
  },
  removeMember: async (groupId, memberId) => {
    const response = await api.delete(`/memories/groups/${groupId}/members/${memberId}`)
    return response.data
  },
  searchUsers: async (query) => {
    const response = await api.get('/memories/users/search', { params: { query } })
    return response.data
  }
}
