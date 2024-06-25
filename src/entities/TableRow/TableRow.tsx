import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  addEmptyNode,
  selectRows,
  setEditingRowId,
  toggleEditInTree,
} from "../../app/store/reducers/row/model/rowSlice";

import { formatNumber } from "../../utils/const/formatNumber";
import { createRow, deleteRowAndChild, updateRow } from "../../shared/api";
import { TableRowProps } from "./TableRow.types";
import { NewNodeDataAPI } from "../../shared/api/types";

import itemIcon from "../../assets/icons/item.svg";
import deleteIcon from "../../assets/icons/trash.svg";

import style from "./TableRow.module.sass";

const schema = yup.object({
  rowName: yup.string(),
  salary: yup.number(),
  equipmentCosts: yup.number(),
  overheads: yup.number(),
  estimatedProfit: yup.number(),
});

type FormFields = yup.InferType<typeof schema>;

const TableRow: React.FC<TableRowProps> = ({ row, level }) => {
  const [hoveredIcon, setHoveredIcon] = useState(false);
  const { editingRowId } = useAppSelector(selectRows);

  const isEditing = editingRowId === row.id;

  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm<FormFields>({
    mode: "onChange",
    defaultValues: {
      rowName: row.rowName || "",
      salary: row.salary,
      equipmentCosts: row.equipmentCosts,
      overheads: row.overheads,
      estimatedProfit: row.estimatedProfit,
    },
    resolver: yupResolver(schema),
  });

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

  const toggleEdit = (id: number) => {
    if (editingRowId !== null && editingRowId !== id) {
      return;
    }

    dispatch(toggleEditInTree({ id }));
    dispatch(setEditingRowId(editingRowId === id ? null : id));
  };

  const onSubmit: SubmitHandler<FormFields> = async (inputData) => {
    const isNewRow = row.parentId === null || row.parentId !== undefined;

    const newNode: NewNodeDataAPI = {
      rowName: inputData.rowName || "",
      salary: inputData.salary || 0,
      equipmentCosts: inputData.equipmentCosts || 0,
      overheads: inputData.overheads || 0,
      estimatedProfit: inputData.estimatedProfit || 0,
      parentId: row.parentId,
      mimExploitation: 0,
      machineOperatorSalary: 0,
      materials: 0,
      mainCosts: 0,
      supportCosts: 0,
    };

    try {
      if (isNewRow) {
        await dispatch(createRow({ tempId: row.id, newRow: newNode }));
      } else {
        await dispatch(updateRow({ rowId: row.id, updatedData: newNode }));
      }

      dispatch(setEditingRowId(null));
    } catch (error) {
      console.error("Failed to create row:", error);
    }
  };

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <form
        className={style.tableRow}
        onDoubleClick={() => toggleEdit(row.id)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className={style.iconContainer}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {isEditing ? (
            <div className={style.iconWrapper}>
              {level > 0 && <div className={style.redRootLine}></div>}
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
              {level > 0 && <div className={style.redRootLine}></div>}
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
              onKeyDown={handleUserKeyPress}
            />
          ) : (
            row.rowName
          )}
        </div>
        <div className={style.numbersCellWrapper}>
          <div className={style.cellWrapper}>
            {isEditing ? (
              <input
                {...register("salary")}
                className={style.rowInput}
                type="text"
                onKeyDown={handleUserKeyPress}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  const newValue = value.replace(/[^0-9]/g, "");
                  e.target.value = newValue;
                }}
              />
            ) : (
              <span className={style.cellText}>{formatNumber(row.salary)}</span>
            )}
          </div>

          <div className={style.cellWrapper}>
            {isEditing ? (
              <input
                {...register("equipmentCosts")}
                className={style.rowInput}
                type="text"
                onKeyDown={handleUserKeyPress}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  const newValue = value.replace(/[^0-9]/g, "");
                  e.target.value = newValue;
                }}
              />
            ) : (
              <span className={style.cellText}>
                {formatNumber(row.equipmentCosts)}
              </span>
            )}
          </div>

          <div className={style.cellWrapper}>
            {isEditing ? (
              <input
                {...register("overheads")}
                className={style.rowInput}
                type="text"
                onKeyDown={handleUserKeyPress}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  const newValue = value.replace(/[^0-9]/g, "");
                  e.target.value = newValue;
                }}
              />
            ) : (
              <span className={style.cellText}>
                {formatNumber(row.overheads)}
              </span>
            )}
          </div>

          <div className={style.cellWrapper}>
            {isEditing ? (
              <input
                {...register("estimatedProfit")}
                className={style.rowInput}
                type="text"
                onKeyDown={handleUserKeyPress}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  const newValue = value.replace(/[^0-9]/g, "");
                  e.target.value = newValue;
                }}
              />
            ) : (
              <span className={style.cellText}>
                {formatNumber(row.estimatedProfit)}
              </span>
            )}
          </div>
        </div>
      </form>
      {row.child &&
        row.child.map((child) => (
          <TableRow key={child.id} row={child} level={level + 1} />
        ))}
    </>
  );
};

export default TableRow;
