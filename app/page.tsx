"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { DataCleaning } from "@/components/data-cleaning"
import { Dashboard } from "@/components/dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SalesData } from "@/lib/types"

export default function Page() {
  const [rawData, setRawData] = useState<string[][]>([])
  const [cleanedData, setCleanedData] = useState<SalesData[]>([])
  const [activeTab, setActiveTab] = useState("upload")

  const handleDataUploaded = (data: string[][]) => {
    setRawData(data)
    setActiveTab("cleaning")
  }

  const handleDataCleaned = (data: SalesData[]) => {
    setCleanedData(data)
    setActiveTab("dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <svg className="h-6 w-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">TechTrends Analytics</h1>
              <p className="text-sm text-muted-foreground">Dashboard de Análisis de Ventas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upload">1. Cargar Datos</TabsTrigger>
            <TabsTrigger value="cleaning" disabled={rawData.length === 0}>
              2. Limpieza de Datos
            </TabsTrigger>
            <TabsTrigger value="dashboard" disabled={cleanedData.length === 0}>
              3. Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUpload onDataUploaded={handleDataUploaded} />
          </TabsContent>

          <TabsContent value="cleaning">
            <DataCleaning rawData={rawData} onDataCleaned={handleDataCleaned} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard data={cleanedData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
