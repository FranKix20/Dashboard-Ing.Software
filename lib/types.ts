export interface SalesData {
  id_transaccion: string
  fecha: string
  id_producto: string
  nombre_producto: string
  categoria: string
  cantidad: number
  precio_unitario: number
  total_venta: number
  pais: string
  metodo_pago: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}
