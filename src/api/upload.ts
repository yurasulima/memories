
import axios from 'axios'
import type { UploadImageResponse } from './models'
import api from "@/api/api";

const uploadClient = axios.create({
    baseURL: 'https://api.mblueberry.space',
    headers: { 'Content-Type': 'multipart/form-data' }
})

export const uploadApi = {
    uploadImage: async (file: File, folder: string): Promise<UploadImageResponse> => {
        const ext = file.name.split('.').pop() || 'png'
        const safeName = crypto.randomUUID() + '.' + ext

        const formData = new FormData()
        formData.append('file', file, safeName)

        const response = await axios.post<UploadImageResponse>(
            `https://api.mblueberry.space/upload/image`,
            formData,
            {
                params: { folder: folder.trim().replace(/\/$/, '') },
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        )

        return response.data
    }
}