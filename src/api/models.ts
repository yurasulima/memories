export type MemoriesVisibility = 'GROUP' | 'PRIVATE'

export type MemoriesContentType = 'CARTOON' | 'ANIME' | 'HENTAI' | 'SERIES' | 'FILM'

export type MediaType = 'MEMORIES' | 'GIF' | 'VIDEO'

export interface MediaResponse {
  id: number
  url: string
  type: MediaType
  createdAt: string
}

export interface MemoriesUserResponse {
  id: number
  username: string
  fullName: string
  email: string
  createAt: string
}

export interface PostResponse {
  id: number
  visibility: MemoriesVisibility
  text: string
  media: MediaResponse[]
  createAt: string
}

export interface ContentResponse {
  id: number
  type: MemoriesContentType
  name: string
  watchedSeries: number | null
  season: number | null
  createAt: string
}

export interface DateResponse {
  id: number
  name: string
  description: string
  once: boolean
  createAt: string
}

export interface DayResponse {
  id: number
  groupId: number
  groupName: string
  author: MemoriesUserResponse
  date: string
  createAt: string
  posts: PostResponse[]
  contents: ContentResponse[]
  dates: DateResponse[]
}

export interface MemoriesGroupResponse {
  id: number
  name: string
  owner: MemoriesUserResponse
  members: MemoriesUserResponse[]
  createAt: string
}

export interface MemoriesAuthResponse {
  token: string
  user: MemoriesUserResponse
}

export interface MemoriesAuthRequest {
  email: string
  password: string
}

export interface MemoriesRegisterRequest {
  email: string
  password: string
  username: string
  fullName: string
}

export interface CreateDayRequest {
  groupId: number
  date: string
}


export interface PostMediaRequest {
  url: string
  type: MediaType
  width: number
  height: number
  duration?: number
}

export interface AddPostRequest {
  dayId: number
  text: string
  visibility: MemoriesVisibility
  media?: PostMediaRequest[]
}


export interface AddContentRequest {
  dayId: number
  type: MemoriesContentType
  name: string
  watchedSeries?: number
  season?: number
}

export interface AddDateRequest {
  dayId: number
  name: string
  description: string
  once: boolean
}

export interface MemoriesGroupRequest {
  name: string
  memberIds: number[]
}

export interface UploadMediaResponse {
  id: number
  url: string
  type: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}


export interface TopContentItem {
  name: string
  type: MemoriesContentType
  count: number
  totalSeries: number
}

export interface UpcomingDate {
  name: string
  description: string
  daysUntil: number
  yearsCount: number
}

export interface StatsResponse {
  totalDays: number
  totalPosts: number
  totalContents: number
  totalDates: number
  totalMedia: number
  totalPrivatePosts: number
  totalGroupPosts: number
  totalOnceDates: number
  totalRecurringDates: number
  currentStreak: number
  longestStreak: number
  contentByType: Record<string, number>
  topContent: TopContentItem[]
  daysByMonth: Record<string, number>
  postsByMonth: Record<string, number>
  daysByWeekday: Record<string, number>
  upcomingDates: UpcomingDate[]
}

export interface UploadImageResponse {
  url: string
}