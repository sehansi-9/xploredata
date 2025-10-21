"use client";

import { ChartVisualization } from "./chart-visualization";
import { DataTable } from "./data-table";
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export function DatasetView({ data }: DatasetViewProps) {
  const dataset = data;

  const [loadingDatasetId, setLoadingDatasetId] = useState<string | null>(null);
  const [selectDataset, onSelectDataset] = useState<DatasetData | null>(null);

  useEffect(() => {
    if (!dataset) return;
    const fetchData = async () => {
      try {
        setLoadingDatasetId(dataset.id);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/data/attribute/${dataset.parentId}`,

          {
            nameCode: dataset.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        onSelectDataset(response.data);
      } catch (e) {
        console.error("Failed to fetch dataset : ", e);
      } finally {
        setLoadingDatasetId(null);
      }
    };
    fetchData();
  }, [dataset]);

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 italic">Dataset not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 w-full">
      {/* Dataset Info */}
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-bold text-balance">
          {selectDataset?.attributeName}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold">Published By :</span>{" "}
            {dataset.source}
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-4 shadow-sm">
        <div className="overflow-x-auto">
          {loadingDatasetId ? (
            <div className="flex justify-center items-center h-48">
              <ClipLoader size={25} color="#3B82F6" />
            </div>
          ) : (
            selectDataset && (
              <DataTable
                columns={selectDataset?.columns}
                rows={selectDataset?.rows}
                title={selectDataset?.attributeName}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
