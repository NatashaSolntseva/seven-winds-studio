import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  addEmptyNode,
  selectRows,
} from "../../../app/store/reducers/row/model/rowSlice";

import style from "./Btn.module.sass";

export function Btn() {
  const dispatch = useAppDispatch();
  const { editingRowId } = useAppSelector(selectRows);

  const handleAddNode = () => {
    dispatch(addEmptyNode(null));
  };

  return (
    <button
      className={style.btn}
      onClick={handleAddNode}
      disabled={editingRowId !== null}
    >
      Добавить
    </button>
  );
}
