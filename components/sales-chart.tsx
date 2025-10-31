"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesChartProps {
  data: Array<{ month: string; total: number }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg shadow-xl p-3 z-50">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{payload[0].payload.month}</p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
          ${payload[0].value.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ventas totales</p>
      </div>
    )
  }
  return null
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <Card className="border-2 hover:border-blue-400 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <CardTitle className="text-xl">Ventas Mensuales</CardTitle>
        </div>
        <CardDescription>Tendencia de ventas a lo largo del tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#3b82f6", strokeWidth: 2 }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                fill: "#3b82f6",
                r: 6,
                strokeWidth: 2,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 8,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
              animationDuration={1500}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
