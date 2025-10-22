import { useCallback, useEffect, useRef } from "react";
import type { HeapType } from "../types/heap.js";
import type { AnimationStep } from "./useSimpleAnimation.js";

/**
 * シンプルなヒープ操作ロジック
 * アニメーションと実際の操作を分離した設計
 */
export const useHeapLogic = () => {
	const generateHeapifyDownStepsRef = useRef<
		((
			simData: number[],
			startIndex: number,
			heapSize: number,
			type: HeapType,
		) => AnimationStep[]) | null
	>(null);
	const heapifyDownRef = useRef<
		((
			data: number[],
			startIndex: number,
			heapSize: number,
			type: HeapType,
		) => void) | null
	>(null);

	// ヒープ条件をチェック
	const shouldSwap = useCallback(
		(parent: number, child: number, type: HeapType): boolean => {
			return type === "max" ? child > parent : child < parent;
		},
		[],
	);

	// 挿入のアニメーションステップを生成
	const generateInsertSteps = useCallback(
		(data: number[], value: number, type: HeapType): AnimationStep[] => {
			const steps: AnimationStep[] = [];
			const simData = [...data, value]; // シミュレーション用データ
			let currentIndex = simData.length - 1;

			// 1. 新要素をハイライト
			steps.push({
				type: "highlight",
				indices: [currentIndex],
				description: `新しい要素 ${value.toString()} を配列の末尾に追加`,
				duration: 600,
			});

			// 2. Heapify Up
			while (currentIndex > 0) {
				const parentIndex = Math.floor((currentIndex - 1) / 2);

				// 比較
				steps.push({
					type: "compare",
					indices: [currentIndex, parentIndex],
					description: `子 ${simData[currentIndex].toString()} と親 ${simData[parentIndex].toString()} を比較`,
					duration: 600,
				});

				if (!shouldSwap(simData[parentIndex], simData[currentIndex], type)) {
					break; // スワップ不要
				}

				// スワップ
				steps.push({
					type: "swap",
					indices: [currentIndex, parentIndex],
					description: `${simData[currentIndex].toString()} と ${simData[parentIndex].toString()} をスワップ`,
					duration: 800,
				});

				// シミュレーションデータを更新
				[simData[currentIndex], simData[parentIndex]] = [
					simData[parentIndex],
					simData[currentIndex],
				];
				currentIndex = parentIndex;
			}

			// 完了
			steps.push({
				type: "complete",
				indices: [],
				description: `要素 ${value.toString()} の挿入完了`,
				duration: 400,
			});

			return steps;
		},
		[shouldSwap],
	);

	// 削除のアニメーションステップを生成
	const generateExtractSteps = useCallback(
		(data: number[], type: HeapType): AnimationStep[] => {
			const steps: AnimationStep[] = [];
			if (data.length === 0) return steps;

			const simData = [...data];
			const rootValue = simData[0];

			// 1. ルートをハイライト
			steps.push({
				type: "highlight",
				indices: [0],
				description: `ルート要素 ${rootValue.toString()} を削除`,
				duration: 600,
			});

			if (simData.length === 1) {
				steps.push({
					type: "complete",
					indices: [],
					description: `要素 ${rootValue.toString()} の削除完了`,
					duration: 400,
				});
				return steps;
			}

			// 2. 最後の要素をルートに移動
			const lastIndex = simData.length - 1;
			steps.push({
				type: "swap",
				indices: [0, lastIndex],
				description: `最後の要素 ${simData[lastIndex].toString()} をルートに移動`,
				duration: 800,
			});

			// シミュレーションデータを更新
			[simData[0], simData[lastIndex]] = [simData[lastIndex], simData[0]];
			simData.pop();

			// 3. Heapify Down
			let currentIndex = 0;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
				const leftChild = 2 * currentIndex + 1;
				const rightChild = 2 * currentIndex + 2;
				let targetIndex = currentIndex;

				// 左の子と比較
				if (leftChild < simData.length) {
					steps.push({
						type: "compare",
						indices: [currentIndex, leftChild],
						description: `親 ${simData[currentIndex].toString()} と左の子 ${simData[leftChild].toString()} を比較`,
						duration: 600,
					});

					if (shouldSwap(simData[targetIndex], simData[leftChild], type)) {
						targetIndex = leftChild;
					}
				}

				// 右の子と比較
				if (rightChild < simData.length) {
					steps.push({
						type: "compare",
						indices: [currentIndex, rightChild],
						description: `親 ${simData[currentIndex].toString()} と右の子 ${simData[rightChild].toString()} を比較`,
						duration: 600,
					});

					if (shouldSwap(simData[targetIndex], simData[rightChild], type)) {
						targetIndex = rightChild;
					}
				}

				if (targetIndex === currentIndex) {
					break; // スワップ不要
				}

				// スワップ
				steps.push({
					type: "swap",
					indices: [currentIndex, targetIndex],
					description: `${simData[currentIndex].toString()} と ${simData[targetIndex].toString()} をスワップ`,
					duration: 800,
				});

				// シミュレーションデータを更新
				[simData[currentIndex], simData[targetIndex]] = [
					simData[targetIndex],
					simData[currentIndex],
				];
				currentIndex = targetIndex;
			}

			// 完了
			steps.push({
				type: "complete",
				indices: [],
				description: `要素 ${rootValue.toString()} の削除完了`,
				duration: 400,
			});

			return steps;
		},
		[shouldSwap],
	);

	// 実際のヒープ操作（アニメーションなし）
	const insertElement = useCallback(
		(data: number[], value: number, type: HeapType): number[] => {
			const newData = [...data, value];
			let currentIndex = newData.length - 1;

			while (currentIndex > 0) {
				const parentIndex = Math.floor((currentIndex - 1) / 2);
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!shouldSwap(newData[parentIndex], newData[currentIndex], type)) {
					break;
				}
				[newData[currentIndex], newData[parentIndex]] = [
					newData[parentIndex],
					newData[currentIndex],
				];
				currentIndex = parentIndex;
			}

			return newData;
		},
		[shouldSwap],
	);

	const extractRoot = useCallback(
		(data: number[], type: HeapType): number[] => {
			if (data.length === 0) return [];
			if (data.length === 1) return [];

			const newData = [...data];
			[newData[0], newData[newData.length - 1]] = [
				newData[newData.length - 1],
				newData[0],
			];
			newData.pop();

			let currentIndex = 0;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
				const leftChild = 2 * currentIndex + 1;
				const rightChild = 2 * currentIndex + 2;
				let targetIndex = currentIndex;

				if (
					leftChild < newData.length &&
					shouldSwap(newData[targetIndex], newData[leftChild], type)
				) {
					targetIndex = leftChild;
				}
				if (
					rightChild < newData.length &&
					shouldSwap(newData[targetIndex], newData[rightChild], type)
				) {
					targetIndex = rightChild;
				}

				if (targetIndex === currentIndex) break;

				[newData[currentIndex], newData[targetIndex]] = [
					newData[targetIndex],
					newData[currentIndex],
				];
				currentIndex = targetIndex;
			}

			return newData;
		},
		[shouldSwap],
	);

	// ヒープ化のアニメーションステップを生成
	const generateBuildHeapSteps = useCallback(
		(data: number[], type: HeapType): AnimationStep[] => {
			const steps: AnimationStep[] = [];
			const simData = [...data]; // シミュレーション用データ
			const n = simData.length;

			if (n <= 1) {
				steps.push({
					type: "complete",
					indices: [],
					description: "要素が1個以下のため、既にヒープです",
					duration: 600,
				});
				return steps;
			}

			// 1. 初期状態を表示
			steps.push({
				type: "highlight",
				indices: Array.from({ length: n }, (_, i) => i),
				description: `${n.toString()}個の要素からヒープを構築開始`,
				duration: 800,
			});

			// 2. 最後の親ノードから開始してheapify down
			for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
				steps.push({
					type: "highlight",
					indices: [i],
					description: `ノード ${i.toString()} (値: ${simData[i].toString()}) からheapify開始`,
					duration: 600,
				});

				// 単一ノードのheapify-downステップを生成
				const heapifySteps = generateHeapifyDownStepsRef.current?.(simData, i, n, type) ?? [];
				steps.push(...heapifySteps);
			}

			// 3. 完了
			steps.push({
				type: "complete",
				indices: [],
				description: `ヒープ化完了！${type === "max" ? "最大" : "最小"}ヒープが構築されました`,
				duration: 800,
			});

			return steps;
		},
		[shouldSwap],
	);

	// Heapify-downの詳細ステップを生成（buildHeap用のヘルパー）
	const generateHeapifyDownSteps = useCallback(
		(
			simData: number[],
			startIndex: number,
			heapSize: number,
			type: HeapType,
		): AnimationStep[] => {
			const steps: AnimationStep[] = [];
			let currentIndex = startIndex;

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
				const leftChild = 2 * currentIndex + 1;
				const rightChild = 2 * currentIndex + 2;
				let targetIndex = currentIndex;

				// 比較対象の子ノードをチェック
				const childrenToCompare: number[] = [];
				if (leftChild < heapSize) childrenToCompare.push(leftChild);
				if (rightChild < heapSize) childrenToCompare.push(rightChild);

				if (childrenToCompare.length === 0) {
					// 子がない場合
					steps.push({
						type: "highlight",
						indices: [currentIndex],
						description: `ノード ${currentIndex.toString()} は葉ノードのため完了`,
						duration: 400,
					});
					break;
				}

				// 子ノードとの比較
				steps.push({
					type: "compare",
					indices: [currentIndex, ...childrenToCompare],
					description: `ノード ${currentIndex.toString()}(${simData[currentIndex].toString()}) と子ノード(${childrenToCompare.map((i) => simData[i].toString()).join(", ")})を比較`,
					duration: 600,
				});

				// 最適な子を見つける
				for (const childIndex of childrenToCompare) {
					if (shouldSwap(simData[targetIndex], simData[childIndex], type)) {
						targetIndex = childIndex;
					}
				}

				// スワップが必要かチェック
				if (targetIndex === currentIndex) {
					steps.push({
						type: "highlight",
						indices: [currentIndex],
						description: `ノード ${currentIndex.toString()} はヒープ条件を満たしているため完了`,
						duration: 400,
					});
					break;
				}

				// スワップ実行
				steps.push({
					type: "swap",
					indices: [currentIndex, targetIndex],
					description: `${simData[currentIndex].toString()} と ${simData[targetIndex].toString()} をスワップしてヒープ条件を満たす`,
					duration: 800,
				});

				// シミュレーションデータを更新
				[simData[currentIndex], simData[targetIndex]] = [
					simData[targetIndex],
					simData[currentIndex],
				];
				currentIndex = targetIndex;
			}

			return steps;
		},
		[shouldSwap],
	);

	// Update ref after render
	useEffect(() => {
		generateHeapifyDownStepsRef.current = generateHeapifyDownSteps;
	}, [generateHeapifyDownSteps]);

	// 実際のヒープ化操作（アニメーションなし）
	const buildHeap = useCallback(
		(data: number[], type: HeapType): number[] => {
			const newData = [...data];
			const n = newData.length;

			// 最後の親ノードから開始してheapify down
			for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
				heapifyDownRef.current?.(newData, i, n, type);
			}

			return newData;
		},
		[shouldSwap],
	);

	// Heapify-downヘルパー関数
	const heapifyDown = useCallback(
		(data: number[], startIndex: number, heapSize: number, type: HeapType) => {
			let currentIndex = startIndex;

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
				const leftChild = 2 * currentIndex + 1;
				const rightChild = 2 * currentIndex + 2;
				let targetIndex = currentIndex;

				if (
					leftChild < heapSize &&
					shouldSwap(data[targetIndex], data[leftChild], type)
				) {
					targetIndex = leftChild;
				}
				if (
					rightChild < heapSize &&
					shouldSwap(data[targetIndex], data[rightChild], type)
				) {
					targetIndex = rightChild;
				}

				if (targetIndex === currentIndex) break;

				[data[currentIndex], data[targetIndex]] = [
					data[targetIndex],
					data[currentIndex],
				];
				currentIndex = targetIndex;
			}
		},
		[shouldSwap],
	);

	// Update ref after render
	useEffect(() => {
		heapifyDownRef.current = heapifyDown;
	}, [heapifyDown]);

	// レベル順走査のアニメーションステップを生成
	const generateLevelOrderSteps = useCallback(
		(data: number[]): AnimationStep[] => {
			const steps: AnimationStep[] = [];
			const n = data.length;

			if (n === 0) {
				steps.push({
					type: "complete",
					indices: [],
					description: "ヒープが空のため走査できません",
					duration: 600,
				});
				return steps;
			}

			steps.push({
				type: "highlight",
				indices: [],
				description: "レベル順走査を開始します",
				duration: 600,
			});

			// 各ノードを順番にハイライト
			for (let i = 0; i < n; i++) {
				steps.push({
					type: "highlight",
					indices: [i],
					description: `ノード ${i.toString()}: 値 ${data[i].toString()} を訪問`,
					duration: 500,
				});
			}

			steps.push({
				type: "complete",
				indices: [],
				description: "レベル順走査完了！",
				duration: 600,
			});

			return steps;
		},
		[],
	);

	return {
		generateInsertSteps,
		generateExtractSteps,
		generateBuildHeapSteps,
		generateLevelOrderSteps,
		insertElement,
		extractRoot,
		buildHeap,
	};
};
