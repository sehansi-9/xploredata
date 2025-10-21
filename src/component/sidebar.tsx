"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Database } from "lucide-react";
import axios from "axios";
import formatText from "@/utils/common_functions";

export function Sidebar({ onSelectDataset }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [categoriesByParentId, setCategoriesByParentId] = useState<
    Map<string, Category[]>
  >(new Map());
  const [datasetsByParentId, setDatasetsByParentId] = useState<
    Map<string, Dataset[]>
  >(new Map());
  const [loadingDatasetId, setLoadingDatasetId] = useState<string | null>(null);

  const fetchCategoriesAndDatasets = async (parentId: string = "") => {
    try {
      const url =
        parentId === ""
          ? `${process.env.NEXT_PUBLIC_API_URL}/categories`
          : `${process.env.NEXT_PUBLIC_API_URL}/categories?id=${parentId}`;

      const response = await axios.get<FetchedData>(url, {
        headers: { "Content-Type": "application/json" },
      });

      const { categories, datasets } = response.data;

      setCategoriesByParentId((prev) => {
        const newMap = new Map(prev);
        newMap.set(parentId, categories);
        return newMap;
      });

      if (datasets) {
        const allDatasets = Object.values(datasets).flat();
        setDatasetsByParentId((prev) => {
          const newMap = new Map(prev);
          newMap.set(parentId, allDatasets);
          return newMap;
        });
      }
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  const handleDatasetClick = async (
    datasetId: string,
    datasetNameCode: string,
    datasetParentId: string
  ) => {
    try {
      setLoadingDatasetId(datasetId);
      const response = await axios.post<Dataset>(
        `${process.env.NEXT_PUBLIC_API_URL}/data/attribute/${datasetParentId}`,
        {
          nameCode: datasetNameCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("clicked ");
      console.log(response.data);
      onSelectDataset(response.data);
    } catch (e) {
      console.error("Failed to fetch dataset:", e);
    } finally {
      setLoadingDatasetId(null);
    }
  };

  useEffect(() => {
    fetchCategoriesAndDatasets();
  }, []);

  const toggleCategory = async (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);

    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);

      if (!categoriesByParentId.has(categoryId)) {
        await fetchCategoriesAndDatasets(categoryId);
      }
    }

    setExpandedCategories(newExpanded);
  };

  //categories and datasets
  const renderCategories = (parentId: string = "", level: number = 0) => {
    const categories = categoriesByParentId.get(parentId) || [];
    const datasets = datasetsByParentId.get(parentId) || [];

    return (
      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full flex items-center gap-2 text-start px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground`}
              style={{ paddingLeft: `${level * 1.25 + 1}rem` }}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedCategories.has(category.id)
                    ? "rotate-0"
                    : "-rotate-90"
                }`}
              />
              <span className="text-sm font-medium">
                {formatText({ name: category.name })}
              </span>
            </button>

            {expandedCategories.has(category.id) && (
              <div>{renderCategories(category.id, level + 1)}</div>
            )}
          </div>
        ))}

        {datasets.map((dataset) => (
          <button
            key={dataset.id}
            onClick={() =>
              handleDatasetClick(dataset.id, dataset.name, dataset.parentId)
            }
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground ${
              loadingDatasetId === dataset.id
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            style={{ paddingLeft: `${(level + 1) * 1.25 + 1}rem` }}
          >
            {loadingDatasetId === dataset.id
              ? "Loading..."
              : dataset.nameExact || dataset.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-2/9 bg-sidebar border-r border-sidebar-border overflow-y-auto h-full flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <h2 className="text-lg font-bold text-sidebar-foreground flex items-center gap-2">
          <Database className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">XploreData</span>
        </h2>
      </div>

      <div className="p-2 flex-1 overflow-y-auto">{renderCategories()}</div>
    </div>
  );
}
