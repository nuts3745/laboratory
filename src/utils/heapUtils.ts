import type { HeapType, HeapOperationResult } from '../types/heap.js';

/**
 * Heap utility operations interface
 * ヒープ操作のインターフェース定義
 */
export interface HeapOperations {
  compare(a: number, b: number, type: HeapType): number;
  isValidHeap(data: number[], type: HeapType): boolean;
  getParentIndex(index: number): number | null;
  getLeftChildIndex(index: number): number;
  getRightChildIndex(index: number): number;
  getChildrenIndices(index: number, heapSize: number): number[];
  heapifyUp(data: number[], index: number, type: HeapType): {
    newData: number[];
    swaps: Array<{ from: number; to: number }>;
  };
  heapifyDown(data: number[], index: number, type: HeapType): {
    newData: number[];
    swaps: Array<{ from: number; to: number }>;
  };
  insert(data: number[], value: number, type: HeapType): HeapOperationResult;
  extractRoot(data: number[], type: HeapType): HeapOperationResult;
  buildHeap(data: number[], type: HeapType): {
    newData: number[];
    operations: Array<{ index: number; swaps: Array<{ from: number; to: number }> }>;
  };
  generateRandomHeap(size?: number): number[];
  calculateNodePosition(index: number, containerWidth: number, containerHeight: number): {
    x: number;
    y: number;
  };
}

/**
 * Binary Heap utility implementation using closures
 * クロージャを使用したヒープ操作の実装
 */
export const createBinaryHeapUtils = (): HeapOperations => {
  const compare = (a: number, b: number, type: HeapType): number => {
    return type === 'max' ? b - a : a - b;
  };

  const getParentIndex = (index: number): number | null => {
    if (index === 0) return null;
    return Math.floor((index - 1) / 2);
  };

  const getLeftChildIndex = (index: number): number => {
    return 2 * index + 1;
  };

  const getRightChildIndex = (index: number): number => {
    return 2 * index + 2;
  };

  const getChildrenIndices = (index: number, heapSize: number): number[] => {
    const children: number[] = [];
    const leftChild = getLeftChildIndex(index);
    const rightChild = getRightChildIndex(index);

    if (leftChild < heapSize) children.push(leftChild);
    if (rightChild < heapSize) children.push(rightChild);

    return children;
  };

  const isValidHeap = (data: number[], type: HeapType): boolean => {
    for (let i = 0; i < Math.floor(data.length / 2); i++) {
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < data.length && compare(data[i], data[leftChild], type) > 0) {
        return false;
      }
      if (rightChild < data.length && compare(data[i], data[rightChild], type) > 0) {
        return false;
      }
    }
    return true;
  };

  const heapifyUp = (data: number[], index: number, type: HeapType): {
    newData: number[];
    swaps: Array<{ from: number; to: number }>;
  } => {
    const result = [...data];
    const swaps: Array<{ from: number; to: number }> = [];
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      if (parentIndex === null) break;
      
      if (compare(result[parentIndex], result[currentIndex], type) <= 0) {
        break;
      }

      // Swap
      [result[parentIndex], result[currentIndex]] = [result[currentIndex], result[parentIndex]];
      swaps.push({ from: currentIndex, to: parentIndex });
      currentIndex = parentIndex;
    }

    return { newData: result, swaps };
  };

  const heapifyDown = (data: number[], index: number, type: HeapType): {
    newData: number[];
    swaps: Array<{ from: number; to: number }>;
  } => {
    const result = [...data];
    const swaps: Array<{ from: number; to: number }> = [];
    let currentIndex = index;

    while (true) {
      const leftChild = getLeftChildIndex(currentIndex);
      const rightChild = getRightChildIndex(currentIndex);
      let targetIndex = currentIndex;

      if (leftChild < result.length && 
          compare(result[targetIndex], result[leftChild], type) > 0) {
        targetIndex = leftChild;
      }

      if (rightChild < result.length && 
          compare(result[targetIndex], result[rightChild], type) > 0) {
        targetIndex = rightChild;
      }

      if (targetIndex === currentIndex) {
        break;
      }

      // Swap
      [result[currentIndex], result[targetIndex]] = [result[targetIndex], result[currentIndex]];
      swaps.push({ from: currentIndex, to: targetIndex });
      currentIndex = targetIndex;
    }

    return { newData: result, swaps };
  };

  const insert = (data: number[], value: number, type: HeapType): HeapOperationResult => {
    if (data.length >= 31) { // Reasonable limit for visualization
      return {
        success: false,
        message: 'ヒープが満杯です（最大31要素）',
        newHeap: data
      };
    }

    const newHeap = [...data, value];
    const { newData } = heapifyUp(newHeap, newHeap.length - 1, type);

    return {
      success: true,
      message: `要素 ${value} を追加しました`,
      newHeap: newData
    };
  };

  const extractRoot = (data: number[], type: HeapType): HeapOperationResult => {
    if (data.length === 0) {
      return {
        success: false,
        message: 'ヒープが空です',
        newHeap: data
      };
    }

    const root = data[0];
    if (data.length === 1) {
      return {
        success: true,
        message: `要素 ${root} を削除しました`,
        newHeap: [],
        removedValue: root
      };
    }

    // Move last element to root and heapify down
    const newHeap = [data[data.length - 1], ...data.slice(1, -1)];
    const { newData } = heapifyDown(newHeap, 0, type);

    return {
      success: true,
      message: `要素 ${root} を削除しました`,
      newHeap: newData,
      removedValue: root
    };
  };

  const buildHeap = (data: number[], type: HeapType): {
    newData: number[];
    operations: Array<{ index: number; swaps: Array<{ from: number; to: number }> }>;
  } => {
    const result = [...data];
    const operations: Array<{ index: number; swaps: Array<{ from: number; to: number }> }> = [];

    // Start from last non-leaf node and heapify down
    for (let i = Math.floor(result.length / 2) - 1; i >= 0; i--) {
      const { newData, swaps } = heapifyDown(result, i, type);
      result.splice(0, result.length, ...newData);
      operations.push({ index: i, swaps });
    }

    return { newData: result, operations };
  };

  const generateRandomHeap = (size = 10) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  };

  const calculateNodePosition = (index: number, containerWidth: number, containerHeight: number): {
    x: number;
    y: number;
  } => {
    const level = Math.floor(Math.log2(index + 1));
    const maxLevel = 4; // Reasonable depth for visualization
    const nodesInLevel = 2 ** level;
    const positionInLevel = index - (2 ** level - 1);

    const levelHeight = containerHeight / (maxLevel + 1);
    const y = levelHeight * (level + 1);

    const levelWidth = containerWidth / nodesInLevel;
    const x = levelWidth * (positionInLevel + 0.5);

    return { x, y };
  };

  return {
    compare,
    isValidHeap,
    getParentIndex,
    getLeftChildIndex,
    getRightChildIndex,
    getChildrenIndices,
    heapifyUp,
    heapifyDown,
    insert,
    extractRoot,
    buildHeap,
    generateRandomHeap,
    calculateNodePosition
  };
};

/**
 * Default heap utilities instance
 * デフォルトのヒープユーティリティインスタンス
 */
export const BinaryHeapUtils = createBinaryHeapUtils();
