import { InitialRowData, RowData } from "../../../../../shared/api/types";

// Функция для добавления поля editing, childCounter и lastChildCount в дерево
const addEditingFieldAndCountChildren = (data: InitialRowData[]): RowData[] => {
  // Рекурсивная функция для обработки каждого узла
  const processNode = (
    node: InitialRowData,
    parentLastChildCount: number
  ): RowData => {
    const processedChildren = node.child
      ? addEditingFieldAndCountChildren(node.child)
      : [];

    // Считаем количество всех потомков (дети, внуки и т.д.)
    const childCounter = processedChildren.reduce(
      (count, child) => count + child.childCounter + 1,
      0
    );

    // Вычисляем lastChildCount для текущего узла
    const lastChildCount =
      processedChildren.length > 0
        ? processedChildren[processedChildren.length - 1].childCounter
        : 0;

    return {
      ...node,
      editing: false,
      child: processedChildren,
      childCounter,
      lastChildCount,
    };
  };

  // Обрабатываем все узлы на текущем уровне
  return data.map(processNode);
};

const updateChangedRows = (
  rows: RowData[],
  changedRows: RowData[]
): RowData[] => {
  return rows.map((row) => {
    const updatedRow = changedRows.find(
      (changedRow) => changedRow.id === row.id
    );
    if (updatedRow) {
      return { ...row, ...updatedRow };
    } else if (row.child) {
      return {
        ...row,
        child: updateChangedRows(row.child, changedRows),
      };
    }
    return row;
  });
};

const removeRowRecursive = (rows: RowData[], id: number): RowData[] => {
  return rows.reduce((acc, row) => {
    if (row.id === id) {
      // Удаляем текущую строку
      return acc;
    } else if (row.child) {
      // Удаляем дочерние элементы текущей строки
      const updatedChild = removeRowRecursive(row.child, id);
      return [...acc, { ...row, child: updatedChild }];
    }
    return [...acc, row];
  }, [] as RowData[]);
};

export {
  updateChangedRows,
  removeRowRecursive,
  addEditingFieldAndCountChildren,
};
