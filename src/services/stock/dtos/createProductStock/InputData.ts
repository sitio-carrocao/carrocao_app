interface ICreateProductStockInputData {
  batch: string | null
  id: number
  productExpirationDate: string | null
  stockAddressId: number
  value: number
}

export default ICreateProductStockInputData
