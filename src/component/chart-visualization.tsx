"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartVisualizationProps {
  columns: string[];
  rows: (string | number)[][];
}

const COLORS = [
  "#FFA500",
  "#FF8C00",
  "#FF7F50",
  "#FFB347",
  "#FFAA33",
  "#FFC04C",
  "#FFD580",
];

export function ChartVisualization({ columns, rows }: ChartVisualizationProps) {
  const [xAxis, setXAxis] = useState<string>("district"); // Default to district if exists
  const [selectedYColumns, setSelectedYColumns] = useState<string[]>([]);

  // Determine which columns are numeric or string
  const { stringColumns, numericColumns } = useMemo(() => {
    
    setSelectedYColumns([])
    const stringCols: string[] = [];
    const numericCols: string[] = [];

    columns.forEach((col, idx) => {
      const isNumeric = rows.some((row) => {
        const val = row[idx];
        return (
          typeof val === "number" ||
          (!isNaN(Number(val)) && val !== null && val !== "")
        );
      });
      if (isNumeric) numericCols.push(col);
      else stringCols.push(col);
    });

    return { stringColumns: stringCols, numericColumns: numericCols };
  }, [columns, rows]);

  // Build chart data dynamically
  const chartData = useMemo(() => {
    if (!xAxis || selectedYColumns.length === 0) return [];

    const xIndex = columns.indexOf(xAxis);
    const yIndexes = selectedYColumns.map((col) => columns.indexOf(col));

    return rows.map((row) => {
      const obj: Record<string, any> = {};
      obj[xAxis] = row[xIndex];
      yIndexes.forEach((yIdx, i) => {
        obj[selectedYColumns[i]] = Number(row[yIdx]) || 0;
      });
      return obj;
    });
  }, [columns, rows, xAxis, selectedYColumns]);

  return (
    <div className="space-y-6 w-full">
      {/* Controls */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h3 className="text-sm font-semibold mb-2">Select Chart Data</h3>

        {/* X-axis selector */}
        <div>
          <label className="text-sm font-medium">X-Axis (Category):</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-background"
          >
            <option value="">Select column</option>
            {stringColumns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Y-axis (multiple) */}
        <div>
          <label className="text-sm font-medium">Y-Axis (Values):</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
            {numericColumns.map((col) => (
              <label key={col} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedYColumns.includes(col)}
                  onChange={(e) => {
                    setSelectedYColumns((prev) =>
                      e.target.checked
                        ? [...prev, col]
                        : prev.filter((c) => c !== col)
                    );
                  }}
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-4">Bar Chart</h3>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={xAxis} stroke="var(--foreground)" />
              <YAxis stroke="var(--foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />

              {selectedYColumns.map((col, i) => (
                <Bar
                  key={col}
                  dataKey={col}
                  fill={COLORS[i % COLORS.length]}
                  stackId="a" // remove this for grouped bars
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Select X and Y columns to generate the chart.
          </p>
        )}
      </div>
    </div>
  );
}
