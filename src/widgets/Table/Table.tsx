import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  initializeEditingFields,
  selectRows,
} from "../../app/store/reducers/row/model/rowSlice";
import TableRow from "../../entities/TableRow/TableRow";
import { getTreeRows } from "../../shared/api";

import style from "./Table.module.sass";
import { Loader } from "../../shared/components/Loader/Loader";

export function Table() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTreeRows()).then(() => {
      dispatch(initializeEditingFields());
    });
  }, [dispatch]);

  const { editedRowData, isLoading } = useAppSelector(selectRows);

  console.log("MegaTree EDITED", editedRowData);

  return isLoading ? (
    <div className={style.loaderWrapper}>
      <Loader />
    </div>
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
          <TableRow key={row.id} row={row} level={0} />
        ))}
      </div>
    </div>
  );
}
