interface IGetAllStockAddressesOutputData {
  list: {
    column: string
    deposit: string
    id: number
    level: string
  }[]
  pagination: {
    current: number
    total: number
  }
}

export default IGetAllStockAddressesOutputData
