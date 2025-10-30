import type { SalesData, ValidationResult } from "./types"

// Función para eliminar tildes y normalizar texto
export function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

// Función para limpiar caracteres especiales no deseados
export function cleanSpecialCharacters(str: string): string {
  return str
    .replace(/[^\w\s\-.,áéíóúÁÉÍÓÚñÑ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// Función para validar y formatear fechas
export function validateDate(dateStr: string): string | null {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    return date.toISOString().split("T")[0]
  } catch {
    return null
  }
}

// Función para limpiar y parsear números
export function parseNumber(str: string): number {
  const cleaned = str.replace(/[^\d.-]/g, "")
  const num = Number.parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

// Función principal de limpieza de datos
export function cleanData(rawData: string[][]): SalesData[] {
  if (rawData.length < 2) return []

  const headers = rawData[0]
  const dataRows = rawData.slice(1)

  return dataRows.map((row) => {
    // Asegurar que tenemos todos los campos
    const [
      id_transaccion = "",
      fecha = "",
      id_producto = "",
      nombre_producto = "",
      categoria = "",
      cantidad = "0",
      precio_unitario = "0",
      total_venta = "0",
      pais = "",
      metodo_pago = "",
    ] = row

    return {
      id_transaccion: cleanSpecialCharacters(id_transaccion),
      fecha: validateDate(fecha) || fecha,
      id_producto: cleanSpecialCharacters(id_producto),
      nombre_producto: cleanSpecialCharacters(nombre_producto),
      categoria: cleanSpecialCharacters(categoria),
      cantidad: parseNumber(cantidad),
      precio_unitario: parseNumber(precio_unitario),
      total_venta: parseNumber(total_venta),
      pais: cleanSpecialCharacters(pais),
      metodo_pago: cleanSpecialCharacters(metodo_pago),
    }
  })
}

// Función para validar datos limpios
export function validateData(data: SalesData[]): ValidationResult[] {
  return data.map((row) => {
    const errors: string[] = []

    if (!row.id_transaccion || row.id_transaccion.length === 0) {
      errors.push("ID de transacción inválido")
    }

    if (!validateDate(row.fecha)) {
      errors.push("Fecha inválida")
    }

    if (!row.id_producto || row.id_producto.length === 0) {
      errors.push("ID de producto inválido")
    }

    if (!row.nombre_producto || row.nombre_producto.length === 0) {
      errors.push("Nombre de producto inválido")
    }

    if (row.cantidad <= 0) {
      errors.push("Cantidad debe ser mayor a 0")
    }

    if (row.precio_unitario <= 0) {
      errors.push("Precio unitario debe ser mayor a 0")
    }

    if (row.total_venta <= 0) {
      errors.push("Total de venta debe ser mayor a 0")
    }

    if (!row.pais || row.pais.length === 0) {
      errors.push("País inválido")
    }

    if (!row.metodo_pago || row.metodo_pago.length === 0) {
      errors.push("Método de pago inválido")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  })
}
