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
            {numericColumns.filter((col) => col !== "id").map((col) => (
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
          <div className="space-y-4">
            {/* Fixed Legend */}
            <div className="flex justify-center items-center gap-4 flex-wrap pb-2 border-b border-border">
              {selectedYColumns.map((col, i) => (
                <div key={col} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                  <span className="text-sm">{col}</span>
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Y-axis sticky labels */}
              <div
                className="flex-shrink-0"
                style={{
                  width: 60,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 430,
                  position: "sticky",
                  left: 0,
                  backgroundColor: "var(--card)",
                  zIndex: 10,
                  borderRight: "1px solid var(--border)",
                  marginBottom: 60,
                }}
              >
  
                {Array.from({ length: 5 }).map((_, i) => {
                  const maxVal = Math.max(
                    ...chartData.flatMap((d) =>
                      selectedYColumns.map((col) => d[col])
                    )
                  );
                
                  const niceDomain = Math.ceil(maxVal / 5) * 5;
                  const tickVal = Math.round((niceDomain / 4) * (4 - i));
                  return (
                    <div key={i} className="text-sm text-right pr-1">
                      {tickVal}
                    </div>
                  );
                })}
              </div>

              {/* Scrollable chart */}
              <div className="overflow-x-auto flex-1">
                <div
                  style={{
                    minWidth: `${chartData.length * 80}px`,
                    height: 480,
                    overflow: "hidden"
                  }}
                >
                  <BarChart
                    data={chartData}
                    width={chartData.length * 80}
                    height={450}
                    margin={{ left: 0, bottom: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey={xAxis}
                      stroke="var(--foreground)"
                      tick={{ fontSize: 13 }}
                      tickFormatter={(value) => {
                        if (value.length > 10) {
                          return value.slice(0, 10) + "...";
                        }
                        return value;
                      }}
                    />
                    <YAxis hide domain={[0, (dataMax: number) => Math.ceil(dataMax / 5) * 5]} ticks={(() => {
                      const maxVal = Math.max(
                        ...chartData.flatMap((d) =>
                          selectedYColumns.map((col) => d[col])
                        )
                      );
                      const niceDomain = Math.ceil(maxVal / 5) * 5;
                      return [0, niceDomain * 0.25, niceDomain * 0.5, niceDomain * 0.75, niceDomain];
                    })()} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                      }}
                    />
                    {selectedYColumns.map((col, i) => (
                      <Bar
                        key={col}
                        dataKey={col}
                        fill={COLORS[i % COLORS.length]}
                        stackId="a"
                      />
                    ))}
                  </BarChart>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Select X and Y columns to generate the chart.
          </p>
        )}
      </div>
    </div>
  );
}
