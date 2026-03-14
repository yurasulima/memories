import { defineStore } from 'pinia'
import { ref } from 'vue'
import { groupsApi } from '../api/group.js'

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref([])
  const currentGroup = ref(null)
  const loading = ref(false)

  const fetchMyGroups = async () => {
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

  const fetchGroupById = async (groupId) => {
    loading.value = true
    try {
      currentGroup.value = await groupsApi.getById(groupId)
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (data) => {
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
