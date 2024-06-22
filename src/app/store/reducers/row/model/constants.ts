import { InitialRowData, RowData } from "../../../../../shared/api/types";

/**
 * Function to add the `editing`, `childCounter`, and `lastChildCount` fields to each node in the tree.
 *
 * This function recursively processes each node in the given tree structure, adding new fields to track
 * whether the node is being edited (`editing`), the total number of descendant nodes (`childCounter`),
 * and the number of descendants of the last child node (`lastChildCount`).
 *
 * @param data - An array of InitialRowData objects representing the tree structure.
 * @returns - An array of RowData objects with the additional fields included.
 */
const addEditingFieldAndCountChildren = (data: InitialRowData[]): RowData[] => {
  // Recursive function to process each node
  const processNode = (node: InitialRowData): RowData => {
    // Recursively process the children of the current node
    const processedChildren = node.child
      ? addEditingFieldAndCountChildren(node.child)
      : [];

    // Calculate the total number of descendants (children, grandchildren, etc.)
    const childCounter = processedChildren.reduce(
      (count, child) => count + child.childCounter + 1,
      0
    );

    // Calculate the number of descendants of the last child node
    const lastChildCount =
      processedChildren.length > 0
        ? processedChildren[processedChildren.length - 1].childCounter
        : 0;

    return {
      ...node,
      editing: false, // Add the `editing` field, initially set to false
      child: processedChildren, // Assign the processed children to the current node
      childCounter, // Add the `childCounter` field
      lastChildCount, // Add the `lastChildCount` field
      parentId: null, // Add the `parentId` field, initially set to null
    };
  };

  // Process all nodes at the current level
  return data.map(processNode);
};

/**
 * Recursively updates a node and its children in the tree structure.
 *
 * This function traverses the tree structure and updates the nodes that match any of the IDs
 * in the `updatedNodes` array. It ensures that the updated properties from `updatedNodes`
 * are merged into the existing nodes while preserving the original structure and data for
 * nodes that are not updated.
 *
 * @param node - A RowData object representing the current node in the tree.
 * @param updatedNodes - An array of RowData objects containing the updated data for specific nodes.
 * @returns - A new RowData object with the updated node and its children, if applicable.
 */
const updateNode = (node: RowData, updatedNodes: RowData[]): RowData => {
  // Find the corresponding updated node by matching the ID
  const updatedNode = updatedNodes.find((n) => n.id === node.id);

  if (updatedNode) {
    // If the node is found in updatedNodes, merge the updates and recursively update children
    return {
      ...node,
      ...updatedNode,
      child: node.child
        ? node.child.map((child) => updateNode(child, updatedNodes))
        : [],
    };
  } else if (node.child && node.child.length > 0) {
    // If the node is not found in updatedNodes but has children, recursively update children
    return {
      ...node,
      child: node.child.map((child) => updateNode(child, updatedNodes)),
    };
  }
  // If the node is not found in updatedNodes and has no children, return the node as is
  return node;
};

/**
 * Recursively removes a row (node) from the tree structure based on the provided ID.
 *
 * This function traverses the tree structure and removes the node that matches the specified ID.
 * It ensures that all child nodes of the removed node are also excluded from the resulting tree.
 *
 * @param rows - An array of RowData objects representing the tree structure.
 * @param id - The ID of the node to be removed.
 * @returns - A new array of RowData objects with the specified node (and its children) removed.
 */
const removeRowRecursive = (rows: RowData[], id: number): RowData[] => {
  return rows.reduce((acc, row) => {
    if (row.id === id) {
      // If the current row's ID matches the ID to be removed, exclude it from the accumulator.
      return acc;
    } else if (row.child) {
      // If the current row has children, process the children to remove the node.
      const updatedChild = removeRowRecursive(row.child, id);
      return [...acc, { ...row, child: updatedChild }];
    }
    // If the current row's ID does not match and it has no children, include it as is.
    return [...acc, row];
  }, [] as RowData[]);
};

/**
 * Finds the temporary node in the state and updates its fields with data from the server.
 *
 * This function is used to replace the placeholder (temporary) node, which was created with
 * a temporary ID before sending a request to the server. Once the server responds with the
 * actual data, this function updates the placeholder node with the new data received from
 * the server.
 *
 * @param rows - An array of RowData objects representing the tree structure.
 * @param tempNodeId - The temporary ID of the node to be updated. This ID was assigned
 *                     when the node was initially created before the server response.
 * @param newData - An object containing the new data for the node. This is typically a
 *                  partial RowData object with the fields returned by the server.
 * @returns - A new array of RowData objects with the updated node.
 */
const updateTemporaryNode = (
  rows: RowData[],
  tempNodeId: number,
  newData: Partial<RowData>
): RowData[] => {
  return rows.map((row) => {
    if (row.id === tempNodeId) {
      return {
        ...row,
        ...newData, // Update only the specified fields with data from the server
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
/**
 * Function to update only the child counters in the tree.
 * This function traverses the tree and updates `childCounter` and `lastChildCount`
 * for each node, without adding new fields.
 *
 * @param data - The array of initial rows representing the tree structure.
 * @returns - A new array of rows with updated child counters.
 */
const updateChildCounters = (data: RowData[]): RowData[] => {
  // Recursive function to process each node
  const processNode = (node: RowData): RowData => {
    const processedChildren = node.child ? updateChildCounters(node.child) : [];

    // Calculate the number of all descendants (children, grandchildren, etc.)
    const childCounter = processedChildren.reduce(
      (count, child) => count + (child.childCounter || 0) + 1,
      0
    );

    // Calculate lastChildCount for the current node
    const lastChildCount =
      processedChildren.length > 0
        ? processedChildren[processedChildren.length - 1].childCounter || 0
        : 0;

    return {
      ...node,
      child: processedChildren,
      childCounter,
      lastChildCount,
    };
  };

  // Process all nodes at the current level
  return data.map(processNode);
};

export {
  removeRowRecursive,
  addEditingFieldAndCountChildren,
  updateNode,
  updateTemporaryNode,
  updateChildCounters,
};
