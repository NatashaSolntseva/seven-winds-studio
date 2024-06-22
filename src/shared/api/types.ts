export interface InitialRowData {
  id: number;
  rowName: string;
  total: number;
  salary: number;
  mimExploitation: number;
  machineOperatorSalary: number;
  materials: number;
  mainCosts: number;
  supportCosts: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  child: InitialRowData[];
}

export interface RowData extends InitialRowData {
  editing: boolean;
  childCounter: number;
  lastChildCount: number;
  parentId?: number | null;
  child: RowData[];
}

export interface NewNodeDataAPI
  extends Omit<
    RowData,
    "id" | "total" | "child" | "editing" | "childCounter" | "lastChildCount"
  > {}
