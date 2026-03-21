import { defineStore } from 'pinia'
import { ref } from 'vue'
import { groupsApi } from '@/api/group'
import type { MemoriesGroupResponse, MemoriesGroupRequest } from '@/api/models'

const LAST_GROUP_KEY = 'lastGroupId'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<MemoriesGroupResponse[]>([])
  const currentGroup = ref<MemoriesGroupResponse | null>(null)
  const loading = ref<boolean>(false)

  const fetchMyGroups = async (): Promise<void> => {
    loading.value = true
    try {
      groups.value = await groupsApi.getMyGroups()
      if (groups.value.length > 0) {
        // Restore last selected group
        const lastId = Number(localStorage.getItem(LAST_GROUP_KEY))
        const restored = lastId ? groups.value.find(g => g.id === lastId) : null
        currentGroup.value = restored ?? groups.value[0]
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

  const setCurrentGroup = (group: MemoriesGroupResponse): void => {
    currentGroup.value = group
    localStorage.setItem(LAST_GROUP_KEY, String(group.id))
  }

  const createGroup = async (data: MemoriesGroupRequest): Promise<MemoriesGroupResponse> => {
    loading.value = true
    try {
      const newGroup = await groupsApi.create(data)
      groups.value.push(newGroup)
      setCurrentGroup(newGroup)
      return newGroup
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    groups.value = []
    currentGroup.value = null
  }

  return { groups, currentGroup, loading, fetchMyGroups, fetchGroupById, setCurrentGroup, createGroup, reset }
})