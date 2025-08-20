interface ICreateProductInputData {
  active: boolean
  barcode: string | null
  max: number
  min: number
  model: string | null
  name: string
  observation: string
  images: {
    uri: string
    fileName: string
    mimeType: string
  }[]
  productType: number
  stockType: number
  unitMensuare: number
  id: number
}

export default ICreateProductInputData
