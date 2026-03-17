import { defineStore } from 'pinia'
import { ref } from 'vue'
import { groupsApi } from '@/api/group'
import type { MemoriesGroupResponse, MemoriesGroupRequest } from '@/api/models'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<MemoriesGroupResponse[]>([])
  const currentGroup = ref<MemoriesGroupResponse | null>(null)
  const loading = ref<boolean>(false)

  const fetchMyGroups = async (): Promise<void> => {
    loading.value = true
    try {
      groups.value = await groupsApi.getMyGroups()
      if (groups.value.length > 0 && !currentGroup.value) {
        currentGroup.value = groups.value[0]
      }
    } finally {
      loading.value = false
    }
  }

  const fetchGroupById = async (groupId: number): Promise<void> => {
    loading.value = true
    try {
      currentGroup.value = await groupsApi.getById(groupId)
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (data: MemoriesGroupRequest): Promise<MemoriesGroupResponse> => {
    loading.value = true
    try {
      const newGroup = await groupsApi.create(data)
      groups.value.push(newGroup)
      currentGroup.value = newGroup
      return newGroup
    } finally {
      loading.value = false
    }
  }

  return { groups, currentGroup, loading, fetchMyGroups, fetchGroupById, createGroup }
})
