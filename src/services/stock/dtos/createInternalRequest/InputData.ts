interface ICreateInternalRequestInputData {
  products: {
    id: number
    quantity: number
  }[]
  whereUsed: string
}

export default ICreateInternalRequestInputData
