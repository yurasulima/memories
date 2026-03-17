import api from './api'
import type { MemoriesGroupResponse, MemoriesGroupRequest, MemoriesUserResponse } from './models.ts'

export const groupsApi = {
  create: async (data: MemoriesGroupRequest): Promise<MemoriesGroupResponse> => {
    const response = await api.post<MemoriesGroupResponse>('/memories/groups', data)
    return response.data
  },
  getMyGroups: async (): Promise<MemoriesGroupResponse[]> => {
    const response = await api.get<MemoriesGroupResponse[]>('/memories/groups')
    return response.data
  },
  getById: async (groupId: number): Promise<MemoriesGroupResponse> => {
    const response = await api.get<MemoriesGroupResponse>(`/memories/groups/${groupId}`)
    return response.data
  },
  addMember: async (groupId: number, memberId: number): Promise<MemoriesGroupResponse> => {
    const response = await api.post<MemoriesGroupResponse>(`/memories/groups/${groupId}/members/${memberId}`)
    return response.data
  },
  removeMember: async (groupId: number, memberId: number): Promise<MemoriesGroupResponse> => {
    const response = await api.delete<MemoriesGroupResponse>(`/memories/groups/${groupId}/members/${memberId}`)
    return response.data
  },
  searchUsers: async (query: string): Promise<MemoriesUserResponse[]> => {
    const response = await api.get<MemoriesUserResponse[]>('/memories/users/search', { params: { query } })
    return response.data
  }
}
