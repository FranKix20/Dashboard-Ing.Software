"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesChart } from "@/components/sales-chart"
import { TopProductsChart } from "@/components/top-products-chart"
import { PaymentMethodsChart } from "@/components/payment-methods-chart"
import { CountrySalesChart } from "@/components/country-sales-chart"
import { TrendingUp, ShoppingCart, DollarSign, Activity } from "lucide-react"
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
      <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-2 border-accent/20">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-accent" />
            Dashboard de Ventas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Análisis completo del rendimiento de TechTrends</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48 border-2 hover:border-accent/50 transition-colors">
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
        <Card className="border-2 hover:border-accent/30 transition-all hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Ventas Totales</CardDescription>
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
              ${totalSales.toLocaleString("es-MX")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Ingresos totales del período seleccionado
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-chart-2/30 transition-all hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Transacciones</CardDescription>
              <div className="h-10 w-10 rounded-full bg-chart-2/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-chart-2" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-2/70 bg-clip-text text-transparent">
              {totalTransactions.toLocaleString("es-MX")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Número total de transacciones realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-chart-3/30 transition-all hover:shadow-lg hover:scale-[1.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Ticket Promedio</CardDescription>
              <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-chart-3/70 bg-clip-text text-transparent">
              ${averageTicket.toLocaleString("es-MX")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Valor promedio por transacción
            </p>
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
