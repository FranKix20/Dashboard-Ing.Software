import type { SalesData } from "./types"

export function calculateTotalSales(data: SalesData[]): number {
  return data.reduce((sum, item) => sum + item.total_venta, 0)
}

export function calculateTotalTransactions(data: SalesData[]): number {
  return data.length
}

export function calculateAverageTicket(data: SalesData[]): number {
  if (data.length === 0) return 0
  return calculateTotalSales(data) / data.length
}

export function getTopProducts(data: SalesData[], limit = 5): Array<{ name: string; total: number; quantity: number }> {
  const productMap = new Map<string, { total: number; quantity: number }>()

  data.forEach((item) => {
    const existing = productMap.get(item.nombre_producto) || { total: 0, quantity: 0 }
    productMap.set(item.nombre_producto, {
      total: existing.total + item.total_venta,
      quantity: existing.quantity + item.cantidad,
    })
  })

  return Array.from(productMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

export function getSalesByMonth(data: SalesData[]): Array<{ month: string; total: number }> {
  const monthMap = new Map<string, number>()

  data.forEach((item) => {
    const date = new Date(item.fecha)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const existing = monthMap.get(monthKey) || 0
    monthMap.set(monthKey, existing + item.total_venta)
  })

  return Array.from(monthMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

export function getPaymentMethodDistribution(
  data: SalesData[],
): Array<{ method: string; count: number; percentage: number }> {
  const methodMap = new Map<string, number>()

  data.forEach((item) => {
    const existing = methodMap.get(item.metodo_pago) || 0
    methodMap.set(item.metodo_pago, existing + 1)
  })

  const total = data.length

  return Array.from(methodMap.entries())
    .map(([method, count]) => ({
      method,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getSalesByCountry(data: SalesData[]): Array<{ country: string; total: number; transactions: number }> {
  const countryMap = new Map<string, { total: number; transactions: number }>()

  data.forEach((item) => {
    const existing = countryMap.get(item.pais) || { total: 0, transactions: 0 }
    countryMap.set(item.pais, {
      total: existing.total + item.total_venta,
      transactions: existing.transactions + 1,
    })
  })

  return Array.from(countryMap.entries())
    .map(([country, stats]) => ({ country, ...stats }))
    .sort((a, b) => b.total - a.total)
}
