import { InitialRowData, RowData } from "../../../../../shared/api/types";

// Функция для добавления поля editing, childCounter и lastChildCount в дерево
const addEditingFieldAndCountChildren = (data: InitialRowData[]): RowData[] => {
  // Рекурсивная функция для обработки каждого узла
  const processNode = (
    node: InitialRowData
    // parentLastChildCount: number
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
      parentId: null,
    };
  };

  // Обрабатываем все узлы на текущем уровне
  return data.map(processNode);
};

// Функция для рекурсивного обновления узла и его детей
const updateNode = (node: RowData, updatedNodes: RowData[]): RowData => {
  const updatedNode = updatedNodes.find((n) => n.id === node.id);
  if (updatedNode) {
    return {
      ...node,
      ...updatedNode,
      child: node.child
        ? node.child.map((child) => updateNode(child, updatedNodes))
        : [],
    };
  } else if (node.child && node.child.length > 0) {
    return {
      ...node,
      child: node.child.map((child) => updateNode(child, updatedNodes)),
    };
  }
  return node;
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

// Находим временную ноду в состоянии и обновляем её поля данными от сервера
const updateTemporaryNode = (
  rows: RowData[],
  tempNodeId: number,
  newData: Partial<RowData>
): RowData[] => {
  return rows.map((row) => {
    if (row.id === tempNodeId) {
      return {
        ...row,
        ...newData, // Обновляем только указанные поля данными от сервера
      };
    } else if (row.child && row.child.length > 0) {
      return {
        ...row,
        child: updateTemporaryNode(row.child, tempNodeId, newData),
      };
    }
    return row;
  });
};

export {
  removeRowRecursive,
  addEditingFieldAndCountChildren,
  updateNode,
  updateTemporaryNode,
};
