interface ICreateExternalRequestInputData {
  brand: string | null
  color: string | null
  details: string | null
  images: {
    uri: string
    fileName: string
    mimeType: string
  }[]
  model: string | null
  name: string
  quantity: number
  whereUsed: string | null
}

export default ICreateExternalRequestInputData
