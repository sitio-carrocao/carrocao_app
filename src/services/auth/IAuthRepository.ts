import type ISignInInputData from './dtos/signIn/InputData'
import type ISignInOutputData from './dtos/signIn/OutputData'

interface IAuthRepository {
  signIn(inputData: ISignInInputData): Promise<ISignInOutputData>
}

export default IAuthRepository
