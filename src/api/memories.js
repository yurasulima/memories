import api from './api.js'

export const memoriesApi = {
  createDay: async (data) => {
    const response = await api.post('/memories/days', data)
    return response.data
  },
  getDayById: async (dayId) => {
    const response = await api.get(`/memories/days/${dayId}`)
    return response.data
  },
  getGroupDays: async (groupId, page = 0, size = 20) => {
    const response = await api.get(`/memories/groups/${groupId}/days`, {
      params: { page, size }
    })
    return response.data
  },
  searchDays: async (groupId, q) => {
    const response = await api.get(`/memories/groups/${groupId}/days/search`, {
      params: { q }
    })
    return response.data
  },
  deleteDay: async (dayId) => {
    await api.delete(`/memories/days/${dayId}`)
  },
  addPost: async (data) => {
    const response = await api.post('/memories/posts', data)
    return response.data
  },
  deletePost: async (postId) => {
    await api.delete(`/memories/posts/${postId}`)
  },
  updatePostVisibility: async (postId, visibility) => {
    const response = await api.patch(`/memories/posts/${postId}/visibility`, null, {
      params: { visibility }
    })
    return response.data
  },
  addContent: async (data) => {
    const response = await api.post('/memories/contents', data)
    return response.data
  },
  deleteContent: async (contentId) => {
    await api.delete(`/memories/contents/${contentId}`)
  },
  updateContentProgress: async (contentId, watchedSeries, season) => {
    const response = await api.patch(`/memories/contents/${contentId}/progress`, null, {
      params: { watchedSeries, season }
    })
    return response.data
  },
  addDate: async (data) => {
    const response = await api.post('/memories/dates', data)
    return response.data
  },
  deleteDate: async (dateId) => {
    await api.delete(`/memories/dates/${dateId}`)
  },
  uploadMedia: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/memories/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  getStats: async (groupId) => {
    const response = await api.get(`/memories/groups/${groupId}/stats`)
    return response.data
  }
}