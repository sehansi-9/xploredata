"use client";

import { DatasetView } from "@/component/dataset-view";
import { Sidebar } from "@/component/sidebar";
import {useState } from "react";

export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        <Sidebar onSelectDataset={setSelectedDataset} />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <div className="flex-1 overflow-auto">
            {selectedDataset ? (
              <DatasetView datasetId={selectedDataset} />
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
