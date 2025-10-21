"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Database } from "lucide-react";
import axios from "axios";
import formatText from "@/utils/common_functions";
import { ClipLoader } from "react-spinners";

export function Sidebar({ onSelectDataset }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categoriesByParentId, setCategoriesByParentId] = useState<Map<string, Category[]>>(new Map());
  const [datasetsByParentId, setDatasetsByParentId] = useState<Map<string, Dataset[]>>(new Map());
  const [loadingDatasetId, setLoadingDatasetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);

  // Fetch categories and datasets for a given parentId
  const fetchCategoriesAndDatasets = async (parentId: string = "") => {
    try {
      const url =
        parentId === ""
          ? `${process.env.NEXT_PUBLIC_API_URL}/categories`
          : `${process.env.NEXT_PUBLIC_API_URL}/categories?id=${parentId}`;

      const response = await axios.get<YearBasedData>(url, {
        headers: { "Content-Type": "application/json" },
      });

      const { categories, datasets } = response.data;

      setCategoriesByParentId((prev) => {
        const newMap = new Map(prev);
        newMap.set(parentId, categories);
        return newMap;
      });

      if (Object.keys(datasets).length !== 0) {
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

  // When dataset is clicked
  const handleDatasetClick = async (
    datasetId: string,
    datasetNameCode: string,
    datasetParentId: string,
    datasetYear?: string
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

      // Add year information to the dataset
      const datasetWithYear = {
        ...response.data,
        year: datasetYear
      };

      console.log(datasetWithYear)

      onSelectDataset(datasetWithYear);
    } catch (e) {
      console.error("Failed to fetch dataset:", e);
    } finally {
      setLoadingDatasetId(null);
    }
  };

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      await fetchCategoriesAndDatasets();
      setInitialLoading(false);
    };

    fetchData();
  }, []);

  // Toggle expansion of a category
  const toggleCategory = async (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);

    if (expandedCategories.has(categoryId)) {
      newExpanded.delete(categoryId);
      setExpandedCategories(newExpanded);
    } else {
      newExpanded.add(categoryId);
      setLoadingCategoryId(categoryId);

      if (!categoriesByParentId.has(categoryId)) {
        await fetchCategoriesAndDatasets(categoryId);
      }

      setExpandedCategories(newExpanded);
      setLoadingCategoryId(null);
    }
  };

  // Recursive rendering of categories and datasets
  const renderCategories = (parentId: string = "", level: number = 0) => {
    const categories = categoriesByParentId.get(parentId) || [];
    const datasets = datasetsByParentId.get(parentId) || [];

    return (
      <div className="space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const isLoading = loadingCategoryId === category.id;

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center gap-2 text-start px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground`}
                style={{ paddingLeft: `${level * 1.25 + 1}rem` }}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                />
                <span className="text-sm font-medium">
                  {formatText({ name: category.name })}
                </span>

                {isLoading && (
                  <div className="ml-2 w-3 h-3 border-2 border-t-transparent border-sidebar-foreground rounded-full animate-spin" />
                )}
              </button>

              {isExpanded && (
                <div>{renderCategories(category.id, level + 1)}</div>
              )}
            </div>
          );
        })}

        {datasets.map((dataset) => {
          const isLoadingDataset = loadingDatasetId === dataset.id;
          // Extract year from dataset ID (assuming format like "cat_a046794d1f_attr_367c1f457e_2022_cat_a046794d1f")
          const yearMatch = dataset.id.match(/_(\d{4})_/);
          const datasetYear = yearMatch ? yearMatch[1] : undefined;

          return (
            <button
              key={dataset.id}
              onClick={() =>
                handleDatasetClick(dataset.id, dataset.name, dataset.parentId, datasetYear)
              }
              className={`w-full text-left px-3 py-2 hover:cursor-pointer rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground ${
                isLoadingDataset ? "opacity-50 pointer-events-none" : ""
              }`}
              style={{ paddingLeft: `${(level + 1) * 1.25 + 1}rem` }}
            >
              {isLoadingDataset ? "Loading..." : dataset.nameExact || dataset.name}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-2/9 bg-sidebar border-r border-sidebar-border overflow-y-auto h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0">
        <h2 className="text-lg font-bold text-sidebar-foreground flex items-center gap-2">
          <Database className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">XploreData</span>
        </h2>
      </div>

      {/* Search */}
      <input
        placeholder="Search datasets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="m-2 p-2 rounded-sm border-2"
      />

      {/* Body */}
      {initialLoading ? (
        <div className="w-full flex justify-center mt-10">
          <ClipLoader />
        </div>
      ) : (
        <div className="p-2 flex-1 overflow-y-auto">{renderCategories()}</div>
      )}
    </div>
  );
}
