import type IUploadImageInputData from './dtos/uploadImage/InputData'
import type IUploadImageOutputData from './dtos/uploadImage/OutputData'

interface IImageRepository {
  uploadImage(inputData: IUploadImageInputData): Promise<IUploadImageOutputData>
}

export default IImageRepository
