"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as XLSX from "xlsx"

interface FileUploadProps {
  onDataUploaded: (data: string[][]) => void
}

export function FileUpload({ onDataUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Por favor, selecciona un archivo Excel válido (.xlsx o .xls)")
        setFile(null)
      }
    }
  }

  const processExcelFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError("")

    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

      // Obtener el rango de datos
      const range = XLSX.utils.decode_range(firstSheet["!ref"] || "A1")
      const data: string[][] = []

      // Leer datos columna por columna (asumiendo que están en la columna B)
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 1 }) // Columna B (índice 1)
        const cell = firstSheet[cellAddress]

        if (cell && cell.v) {
          // Dividir por comas para obtener los campos individuales
          const rowData = String(cell.v)
            .split(",")
            .map((item) => item.trim())
          data.push(rowData)
        }
      }

      if (data.length === 0) {
        setError("El archivo no contiene datos válidos")
        return
      }

      onDataUploaded(data)
    } catch (err) {
      setError("Error al procesar el archivo. Verifica que el formato sea correcto.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar Archivo de Ventas</CardTitle>
        <CardDescription>
          Sube tu archivo Excel con los datos de ventas. Los datos deben estar en una sola columna separados por comas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 hover:border-accent transition-colors">
          <svg className="h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mb-2">
            Seleccionar Archivo Excel
          </Button>
          {file && (
            <p className="text-sm text-muted-foreground mt-2">
              Archivo seleccionado: <span className="font-medium text-foreground">{file.name}</span>
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Formato esperado:</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Los datos deben estar en una sola columna (columna B) con cada fila conteniendo:
          </p>
          <code className="text-xs bg-background p-2 rounded block">
            ID_Transaccion,Fecha,ID_Producto,Nombre_Producto,Categoria,Cantidad,Precio_Unitario,Total_Venta,Pais,Metodo_Pago
          </code>
        </div>

        <Button onClick={processExcelFile} disabled={!file || isProcessing} className="w-full" size="lg">
          {isProcessing ? "Procesando..." : "Procesar Archivo"}
        </Button>
      </CardContent>
    </Card>
  )
}
