interface IPrintIdentifyInputData {
  identify: string
  name: string
  type: 'QRCODE' | 'BARCODE'
}

export default IPrintIdentifyInputData
