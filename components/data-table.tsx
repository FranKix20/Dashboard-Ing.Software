"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SalesData } from "@/lib/types"

interface DataTableProps {
  data: SalesData[]
}

export function DataTable({ data }: DataTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map((item) => item.categoria)))
    return uniqueCategories.sort()
  }, [data])

  // Filtrar datos por categoría y búsqueda
  const filteredData = useMemo(() => {
    let filtered = data

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.categoria === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pais.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filtered
  }, [data, selectedCategory, searchTerm])

  // Ordenar por categoría y fecha
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      // Primero ordenar por categoría
      const categoryCompare = a.categoria.localeCompare(b.categoria)
      if (categoryCompare !== 0) return categoryCompare
      // Luego por fecha
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    })
  }, [filteredData])

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  // Resetear página cuando cambian los filtros
  useMemo(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Datos</CardTitle>
        <CardDescription>Visualiza y filtra todos los registros de ventas organizados por categoría</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por producto, ID o país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información de resultados */}
        <div className="text-sm text-muted-foreground">
          Mostrando {paginatedData.length} de {sortedData.length} registros
          {selectedCategory !== "all" && ` en categoría: ${selectedCategory}`}
        </div>

        {/* Tabla */}
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Producto</th>
                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                <th className="px-4 py-3 text-right font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Precio Unit.</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">País</th>
                <th className="px-4 py-3 text-left font-medium">Método Pago</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron registros
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id_transaccion} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    <td className="px-4 py-3 font-mono text-xs">{item.id_transaccion}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.fecha}</td>
                    <td className="px-4 py-3">{item.nombre_producto}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{item.cantidad}</td>
                    <td className="px-4 py-3 text-right">${item.precio_unitario.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium">${item.total_venta.toFixed(2)}</td>
                    <td className="px-4 py-3">{item.pais}</td>
                    <td className="px-4 py-3">{item.metodo_pago}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
