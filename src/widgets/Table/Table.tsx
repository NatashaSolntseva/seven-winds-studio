import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  initializeEditingFields,
  selectRows,
  setEditingRowId,
  toggleEditInTree,
  updateInTree,
} from "../../app/store/reducers/row/model/rowSlice";
import TableRow from "../../entities/TableRow/TableRow";
import { getTreeRows } from "../../shared/api";

import style from "./Table.module.sass";

export function Table() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTreeRows()).then(() => {
      dispatch(initializeEditingFields());
    });
  }, [dispatch]);

  const { editedRowData, editingRowId, isLoading } = useAppSelector(selectRows);

  console.log("MegaTree EDITED", editedRowData);

  const toggleEdit = (id: number) => {
    // Проверяем, если уже редактируется другая строка и она не равна текущей строке
    if (editingRowId !== null && editingRowId !== id) {
      return;
    }

    dispatch(toggleEditInTree({ id }));
    dispatch(setEditingRowId(editingRowId === id ? null : id));
  };

  const handleUpdate = (id: number, field: string, value: string | number) => {
    // Отправляем действие для обновления поля в Redux
    dispatch(updateInTree({ id, field, value }));
  };

  return isLoading ? (
    <div>Loading....</div>
  ) : (
    <div className={style.table}>
      <div className={style.tableHead}>
        <div>Уровень</div>
        <div>Наименование работ</div>
        <div>Основная з/п</div>
        <div>Оборудование</div>
        <div>Накладные расходы</div>
        <div>Сметная прибыль</div>
      </div>
      <div className={style.tableBody}>
        {editedRowData.map((row) => (
          <TableRow
            key={row.id}
            row={row}
            level={0}
            toggleEdit={toggleEdit}
            handleUpdate={handleUpdate}
            editingRowId={editingRowId}
          />
        ))}
      </div>
    </div>
  );
}
