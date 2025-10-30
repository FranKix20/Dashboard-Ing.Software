"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cleanData, validateData } from "@/lib/data-utils"
import type { SalesData, ValidationResult } from "@/lib/types"

interface DataCleaningProps {
  rawData: string[][]
  onDataCleaned: (data: SalesData[]) => void
}

export function DataCleaning({ rawData, onDataCleaned }: DataCleaningProps) {
  const [cleanedData, setCleanedData] = useState<SalesData[]>([])
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
    cleaned: 0,
  })

  useEffect(() => {
    if (rawData.length > 0) {
      processData()
    }
  }, [rawData])

  const processData = () => {
    setIsProcessing(true)

    try {
      // Limpiar datos
      const cleaned = cleanData(rawData)
      setCleanedData(cleaned)

      // Validar datos
      const validation = validateData(cleaned)
      setValidationResults(validation)

      // Calcular estadísticas
      const validCount = validation.filter((v) => v.isValid).length
      const invalidCount = validation.length - validCount

      setStats({
        total: rawData.length - 1, // Excluir encabezado
        valid: validCount,
        invalid: invalidCount,
        cleaned: cleaned.length,
      })
    } catch (error) {
      console.error("Error al procesar datos:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    const validData = cleanedData.filter((_, index) => validationResults[index]?.isValid)
    onDataCleaned(validData)
  }

  const validPercentage = stats.total > 0 ? ((stats.valid / stats.total) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Limpieza y Validación de Datos</CardTitle>
          <CardDescription>Proceso automático de limpieza, normalización y validación de datos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isProcessing ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Procesando datos...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Registros</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Registros Válidos</p>
                  <p className="text-2xl font-bold text-accent">{stats.valid}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Registros Inválidos</p>
                  <p className="text-2xl font-bold text-destructive">{stats.invalid}</p>
                </div>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Tasa de Validez</p>
                  <p className="text-2xl font-bold text-foreground">{validPercentage}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Procesos de Limpieza Aplicados:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Eliminación de espacios extra</Badge>
                  <Badge variant="secondary">Normalización de tildes</Badge>
                  <Badge variant="secondary">Limpieza de caracteres especiales</Badge>
                  <Badge variant="secondary">Validación de formatos de fecha</Badge>
                  <Badge variant="secondary">Validación de números</Badge>
                  <Badge variant="secondary">Normalización de texto</Badge>
                </div>
              </div>

              {stats.invalid > 0 && (
                <Alert>
                  <AlertDescription>
                    Se encontraron {stats.invalid} registros con problemas. Estos serán excluidos del análisis. Revisa
                    los datos originales si necesitas corregirlos manualmente.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-medium text-sm mb-3">Vista Previa de Datos Limpios:</h4>
                <div className="space-y-2">
                  {cleanedData.slice(0, 5).map((row, index) => (
                    <div key={index} className="bg-background p-3 rounded text-xs font-mono flex items-center gap-2">
                      {validationResults[index]?.isValid ? (
                        <Badge variant="default" className="shrink-0">
                          ✓
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0">
                          ✗
                        </Badge>
                      )}
                      <span className="truncate">
                        {row.id_transaccion} | {row.fecha} | {row.nombre_producto} | ${row.total_venta}
                      </span>
                    </div>
                  ))}
                  {cleanedData.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      ... y {cleanedData.length - 5} registros más
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={handleContinue} className="w-full" size="lg" disabled={stats.valid === 0}>
                Continuar al Dashboard ({stats.valid} registros válidos)
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
