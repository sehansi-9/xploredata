
interface Kind {
  major: string;
  minor: string;
}

interface Category {
  id: string;
  name: string;
  create: string;
  nameExact: string;
  kind: Kind;
  terminate: string;
}

interface Dataset {
  id: string;
  name: string;
  nameExact: string;
  created: string;
  terminated: string;
  parentId: string;
  source: string;
  kind: Kind;
}

interface SidebarProps {
  onSelectDataset: (dataset: Dataset) => void;
}

interface FetchedData {
  categories: Category[];
  datasets?: Record<string, Dataset[]>;
}

interface DatasetViewProps {
  data: Dataset
}

