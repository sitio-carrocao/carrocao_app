import HttpClient from '@services/core/HttpClient'
import type { AxiosResponse } from 'axios'

import type IUploadImageInputData from './dtos/uploadImage/InputData'
import type IUploadImageOutputData from './dtos/uploadImage/OutputData'
import type IImageRepository from './IImageRepository'

interface IPostImageResponse {
  message: string
  url: string
}

class UploadService implements IImageRepository {
  public async uploadImage(
    inputData: IUploadImageInputData
  ): Promise<IUploadImageOutputData> {
    const formData = new FormData()
    formData.append('image', inputData.file as unknown as File)
    const response: AxiosResponse<IPostImageResponse> = await HttpClient.post({
      path: '/images',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const outputData: IUploadImageOutputData = { url: response.data.url }
    return outputData
  }
}

export default new UploadService()
