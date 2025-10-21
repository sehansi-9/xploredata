"use client"

import { ChartVisualization } from "./chart-visualization"
import { DataTable } from "./data-table"
import { ExportButton } from "./export-button"
import { useEffect, useMemo, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"

export function DatasetView({ data, availableYears = [], onYearChange, onComparisonChange }: DatasetViewProps) {
  const dataset = data;
  const [selectedYear, setSelectedYear] = useState<string>(dataset.year || "");
  const [showYearDropdown, setShowYearDropdown] = useState<boolean>(false);
  const [showComparisonDropdown, setShowComparisonDropdown] = useState<boolean>(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const comparisonDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (comparisonDropdownRef.current && !comparisonDropdownRef.current.contains(event.target as Node)) {
        setShowComparisonDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log(data)

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 italic">Dataset not found</p>
      </div>
    )
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    onYearChange?.(year);
    setShowYearDropdown(false);
  };

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

      {/* Year Selection Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Year Selection Dropdown */}
        <div className="relative" ref={yearDropdownRef}>
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>{selectedYear || "Select Year"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showYearDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visualization Card */}
      {/* <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Visualizations</h3>
        </div>
        <div className="overflow-x-auto text-gray-500 text-sm italic">
          <ChartVisualization columns={dataset.columns} rows={dataset.rows} />
        </div>
      </div> */}

      {/* Data Table Card */}
      <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <DataTable
            columns={dataset.columns}
            rows={dataset.rows}
            title={dataset.attributeName}
          />
        </div>
      </div>
    </div>
  )
}
