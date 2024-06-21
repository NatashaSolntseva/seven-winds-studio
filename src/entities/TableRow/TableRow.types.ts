import { RowData } from "../../shared/api/types";

interface TableRowProps {
  row: RowData;
  level: number;
  // toggleEdit: (id: number) => void;
  // handleUpdate: (id: number, field: string, value: string | number) => void;
  // editingRowId: number | null;
}

export type { TableRowProps };
