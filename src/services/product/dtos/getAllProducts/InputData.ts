import type EProductStockStatus from '@enums/productStockStatus'

interface IGetAllProductsInputData {
  active?: '0' | '1'
  name?: string
  page?: number
  rows_per_page?: string
  stock_status?: EProductStockStatus
  type_product?: string
  type_stock?: string
  unit_measurement?: string
}

export default IGetAllProductsInputData
