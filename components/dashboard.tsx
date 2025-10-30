"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesChart } from "@/components/sales-chart"
import { TopProductsChart } from "@/components/top-products-chart"
import { PaymentMethodsChart } from "@/components/payment-methods-chart"
import { CountrySalesChart } from "@/components/country-sales-chart"
import type { SalesData } from "@/lib/types"
import {
  calculateTotalSales,
  calculateTotalTransactions,
  calculateAverageTicket,
  getTopProducts,
  getSalesByMonth,
  getPaymentMethodDistribution,
  getSalesByCountry,
} from "@/lib/analytics"

interface DashboardProps {
  data: SalesData[]
}

export function Dashboard({ data }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  const filteredData = useMemo(() => {
    if (selectedMonth === "all") return data
    return data.filter((item) => {
      const month = new Date(item.fecha).getMonth() + 1
      return month.toString() === selectedMonth
    })
  }, [data, selectedMonth])

  const totalSales = calculateTotalSales(filteredData)
  const totalTransactions = calculateTotalTransactions(filteredData)
  const averageTicket = calculateAverageTicket(filteredData)
  const topProducts = getTopProducts(filteredData, 5)
  const salesByMonth = getSalesByMonth(data)
  const paymentMethods = getPaymentMethodDistribution(filteredData)
  const salesByCountry = getSalesByCountry(filteredData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Dashboard de Ventas</h2>
          <p className="text-sm text-muted-foreground">Análisis completo del rendimiento de TechTrends</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los meses</SelectItem>
            <SelectItem value="1">Enero</SelectItem>
            <SelectItem value="2">Febrero</SelectItem>
            <SelectItem value="3">Marzo</SelectItem>
            <SelectItem value="4">Abril</SelectItem>
            <SelectItem value="5">Mayo</SelectItem>
            <SelectItem value="6">Junio</SelectItem>
            <SelectItem value="7">Julio</SelectItem>
            <SelectItem value="8">Agosto</SelectItem>
            <SelectItem value="9">Septiembre</SelectItem>
            <SelectItem value="10">Octubre</SelectItem>
            <SelectItem value="11">Noviembre</SelectItem>
            <SelectItem value="12">Diciembre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ventas Totales</CardDescription>
            <CardTitle className="text-3xl">${totalSales.toLocaleString("es-MX")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ingresos totales del período seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Transacciones</CardDescription>
            <CardTitle className="text-3xl">{totalTransactions.toLocaleString("es-MX")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Número total de transacciones realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ticket Promedio</CardDescription>
            <CardTitle className="text-3xl">${averageTicket.toLocaleString("es-MX")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Valor promedio por transacción</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesByMonth} />
        <TopProductsChart data={topProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsChart data={paymentMethods} />
        <CountrySalesChart data={salesByCountry} />
      </div>
    </div>
  )
}
