import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialRowData, RowData } from "../../../../../shared/api/types";
import {
  createRow,
  deleteRowAndChild,
  getTreeRows,
  updateRow,
} from "../../../../../shared/api";
import {
  addEditingFieldAndCountChildren,
  removeRowRecursive,
  updateNode,
  updateTemporaryNode,
} from "./constants";

interface IRowsState {
  initialTreeData: InitialRowData[];
  editedRowData: RowData[];
  editingRowId: number | null;
  isLoading: boolean;
  error: string | null | unknown;
}

const initialState: IRowsState = {
  initialTreeData: [],
  editedRowData: [],
  editingRowId: null,
  isLoading: false,
  error: null,
};

const rowSlice = createSlice({
  name: "row",
  initialState,
  reducers: {
    addEmptyNode: (state, action) => {
      const parentID = action.payload;
      const newNode: RowData = {
        id: Date.now(),
        parentId: parentID,
        total: 0,
        rowName: "",
        salary: 0,
        mimExploitation: 0,
        machineOperatorSalary: 0,
        materials: 0,
        mainCosts: 0,
        supportCosts: 0,
        equipmentCosts: 0,
        overheads: 0,
        estimatedProfit: 0,
        editing: true,
        childCounter: 0,
        lastChildCount: 0,
        child: [],
      };

      // Функция для добавления нового узла рекурсивно
      const addNodeRecursive = (
        rows: RowData[],
        parentId: number | null
      ): RowData[] => {
        if (parentId === null) {
          // Добавляем новый узел уровня ноль (корневой узел)
          return [...rows, newNode];
        }

        // Ищем узел с указанным parentId и добавляем к его детям newNode
        return rows.map((row) => {
          if (row.id === parentId) {
            return {
              ...row,
              child: [...row.child, newNode],
            };
          } else if (row.child && row.child.length > 0) {
            return {
              ...row,
              child: addNodeRecursive(row.child, parentId),
            };
          }
          return row;
        });
      };

      // Обновляем состояние добавлением нового узла
      state.editedRowData = addNodeRecursive(state.editedRowData, parentID);

      // Устанавливаем editingRowId для новой ноды
      state.editingRowId = newNode.id;
    },

    setEditingRowId: (state, action: PayloadAction<number | null>) => {
      state.editingRowId = action.payload;
    },

    initializeEditingFields: (state) => {
      state.editedRowData = addEditingFieldAndCountChildren(
        state.initialTreeData
      );
    },

    toggleEditInTree: (state, action) => {
      const toggleEdit = (rows: RowData[], id: number): RowData[] => {
        return rows.map((row) => {
          if (row.id === id) {
            return { ...row, editing: !row.editing };
          } else if (row.editing) {
            return { ...row, editing: false }; // Снимаем режим редактирования с других строк
          }
          if (row.child) {
            return { ...row, child: toggleEdit(row.child, id) };
          }
          return row;
        });
      };
      state.editedRowData = toggleEdit(state.editedRowData, action.payload.id);
    },
  },
  // ----------------------------------------------------------------------------------
  extraReducers: (builder) => {
    builder
      .addCase(getTreeRows.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTreeRows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.initialTreeData = action.payload;
      })
      .addCase(getTreeRows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteRowAndChild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRowAndChild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const rowIdToRemove = action.meta.arg;
        const { current, changed } = action.payload;

        if (current === null) {
          state.editedRowData = removeRowRecursive(
            state.editedRowData,
            rowIdToRemove
          );
        }

        if (changed && changed.length > 0) {
          state.editedRowData = state.editedRowData.map((row) =>
            updateNode(row, changed)
          );
        }
      })
      .addCase(deleteRowAndChild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(createRow.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        console.log("New row created (API response):", action.payload);

        const { current, changed } = action.payload;
        const parentId = action.meta.arg.parentId;
        console.log("parentId", parentId);
        const tempId = action.meta.arg.tempId;
        console.log("tempId", tempId);

        if (current) {
          console.log(
            "Заменяем ноду временную на данные с сервера вот эти",
            current
          );
          state.editedRowData = updateTemporaryNode(
            state.editedRowData,
            tempId,
            current
          );
        }

        if (changed && changed.length > 0) {
          state.editedRowData = state.editedRowData.map((row) =>
            updateNode(row, changed)
          );
        }
      })
      .addCase(createRow.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(updateRow.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const { current, changed } = action.payload;

        if (current) {
          state.editedRowData = state.editedRowData.map((row) =>
            updateNode(row, [current])
          );
        }

        if (changed && changed.length > 0) {
          state.editedRowData = state.editedRowData.map((row) =>
            updateNode(row, changed)
          );
        }
      })
      .addCase(updateRow.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addEmptyNode,
  initializeEditingFields,
  toggleEditInTree,
  setEditingRowId,
} = rowSlice.actions;

export const selectRows = (state: { row: IRowsState }) => state.row;

export default rowSlice.reducer;
