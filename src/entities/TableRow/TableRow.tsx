import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  addEmptyNode,
  selectRows,
  setEditingRowId,
  toggleEditInTree,
  updateInTree,
} from "../../app/store/reducers/row/model/rowSlice";

import itemIcon from "../../assets/icons/item.svg";
import deleteIcon from "../../assets/icons/trash.svg";

import { formatNumber } from "../../utils/const/formatNumber";
import { deleteRowAndChild } from "../../shared/api";
import { TableRowProps } from "./TableRow.types";

import style from "./TableRow.module.sass";

type FormFields = {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
};

const TableRow: React.FC<TableRowProps> = ({
  row,
  level,
  // toggleEdit,
  // handleUpdate,
  //editingRowId,
}) => {
  const [hoveredIcon, setHoveredIcon] = useState(false);
  const { editedRowData, editingRowId, isLoading } = useAppSelector(selectRows);

  const isEditing = editingRowId === row.id;

  const dispatch = useAppDispatch();

  const handleDeleteRow = (rowIdToRemove: number) => {
    if (
      window.confirm(
        `Вы уверены, что хотите удалить эту строку c id ${rowIdToRemove}?`
      )
    ) {
      dispatch(deleteRowAndChild(rowIdToRemove));
    }
  };

  const handleAddChild = (parentId: number) => {
    dispatch(addEmptyNode(parentId));
  };

  const { register, handleSubmit } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      rowName: "",
      salary: 0,
      equipmentCosts: 0,
      overheads: 0,
      estimatedProfit: 0,
    },
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const newRow = {
      ...data,
      parentId: row.id,
    };
    console.log("DATA", data);
    console.log("newRow", newRow);
    dispatch(setEditingRowId(null));
  };

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

  return (
    <>
      <form
        className={style.tableRow}
        onDoubleClick={() => toggleEdit(row.id)}
        style={{ paddingLeft: `${level * 20}px` }}
        onSubmit={() => {
          console.log("сабмит");
          // e.preventDefault(); // Предотвращение стандартного поведения формы
          handleSubmit(onSubmit); // Вызов обработчика handleSubmit
        }}
      >
        <div className={style.iconContainer}>
          {level > 0 && <div className={style.rootLine}></div>}
          {row.childCounter > 0 && (
            <div
              className={style.rootVerticalLine}
              style={{
                height: `${
                  57 + 66 * (row.childCounter - 1 - row.lastChildCount)
                }px`,
              }}
            ></div>
          )}
          {isEditing ? (
            <div className={style.iconWrapper}>
              <button disabled>
                <img className={style.rowIcon} src={itemIcon} alt="icon" />
              </button>
            </div>
          ) : (
            <div
              className={`${style.iconWrapper} ${
                hoveredIcon && editingRowId === null
                  ? style.iconWrapperHovered
                  : ""
              }`}
              onMouseEnter={() => setHoveredIcon(true)}
              onMouseLeave={() => setHoveredIcon(false)}
            >
              <button
                onClick={() => handleAddChild(row.id)}
                disabled={!(hoveredIcon && editingRowId === null)}
              >
                <img className={style.rowIcon} src={itemIcon} alt="icon" />
              </button>
              {hoveredIcon && editingRowId === null && (
                <button onClick={() => handleDeleteRow(row.id)}>
                  <img
                    className={`${style.rowIcon} ${style.deleteIcon}`}
                    src={deleteIcon}
                    alt="del"
                  />
                </button>
              )}
            </div>
          )}
        </div>
        <div className={style.cellWrapper}>
          {isEditing ? (
            <input
              {...register("rowName")}
              className={style.rowInput}
              type="text"
              // value={row.rowName}
              // onChange={(e) => handleUpdate(row.id, "rowName", e.target.value)}
            />
          ) : (
            row.rowName
          )}
        </div>
        <div className={style.cellWrapper}>
          {isEditing ? (
            <input
              {...register("salary")}
              className={style.rowInput}
              type="text"
              // value={row.salary}
              //  onChange={(e) =>
              //  handleUpdate(row.id, "salary", Number(e.target.value))
              // }
            />
          ) : (
            formatNumber(row.salary)
          )}
        </div>
        <div className={style.cellWrapper}>
          {isEditing ? (
            <input
              {...register("equipmentCosts")}
              className={style.rowInput}
              type="text"
              // value={row.equipmentCosts}
              // onChange={(e) =>
              //  handleUpdate(row.id, "equipmentCosts", Number(e.target.value))
              //}
            />
          ) : (
            formatNumber(row.equipmentCosts)
          )}
        </div>
        <div className={style.cellWrapper}>
          {isEditing ? (
            <input
              {...register("overheads")}
              className={style.rowInput}
              type="text"
              // value={row.overheads}
              // onChange={(e) =>
              //   handleUpdate(row.id, "overheads", Number(e.target.value))
              //}
            />
          ) : (
            formatNumber(row.overheads)
          )}
        </div>
        <div className={style.cellWrapper}>
          {isEditing ? (
            <input
              {...register("estimatedProfit")}
              className={style.rowInput}
              type="text"
              // value={row.estimatedProfit}
              // onChange={(e) =>
              //  handleUpdate(row.id, "estimatedProfit", Number(e.target.value))
              // }
            />
          ) : (
            <div className={style.textWrapper}>
              {formatNumber(row.estimatedProfit)}
            </div>
          )}
        </div>
      </form>
      {row.child &&
        row.child.map((child) => (
          <TableRow
            key={child.id}
            row={child}
            level={level + 1}
            // toggleEdit={toggleEdit}
            // handleUpdate={handleUpdate}
            // editingRowId={editingRowId}
          />
        ))}
    </>
  );
};

export default TableRow;
