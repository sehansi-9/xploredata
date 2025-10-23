"use client";
/* eslint-disable */

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import formatText from "@/utils/common_functions";

interface ChartVisualizationProps {
  columns: string[];
  rows: (string | number)[][];
}

const COLORS = [
  "#004c99", "#0066cc", "#007bff", "#3399ff",
  "#66b2ff", "#99ccff", "#cce5ff",
];

export function ChartVisualization({ columns, rows }: ChartVisualizationProps) {
  const [xAxis, setXAxis] = useState<string>("district");
  const [selectedYColumns, setSelectedYColumns] = useState<string[]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [stringColumns, setStringColumns] = useState<string[]>([]);

  useEffect(() => {
    const stringCols: string[] = [];
    const numericCols: string[] = [];

    if (!rows || rows.length === 0 || !columns.length) {
      setNumericColumns([]);
      setStringColumns([]);
      return;
    }

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

    setNumericColumns(numericCols);
    setStringColumns(stringCols);
    setSelectedYColumns([]);
  }, [columns, rows]);

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
    <>
      {numericColumns.length > 0 && !(numericColumns.length === 1 && numericColumns[0].toLowerCase() === "id") && (
        <div className="space-y-6 w-full">
          {/* Controls */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold">Visualizations</h3>
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
                {numericColumns
                  .filter((col) => col !== "id" && col !== "total")
                  .map((col) => (
                    <label
                      key={col}
                      className="flex items-start space-x-2 text-sm break-words"
                    >
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
                      <span className="break-words max-w-[220px]">
                        {formatText({ name: col })}
                      </span>
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
                      <span className="text-sm">{formatText({name: col})}</span>
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
                      height: 425,
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
                        <div key={i} className="text-xs text-right pr-1">
                          {tickVal}
                        </div>
                      );
                    })}
                  </div>

                  {/* Scrollable chart */}
                  <div className="overflow-x-auto flex-1">
                    <div
                      style={{
                        minWidth: `${chartData.length * 100}px`,
                        height: 455,
                        overflow: "hidden",
                      }}
                    >
                      <div className="overflow-x-auto flex-1">
                        <div
                          style={{
                            minWidth: `${chartData.length * 100}px`,
                            width: Math.max(chartData.length * 100, 1000),
                            height: 450,
                            overflow: "hidden",
                          }}
                        >
                          <BarChart
                            data={chartData}
                            width={Math.max(chartData.length * 100, 1000)}
                            height={450}
                            margin={{ left: 0, bottom: -60 }}
                            barCategoryGap="30%"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

                            <XAxis
                              dataKey={xAxis}
                              stroke="var(--foreground)"
                              interval={0}
                              height={85}
                              tickLine={false}
                              axisLine={{ stroke: "var(--border)" }}
                              tick={({ x, y, payload }) => {
                                const maxCharsPerLine = 15;
                                const text = payload.value;
                                let line1 = text;
                                let line2 = "";

                                if (text.length > maxCharsPerLine) {
                                  const splitIndex = text.lastIndexOf(" ", maxCharsPerLine);
                                  if (splitIndex > 0) {
                                    line1 = text.slice(0, splitIndex);
                                    line2 = text.slice(splitIndex + 1);
                                  } else {
                                    line1 = text.slice(0, maxCharsPerLine);
                                    line2 = text.slice(maxCharsPerLine);
                                  }
                                }

                                return (
                                  <g transform={`translate(${x},${y + 2.5})`}>
                                    <text
                                      x={0}
                                      y={0}
                                      textAnchor="middle"
                                      fontSize={11.5}
                                      fill="var(--foreground)"
                                    >
                                      {line1}
                                    </text>
                                    {line2 && (
                                      <text
                                        x={0}
                                        y={12}
                                        textAnchor="middle"
                                        fontSize={11.5}
                                        fill="var(--foreground)"
                                      >
                                        {line2}
                                      </text>
                                    )}
                                  </g>
                                );
                              }}
                            />

                            <YAxis
                              hide
                              domain={[0, (dataMax: number) => Math.ceil(dataMax / 5) * 5]}
                              ticks={(() => {
                                const maxVal = Math.max(
                                  ...chartData.flatMap((d) => selectedYColumns.map((col) => d[col]))
                                );
                                const niceDomain = Math.ceil(maxVal / 5) * 5;
                                return [
                                  0,
                                  niceDomain * 0.25,
                                  niceDomain * 0.5,
                                  niceDomain * 0.75,
                                  niceDomain,
                                ];
                              })()}
                            />

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
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                Select X and Y columns to generate the chart.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
