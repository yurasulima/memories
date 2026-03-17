import api from './api'
import type {
  DayResponse,
  PostResponse,
  ContentResponse,
  DateResponse,
  UploadMediaResponse,
  StatsResponse,
  PaginatedResponse,
  CreateDayRequest,
  AddPostRequest,
  AddContentRequest,
  AddDateRequest,
  MemoriesVisibility
} from './models'

export const memoriesApi = {
  createDay: async (data: CreateDayRequest): Promise<DayResponse> => {
    const response = await api.post<DayResponse>('/memories/days', data)
    return response.data
  },
  getDayById: async (dayId: number): Promise<DayResponse> => {
    const response = await api.get<DayResponse>(`/memories/days/${dayId}`)
    return response.data
  },
  getGroupDays: async (groupId: number, page = 0, size = 20): Promise<PaginatedResponse<DayResponse>> => {
    const response = await api.get<PaginatedResponse<DayResponse>>(`/memories/groups/${groupId}/days`, {
      params: { page, size }
    })
    return response.data
  },
  searchDays: async (groupId: number, q: string): Promise<DayResponse[]> => {
    const response = await api.get<DayResponse[]>(`/memories/groups/${groupId}/days/search`, {
      params: { q }
    })
    return response.data
  },
  deleteDay: async (dayId: number): Promise<void> => {
    await api.delete(`/memories/days/${dayId}`)
  },
  addPost: async (data: AddPostRequest): Promise<PostResponse> => {
    const response = await api.post<PostResponse>('/memories/posts', data)
    return response.data
  },
  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/memories/posts/${postId}`)
  },
  updatePostVisibility: async (postId: number, visibility: MemoriesVisibility): Promise<PostResponse> => {
    const response = await api.patch<PostResponse>(`/memories/posts/${postId}/visibility`, null, {
      params: { visibility }
    })
    return response.data
  },
  addContent: async (data: AddContentRequest): Promise<ContentResponse> => {
    const response = await api.post<ContentResponse>('/memories/contents', data)
    return response.data
  },
  deleteContent: async (contentId: number): Promise<void> => {
    await api.delete(`/memories/contents/${contentId}`)
  },
  updateContentProgress: async (contentId: number, watchedSeries: number, season: number): Promise<ContentResponse> => {
    const response = await api.patch<ContentResponse>(`/memories/contents/${contentId}/progress`, null, {
      params: { watchedSeries, season }
    })
    return response.data
  },
  addDate: async (data: AddDateRequest): Promise<DateResponse> => {
    const response = await api.post<DateResponse>('/memories/dates', data)
    return response.data
  },
  deleteDate: async (dateId: number): Promise<void> => {
    await api.delete(`/memories/dates/${dateId}`)
  },
  uploadMedia: async (file: File): Promise<UploadMediaResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<UploadMediaResponse>('/memories/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
  getStats: async (groupId: number): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>(`/memories/groups/${groupId}/stats`)
    return response.data
  }
}