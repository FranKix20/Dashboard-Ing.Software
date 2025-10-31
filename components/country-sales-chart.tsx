"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CountrySalesChartProps {
  data: Array<{ country: string; total: number; transactions: number }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-chart-3/20 rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-sm font-semibold text-foreground mb-2">{payload[0].payload.country}</p>
        <div className="space-y-1">
          <p className="text-lg font-bold text-chart-3">
            ${payload[0].value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.transactions} transacciones</p>
        </div>
      </div>
    )
  }
  return null
}

export function CountrySalesChart({ data }: CountrySalesChartProps) {
  return (
    <Card className="border-2 hover:border-chart-3/30 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
          <CardTitle className="text-xl">Ventas por País</CardTitle>
        </div>
        <CardDescription>Distribución geográfica de las ventas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCountry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={1} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="country"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--chart-3))", opacity: 0.1 }} />
            <Bar dataKey="total" fill="url(#colorCountry)" radius={[8, 8, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
