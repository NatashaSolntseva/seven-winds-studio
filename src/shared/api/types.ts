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
  editing?: boolean;
  childCounter?: number;
  lastChildCount?: number;
}

export interface NewNodeData extends RowData {
  parentId?: number | null;
}
