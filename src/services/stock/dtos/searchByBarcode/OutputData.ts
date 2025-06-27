interface ISearchByBarcodeOutputData {
  barcode: string
  id: number
  name: string
  unitMeasurement: string
  maximumStock: number | null
  minimumStock: number | null
}

export default ISearchByBarcodeOutputData
