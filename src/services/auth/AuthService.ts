import HttpClient from '@services/core/HttpClient'
import type IAuthRepository from './IAuthRepository'
import type ISignInInputData from './dtos/signIn/InputData'
import type ISignInOutputData from './dtos/signIn/OutputData'

interface ISignInBodyRequest {
  code: string
  password: string
}

interface ISignInResponse {
  token: string
}

class AuthService implements IAuthRepository {
  public async signIn(inputData: ISignInInputData): Promise<ISignInOutputData> {
    const body: ISignInBodyRequest = {
      code: inputData.code,
      password: inputData.password,
    }
    const response = await HttpClient.post<ISignInResponse, ISignInBodyRequest>(
      {
        path: 'app/sessions',
        body,
      }
    )
    const output: ISignInOutputData = {
      token: response.data.token,
    }
    return output
  }
}

export default new AuthService()
