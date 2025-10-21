"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import { Button, TextField } from "@radix-ui/themes"
import formatText from "@/utils/common_functions"

interface DataTableProps {
  columns: string[]
  rows: (string | number)[][]
  title?: string
}

type SortDirection = "asc" | "desc" | null

export function DataTable({ columns, rows, title }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredRows = useMemo(() => {
  const safeRows = rows ?? []
  if (!searchTerm) return safeRows
  return safeRows.filter((row) =>
    row.some((cell) =>
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
}, [rows, searchTerm])



  const sortedRows = useMemo(() => {
    if (sortColumn === null || sortDirection === null) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [filteredRows, sortColumn, sortDirection])

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedRows.slice(start, start + itemsPerPage)
  }, [sortedRows, currentPage])

  const totalPages = Math.ceil(sortedRows.length / itemsPerPage)

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnIndex)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4 w-full">
      {/* Title */}
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-gray-500" />
        <TextField.Root
          placeholder="Search table..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              {columns.map((column, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort(index)}
                    className="flex items-center gap-2 font-semibold hover:text-orange-600 transition-colors whitespace-nowrap"
                  >
                    {formatText({name: column})}
                    {sortColumn === index &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      ))}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {paginatedRows.length > 0
            ? (currentPage - 1) * itemsPerPage + 1
            : 0}{" "}
          to {Math.min(currentPage * itemsPerPage, sortedRows.length)} of{" "}
          {sortedRows.length} results
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="1"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="1"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
