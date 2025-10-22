"use client"

import { ChartVisualization } from "./chart-visualization"
import { DataTable } from "./data-table"
import { ExportButton } from "./export-button"
import { useEffect, useMemo } from "react"

export function DatasetView({ data }: DatasetViewProps) {
  const dataset = data;

  console.log(data)

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 italic">Dataset not found</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* Dataset Info */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">{dataset.attributeName}</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Published By :</span> {dataset.source}
          </p>
        </div>
      </div>

      {/* Visualization Card */}
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Visualizations</h3>
        </div>
        <div className="overflow-x-auto text-gray-500 text-sm italic">
          <ChartVisualization columns={dataset.columns} rows={dataset.rows} />
        </div>
      </div>

      {/* Data Table Card */}
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-4 gap-4">
          <ExportButton
            columns={dataset.columns}
            rows={dataset.rows}
            filename={dataset.attributeName}
          />
        </div>
        <div className="overflow-x-auto">
          <DataTable
            columns={dataset.columns}
            rows={dataset.rows}
            title={dataset.title}
          />
        </div>
      </div>
    </div>
  )
}
