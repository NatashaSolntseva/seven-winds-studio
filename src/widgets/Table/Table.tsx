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

  return isLoading ? (
    <div className={style.loaderWrapper}>
      <Loader />
    </div>
  ) : (
    <div className={style.table}>
      <div className={style.tableHead}>
        <div>Уровень</div>
        <div style={{ paddingLeft: "10px" }}>Наименование работ</div>
        <div style={{ paddingLeft: "20px" }}>Основная з/п</div>
        <div style={{ paddingLeft: "20px" }}>Оборудование</div>
        <div style={{ paddingLeft: "20px" }}>Накладные расходы</div>
        <div style={{ paddingLeft: "20px" }}>Сметная прибыль</div>
      </div>
      <div className={style.tableBody}>
        {editedRowData.map((row) => (
          <TableRow key={row.id} row={row} level={0} />
        ))}
      </div>
    </div>
  );
}
