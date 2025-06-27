interface IStockTask {
  alreadyRegistered: boolean
  barcode: string
  description: string
  id: number
  quantity: number
  value: number
  suggestedAddress: {
    column: string
    deposit: string
    description: string
    id: number
    level: string
    street: string
  } | null
  unitMeasurement: string
}

export default IStockTask
