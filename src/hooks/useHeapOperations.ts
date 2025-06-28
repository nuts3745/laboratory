import { useCallback } from "react";
import type { HeapType } from "../types/heap.js";
import { BinaryHeapUtils } from "../utils/heapUtils.js";
import type { HeapifyStep } from "./useAdvancedAnimation.js";

/**
 * Custom hook for advanced heap operations
 * 高度なビジネスロジックとアニメーション対応の操作を提供
 */
export function useHeapOperations() {
	const insertElement = useCallback(
		(data: number[], value: number, type: HeapType) => {
			return BinaryHeapUtils.insert(data, value, type);
		},
		[],
	);

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

	const heapifyUp = useCallback(
		(data: number[], index: number, type: HeapType) => {
			return BinaryHeapUtils.heapifyUp(data, index, type);
		},
		[],
	);

	const heapifyDown = useCallback(
		(data: number[], index: number, type: HeapType) => {
			return BinaryHeapUtils.heapifyDown(data, index, type);
		},
		[],
	);

	const shuffleArray = useCallback((data: number[]) => {
		const shuffled = [...data];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}, []);

	const generateSampleHeap = useCallback((type: HeapType = "max") => {
		const sampleData = [50, 30, 70, 20, 10, 60, 90, 15, 25, 5];
		return BinaryHeapUtils.buildHeap(sampleData, type);
	}, []);

	const createHeapFromArray = useCallback((array: number[], type: HeapType) => {
		return BinaryHeapUtils.buildHeap([...array], type);
	}, []);

	const getInsertAnimationSteps = useCallback(
		(data: number[], value: number, type: HeapType): HeapifyStep[] => {
			const simulationData = [...data, value]; // シミュレーション用のコピー
			const steps: HeapifyStep[] = [];
			let currentIndex = simulationData.length - 1;

			steps.push({
				type: "highlight",
				indices: [currentIndex],
				description: `新しい要素 ${value.toString()} を配列の末尾に追加`,
			});

			while (currentIndex > 0) {
				const parentIndex = Math.floor((currentIndex - 1) / 2);
				const compare =
					type === "max"
						? simulationData[currentIndex] > simulationData[parentIndex]
						: simulationData[currentIndex] < simulationData[parentIndex];

				steps.push({
					type: "compare",
					indices: [currentIndex, parentIndex],
					description: `子 ${simulationData[currentIndex].toString()} と親 ${simulationData[parentIndex].toString()} を比較`,
				});

				if (!compare) {
					steps.push({
						type: "highlight",
						indices: [currentIndex],
						description: `ヒープ条件を満たしているため、挿入完了`,
					});
					break;
				}

				steps.push({
					type: "swap",
					indices: [currentIndex, parentIndex],
					description: `${simulationData[currentIndex].toString()} と ${simulationData[parentIndex].toString()} を交換`,
				});

				// シミュレーション用データを更新（実際のデータは変更しない）
				[simulationData[currentIndex], simulationData[parentIndex]] = [
					simulationData[parentIndex],
					simulationData[currentIndex],
				];
				currentIndex = parentIndex;
			}

			return steps;
		},
		[],
	);

	const getExtractAnimationSteps = useCallback(
		(data: number[], type: HeapType): HeapifyStep[] => {
			if (data.length === 0) return [];

			const steps: HeapifyStep[] = [];
			const simulationData = [...data]; // シミュレーション用のコピー

			steps.push({
				type: "highlight",
				indices: [0],
				description: `ルート要素 ${simulationData[0].toString()} を削除`,
			});

			if (simulationData.length === 1) return steps;

			// Move last element to root
			const lastElement = simulationData[simulationData.length - 1];
			steps.push({
				type: "swap",
				indices: [0, simulationData.length - 1],
				description: `最後の要素 ${lastElement.toString()} をルートに移動`,
			});

			// シミュレーション用データを更新
			[simulationData[0], simulationData[simulationData.length - 1]] = [
				simulationData[simulationData.length - 1],
				simulationData[0],
			];
			simulationData.pop();

			// Heapify down from root
			const heapifySteps = getHeapifyDownSteps(
				simulationData,
				0,
				simulationData.length,
				type,
			);
			steps.push(...heapifySteps);

			return steps;
		},
		[],
	);

	const getBuildHeapAnimationSteps = useCallback(
		(data: number[], type: HeapType): HeapifyStep[] => {
			const steps: HeapifyStep[] = [];
			const newData = [...data];
			const n = newData.length;

			if (n <= 1) return steps;

			steps.push({
				type: "highlight",
				indices: Array.from({ length: n }, (_, i) => i),
				description: `配列からヒープを構築開始（${n.toString()}個の要素）`,
			});

			// Start from the last parent node and go up
			for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
				steps.push({
					type: "highlight",
					indices: [i],
					description: `ノード ${i.toString()} (値: ${newData[i].toString()}) から heapify 開始`,
				});

				// Single heapify-down pass for node i
				const heapifySteps = getHeapifyDownSteps(newData, i, n, type);
				steps.push(...heapifySteps);
			}

			return steps;
		},
		[],
	);

	// Helper function for heapify-down animation steps
	const getHeapifyDownSteps = (
		data: number[],
		startIndex: number,
		heapSize: number,
		type: HeapType,
	): HeapifyStep[] => {
		const steps: HeapifyStep[] = [];
		const simulationData = [...data]; // シミュレーション用のコピー
		let currentIndex = startIndex;

		while (true) {
			const leftChild = 2 * currentIndex + 1;
			const rightChild = 2 * currentIndex + 2;
			let targetIndex = currentIndex;

			// Find the target node (parent or one of children)

			// Check left child
			if (leftChild < heapSize) {
				const compareLeft =
					type === "max"
						? simulationData[leftChild] > simulationData[targetIndex]
						: simulationData[leftChild] < simulationData[targetIndex];

				if (compareLeft) {
					targetIndex = leftChild;
				}
			}

			// Check right child
			if (rightChild < heapSize) {
				const compareRight =
					type === "max"
						? simulationData[rightChild] > simulationData[targetIndex]
						: simulationData[rightChild] < simulationData[targetIndex];

				if (compareRight) {
					targetIndex = rightChild;
				}
			}

			// Add comparison step if we have children to compare
			if (leftChild < heapSize || rightChild < heapSize) {
				const comparisonIndices = [currentIndex];
				if (leftChild < heapSize) comparisonIndices.push(leftChild);
				if (rightChild < heapSize) comparisonIndices.push(rightChild);

				steps.push({
					type: "compare",
					indices: comparisonIndices,
					description: `ノード ${currentIndex.toString()}(値: ${simulationData[currentIndex].toString()}) と子ノードを比較`,
				});
			}

			// If no swap needed, break
			if (targetIndex === currentIndex) {
				steps.push({
					type: "highlight",
					indices: [currentIndex],
					description: `ノード ${currentIndex.toString()} はヒープ条件を満たしています`,
				});
				break;
			}

			// Perform swap
			steps.push({
				type: "swap",
				indices: [currentIndex, targetIndex],
				description: `${simulationData[currentIndex].toString()} と ${simulationData[targetIndex].toString()} を交換`,
			});

			// シミュレーション用データを更新（実際のデータは変更しない）
			[simulationData[currentIndex], simulationData[targetIndex]] = [
				simulationData[targetIndex],
				simulationData[currentIndex],
			];
			currentIndex = targetIndex;
		}

		return steps;
	};

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
		getBuildHeapAnimationSteps,
	};
}
