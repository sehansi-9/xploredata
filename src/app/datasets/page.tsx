"use client";

import { DatasetView } from "@/component/dataset-view";
import { Sidebar } from "@/component/sidebar";
import {useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetWithYear | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch available years when component mounts
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get<YearBasedData>(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        
        if (response.data.datasets) {
          const years = Object.keys(response.data.datasets).sort();
          setAvailableYears(years);
          console.log(years)
        }
      } catch (error) {
        console.error("Failed to fetch available years:", error);
      }
    };

    fetchAvailableYears();
  }, []);

  const handleYearChange = (year: string) => {
    // Handle year change logic here
    console.log("Year changed to:", year);
  };

  const handleComparisonChange = (year1: string, year2: string) => {
    // Handle comparison logic here
    console.log("Comparing years:", year1, "vs", year2);
  };

  console.log('selected data set :', selectedDataset)

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar onSelectDataset={setSelectedDataset} />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="flex-1 overflow-auto">
            {selectedDataset ? (
              <DatasetView 
                data={selectedDataset} 
                availableYears={availableYears}
                onYearChange={handleYearChange}
                onComparisonChange={handleComparisonChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <p className="text-muted-foreground text-center">
                  Select a dataset from the sidebar to view data
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
