import { useCallback } from 'react';
import { BinaryHeapUtils } from '../utils/heapUtils.js';
import type { HeapType } from '../types/heap.js';
import type { HeapifyStep } from './useAdvancedAnimation.js';

/**
 * Custom hook for advanced heap operations
 * 高度なビジネスロジックとアニメーション対応の操作を提供
 */
export function useHeapOperations() {

    const insertElement = useCallback((data: number[], value: number, type: HeapType) => {
        return BinaryHeapUtils.insert(data, value, type);
    }, []);

    const extractRoot = useCallback((data: number[], type: HeapType) => {
        return BinaryHeapUtils.extractRoot(data, type);
    }, []);

    const buildHeap = useCallback((data: number[], type: HeapType) => {
        return BinaryHeapUtils.buildHeap(data, type);
    }, []);

    const validateHeap = useCallback((data: number[], type: HeapType) => {
        return BinaryHeapUtils.isValidHeap(data, type);
    }, []);

    const generateRandomData = useCallback((size = 10) => {
        return BinaryHeapUtils.generateRandomHeap(size);
    }, []);

    const heapifyUp = useCallback((data: number[], index: number, type: HeapType) => {
        return BinaryHeapUtils.heapifyUp(data, index, type);
    }, []);

    const heapifyDown = useCallback((data: number[], index: number, type: HeapType) => {
        return BinaryHeapUtils.heapifyDown(data, index, type);
    }, []);

    const shuffleArray = useCallback((data: number[]) => {
        const shuffled = [...data];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    const generateSampleHeap = useCallback((type: HeapType = 'max') => {
        const sampleData = [50, 30, 70, 20, 10, 60, 90, 15, 25, 5];
        return BinaryHeapUtils.buildHeap(sampleData, type);
    }, []);

    const createHeapFromArray = useCallback((array: number[], type: HeapType) => {
        return BinaryHeapUtils.buildHeap([...array], type);
    }, []);

    const getInsertAnimationSteps = useCallback((data: number[], value: number, type: HeapType): HeapifyStep[] => {
        const newData = [...data, value];
        const steps: HeapifyStep[] = [];
        let currentIndex = newData.length - 1;

        steps.push({
            type: 'highlight',
            indices: [currentIndex],
            description: `新しい要素 ${value} を配列の末尾に追加`
        });

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const compare = type === 'max' 
                ? newData[currentIndex] > newData[parentIndex]
                : newData[currentIndex] < newData[parentIndex];

            steps.push({
                type: 'compare',
                indices: [currentIndex, parentIndex],
                description: `子 ${newData[currentIndex]} と親 ${newData[parentIndex]} を比較`
            });

            if (!compare) break;

            steps.push({
                type: 'swap',
                indices: [currentIndex, parentIndex],
                description: `${newData[currentIndex]} と ${newData[parentIndex]} を交換`
            });

            [newData[currentIndex], newData[parentIndex]] = [newData[parentIndex], newData[currentIndex]];
            currentIndex = parentIndex;
        }

        return steps;
    }, []);

    const getExtractAnimationSteps = useCallback((data: number[], type: HeapType): HeapifyStep[] => {
        if (data.length === 0) return [];

        const steps: HeapifyStep[] = [];
        const newData = [...data];

        steps.push({
            type: 'highlight',
            indices: [0],
            description: `ルート要素 ${newData[0]} を削除`
        });

        if (newData.length === 1) return steps;

        // Move last element to root
        steps.push({
            type: 'swap',
            indices: [0, newData.length - 1],
            description: `最後の要素 ${newData[newData.length - 1]} をルートに移動`
        });

        [newData[0], newData[newData.length - 1]] = [newData[newData.length - 1], newData[0]];
        newData.pop();

        // Heapify down
        let currentIndex = 0;
        while (true) {
            const leftChild = 2 * currentIndex + 1;
            const rightChild = 2 * currentIndex + 2;
            let targetIndex = currentIndex;

            if (leftChild < newData.length) {
                steps.push({
                    type: 'compare',
                    indices: [currentIndex, leftChild],
                    description: `親 ${newData[currentIndex]} と左の子 ${newData[leftChild]} を比較`
                });

                const compareLeft = type === 'max' 
                    ? newData[leftChild] > newData[targetIndex]
                    : newData[leftChild] < newData[targetIndex];
                    
                if (compareLeft) targetIndex = leftChild;
            }

            if (rightChild < newData.length) {
                steps.push({
                    type: 'compare',
                    indices: [currentIndex, rightChild],
                    description: `親 ${newData[currentIndex]} と右の子 ${newData[rightChild]} を比較`
                });

                const compareRight = type === 'max' 
                    ? newData[rightChild] > newData[targetIndex]
                    : newData[rightChild] < newData[targetIndex];
                    
                if (compareRight) targetIndex = rightChild;
            }

            if (targetIndex === currentIndex) break;

            steps.push({
                type: 'swap',
                indices: [currentIndex, targetIndex],
                description: `${newData[currentIndex]} と ${newData[targetIndex]} を交換`
            });

            [newData[currentIndex], newData[targetIndex]] = [newData[targetIndex], newData[currentIndex]];
            currentIndex = targetIndex;
        }

        return steps;
    }, []);

    const getBuildHeapAnimationSteps = useCallback((data: number[], type: HeapType): HeapifyStep[] => {
        const steps: HeapifyStep[] = [];
        const newData = [...data];
        const n = newData.length;

        steps.push({
            type: 'highlight',
            indices: Array.from({ length: n }, (_, i) => i),
            description: '配列からヒープを構築開始'
        });

        // Start from the last parent node and go up
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            let currentIndex = i;

            while (true) {
                const leftChild = 2 * currentIndex + 1;
                const rightChild = 2 * currentIndex + 2;
                let targetIndex = currentIndex;

                if (leftChild < n) {
                    steps.push({
                        type: 'compare',
                        indices: [currentIndex, leftChild],
                        description: `ノード ${newData[currentIndex]} と左の子 ${newData[leftChild]} を比較`
                    });

                    const compareLeft = type === 'max' 
                        ? newData[leftChild] > newData[targetIndex]
                        : newData[leftChild] < newData[targetIndex];
                        
                    if (compareLeft) targetIndex = leftChild;
                }

                if (rightChild < n) {
                    steps.push({
                        type: 'compare',
                        indices: [currentIndex, rightChild],
                        description: `ノード ${newData[currentIndex]} と右の子 ${newData[rightChild]} を比較`
                    });

                    const compareRight = type === 'max' 
                        ? newData[rightChild] > newData[targetIndex]
                        : newData[rightChild] < newData[targetIndex];
                        
                    if (compareRight) targetIndex = rightChild;
                }

                if (targetIndex === currentIndex) break;

                steps.push({
                    type: 'swap',
                    indices: [currentIndex, targetIndex],
                    description: `${newData[currentIndex]} と ${newData[targetIndex]} を交換してヒープ性質を維持`
                });

                [newData[currentIndex], newData[targetIndex]] = [newData[targetIndex], newData[currentIndex]];
                currentIndex = targetIndex;
            }
        }

        return steps;
    }, []);

    return {
        insertElement,
        extractRoot,
        buildHeap,
        validateHeap,
        generateRandomData,
        heapifyUp,
        heapifyDown,
        shuffleArray,
        generateSampleHeap,
        createHeapFromArray,
        getInsertAnimationSteps,
        getExtractAnimationSteps,
        getBuildHeapAnimationSteps
    };
}
