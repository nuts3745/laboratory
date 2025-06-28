import { useCallback, useState } from "react";
import "./BinaryHeap.css";
import { ArrayDisplay } from "./components/heap/ArrayDisplay.js";
import { HeapControls } from "./components/heap/HeapControls.js";
import { HeapVisualizer } from "./components/heap/HeapVisualizer.js";
import { InfoPanel } from "./components/heap/InfoPanel.js";
import { Footer } from "./components/ui/Footer.js";
import { ToastContainer } from "./components/ui/ToastContainer.js";
import { useHeapLogic } from "./hooks/useHeapLogic.js";
import { useSimpleAnimation } from "./hooks/useSimpleAnimation.js";
import type { HeapType } from "./types/heap.js";
import type { ToastMessage } from "./types/heap.js";

/**
 * バイナリヒープ可視化ツール
 * シンプルで信頼性の高いアニメーションシステム
 */
export const BinaryHeap: React.FC<{
	isClicked: boolean;
	setIsClicked: (arg0: boolean) => void;
}> = (props): React.ReactElement => {
	// 基本状態
	const [heapData, setHeapData] = useState<number[]>([]);
	const [heapType, setHeapType] = useState<HeapType>("max");
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	// カスタムフック
	const { animationState, startAnimation, stopAnimation, isAnimating } =
		useSimpleAnimation();
	const {
		generateInsertSteps,
		generateExtractSteps,
		generateBuildHeapSteps,
		generateLevelOrderSteps,
	} = useHeapLogic();

	// トースト管理
	const addToast = useCallback(
		(message: string, type: ToastMessage["type"] = "info") => {
			const id = `toast-${Date.now().toString()}-${Math.random().toString()}`;
			const newToast: ToastMessage = {
				id,
				message,
				type,
				duration: 3000,
				persistent: false,
			};

			setToasts((prev) => [...prev, newToast]);

			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, 3000);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	// スワップ処理（アニメーション中に呼ばれる）
	const handleSwap = useCallback((i1: number, i2: number) => {
		setHeapData((prev) => {
			const newData = [...prev];
			if (i1 < newData.length && i2 < newData.length) {
				[newData[i1], newData[i2]] = [newData[i2], newData[i1]];
			}
			return newData;
		});
	}, []);

	// ヒープ操作ハンドラー
	const handleAddElement = useCallback(
		(value: number) => {
			if (isAnimating) return;

			// 1. まず要素を追加（視覚的に表示）
			const newData = [...heapData, value];
			setHeapData(newData);

			// 2. アニメーションステップを生成
			const steps = generateInsertSteps(heapData, value, heapType);

			// 3. アニメーション実行
			addToast(`要素 ${value.toString()} を追加中...`, "info");
			startAnimation(steps, handleSwap);
		},
		[
			heapData,
			heapType,
			isAnimating,
			generateInsertSteps,
			startAnimation,
			handleSwap,
			addToast,
		],
	);

	const handleAddRandom = useCallback(() => {
		const randomValue = Math.floor(Math.random() * 100) + 1;
		handleAddElement(randomValue);
	}, [handleAddElement]);

	const handleExtractRoot = useCallback(() => {
		if (isAnimating || heapData.length === 0) {
			if (heapData.length === 0) {
				addToast("ヒープが空です", "error");
			}
			return;
		}

		const rootValue = heapData[0];

		// アニメーションステップを生成
		const steps = generateExtractSteps(heapData, heapType);

		// アニメーション実行
		addToast(`要素 ${rootValue.toString()} を削除中...`, "info");
		startAnimation(steps, handleSwap);
	}, [
		heapData,
		heapType,
		isAnimating,
		generateExtractSteps,
		startAnimation,
		handleSwap,
		addToast,
	]);

	const handleTypeChange = useCallback(
		async (type: HeapType) => {
			if (isAnimating) return;

			setHeapType(type);

			// データがある場合は自動的にヒープ化を実行
			if (heapData.length > 1) {
				addToast(
					`${type === "max" ? "最大" : "最小"}ヒープに変更してヒープ化中...`,
					"info",
				);

				// 少し待ってからヒープ化アニメーション
				await new Promise((resolve) => setTimeout(resolve, 500));

				const steps = generateBuildHeapSteps(heapData, type);
				startAnimation(steps, handleSwap);
			} else {
				addToast(`${type === "max" ? "最大" : "最小"}ヒープに変更`, "success");
			}
		},
		[
			heapData,
			isAnimating,
			generateBuildHeapSteps,
			startAnimation,
			handleSwap,
			addToast,
		],
	);

	const handleClear = useCallback(() => {
		if (isAnimating) return;
		setHeapData([]);
		addToast("ヒープをクリア", "info");
	}, [isAnimating, addToast]);

	const handleBuildHeap = useCallback(
		async (values: number[]) => {
			if (isAnimating) return;

			// 1. 生データを表示
			setHeapData(values);
			addToast(
				`${values.length.toString()}個の要素からヒープを構築中...`,
				"info",
			);

			// 2. 少し待ってからアニメーション開始
			await new Promise((resolve) => setTimeout(resolve, 500));

			// 3. ヒープ化アニメーションステップを生成
			const steps = generateBuildHeapSteps(values, heapType);

			// 4. アニメーション実行
			startAnimation(steps, handleSwap);
		},
		[
			heapType,
			isAnimating,
			generateBuildHeapSteps,
			startAnimation,
			handleSwap,
			addToast,
		],
	);

	const handleCreateSample = useCallback(async () => {
		if (isAnimating) return;
		const sampleData = [50, 30, 70, 20, 10, 60, 90, 15, 25, 5];
		setHeapData(sampleData);
		addToast("サンプルデータを作成してヒープ化を開始...", "success");

		// 少し待ってからヒープ化を実行
		await new Promise((resolve) => setTimeout(resolve, 500));
		await handleBuildHeap(sampleData);
	}, [isAnimating, addToast, handleBuildHeap]);

	const handleShuffle = useCallback(() => {
		if (isAnimating || heapData.length === 0) return;
		const shuffled = [...heapData].sort(() => Math.random() - 0.5);
		setHeapData(shuffled);
		addToast("配列をシャッフルしました", "info");
	}, [heapData, isAnimating, addToast]);

	// シャッフル後にヒープ化を実行
	const handleShuffleAndHeapify = useCallback(async () => {
		if (isAnimating || heapData.length === 0) {
			if (heapData.length === 0) {
				addToast("ヒープが空です", "error");
			}
			return;
		}

		// 1. まずシャッフル
		const shuffled = [...heapData].sort(() => Math.random() - 0.5);
		setHeapData(shuffled);
		addToast("配列をシャッフルしてヒープ化を開始...", "info");

		// 2. 少し待ってからヒープ化
		await new Promise((resolve) => setTimeout(resolve, 800));
		await handleBuildHeap(shuffled);
	}, [heapData, isAnimating, handleBuildHeap, addToast]);

	const handleNodeClick = useCallback(
		(index: number) => {
			// シンプルなクリック処理（必要に応じて拡張）
			addToast(
				`ノード ${index.toString()} (値: ${heapData[index].toString()}) をクリック`,
				"info",
			);
		},
		[heapData, addToast],
	);

	// レベル順走査
	const handleLevelOrderTraversal = useCallback(() => {
		if (isAnimating || heapData.length === 0) {
			if (heapData.length === 0) {
				addToast("ヒープが空です", "error");
			}
			return;
		}

		addToast("レベル順走査を開始...", "info");

		const steps = generateLevelOrderSteps(heapData);
		startAnimation(steps, handleSwap);
	}, [
		heapData,
		isAnimating,
		generateLevelOrderSteps,
		startAnimation,
		handleSwap,
		addToast,
	]);

	// アニメーション停止
	const handleStopAnimation = useCallback(() => {
		stopAnimation();
		addToast("アニメーションを停止", "warning");
	}, [stopAnimation, addToast]);

	// 現在のヒープ状態を作成（既存コンポーネントとの互換性のため）
	const heapState = {
		data: heapData,
		type: heapType,
		activeIndex: null,
		parentIndex: null,
		childIndices: [],
		comparingIndices: animationState.comparingNodes,
		swappingIndices: animationState.swappingNodes,
		isAnimating: isAnimating,
	};

	return (
		<div className="binary-heap-container">
			<div className="heap-wrapper">
				<div
					className="neumorphic-back-link"
					onClick={() => {
						props.setIsClicked(false);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") props.setIsClicked(false);
					}}
				>
					←
				</div>
				<h1 className="heap-title">🌳 バイナリヒープ可視化ツール</h1>

				<div className="heap-main-content">
					<HeapVisualizer heapState={heapState} onNodeClick={handleNodeClick} />

					<ArrayDisplay heapState={heapState} onCellClick={handleNodeClick} />

					<HeapControls
						heapType={heapType}
						isAnimating={isAnimating}
						onTypeChange={(type) => {
							void handleTypeChange(type);
						}}
						onAddElement={handleAddElement}
						onAddRandom={handleAddRandom}
						onExtractRoot={handleExtractRoot}
						onBuildHeap={(values) => {
							void handleBuildHeap(values);
						}}
						onShuffle={handleShuffle}
						onClear={handleClear}
						onCreateSample={() => {
							void handleCreateSample();
						}}
						onLevelOrderTraversal={handleLevelOrderTraversal}
						onShuffleAndHeapify={() => {
							void handleShuffleAndHeapify();
						}}
						onResetAnimation={handleStopAnimation}
					/>

					<InfoPanel heapState={heapState} />
				</div>
			</div>

			<ToastContainer toasts={toasts} onToastClose={removeToast} />

			<Footer />
		</div>
	);
};
