import { useState } from "react";
import type { HeapType } from "../../types/heap.js";

interface HeapControlsProps {
	heapType: HeapType;
	isAnimating: boolean;
	onTypeChange: (type: HeapType) => void;
	onAddElement: (value: number) => void;
	onAddRandom: () => void;
	onExtractRoot: () => void;
	onBuildHeap: (values: number[]) => void;
	onShuffle: () => void;
	onClear: () => void;
	onCreateSample: () => void;
	onLevelOrderTraversal: () => void;
	onShuffleAndHeapify: () => void;
	onResetAnimation: () => void;
}

/**
 * Control panel for heap operations
 * 操作パネルの責任のみを持つコンポーネント
 */
export function HeapControls({
	heapType,
	isAnimating,
	onTypeChange,
	onAddElement,
	onAddRandom,
	onExtractRoot,
	onBuildHeap,
	onShuffle,
	onClear,
	onCreateSample,
	onLevelOrderTraversal,
	onShuffleAndHeapify,
	onResetAnimation,
}: HeapControlsProps) {
	const [inputValue, setInputValue] = useState("");
	const [arrayInput, setArrayInput] = useState("");

	const handleAddElement = (e: React.FormEvent) => {
		e.preventDefault();
		const value = Number.parseInt(inputValue, 10);
		if (!Number.isNaN(value) && value >= 1 && value <= 999) {
			onAddElement(value);
			setInputValue("");
		}
	};

	const handleBuildHeap = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const values = arrayInput
				.split(",")
				.map((v) => Number.parseInt(v.trim(), 10))
				.filter((v) => !Number.isNaN(v) && v >= 1 && v <= 999);

			if (values.length > 0) {
				onBuildHeap(values);
				setArrayInput("");
			}
		} catch {
			// Handle error silently or show toast
		}
	};

	return (
		<div className="heap-controls">
			{/* Heap Type Selector */}
			<div className="control-group">
				<h3 className="control-title">ヒープタイプ</h3>
				<div className="heap-type-selector">
					<button
						type="button"
						className={`heap-type-btn ${heapType === "max" ? "active" : ""}`}
						onClick={() => {
							onTypeChange("max");
						}}
						disabled={isAnimating}
					>
						最大ヒープ
					</button>
					<button
						type="button"
						className={`heap-type-btn ${heapType === "min" ? "active" : ""}`}
						onClick={() => {
							onTypeChange("min");
						}}
						disabled={isAnimating}
					>
						最小ヒープ
					</button>
				</div>
			</div>

			{/* Add Element */}
			<div className="control-group">
				<h3 className="control-title">要素の追加</h3>
				<form onSubmit={handleAddElement} className="input-group">
					<input
						type="number"
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
						}}
						placeholder="1-999の数値"
						min="1"
						max="999"
						className="input-field"
						disabled={isAnimating}
					/>
					<button
						type="submit"
						className="btn primary"
						disabled={isAnimating || !inputValue}
					>
						追加
					</button>
				</form>
				<button
					type="button"
					onClick={onAddRandom}
					className="btn secondary"
					disabled={isAnimating}
				>
					ランダム追加
				</button>
			</div>

			{/* Build from Array */}
			<div className="control-group">
				<h3 className="control-title">配列からヒープ構築</h3>
				<form onSubmit={handleBuildHeap} className="input-group">
					<input
						type="text"
						value={arrayInput}
						onChange={(e) => {
							setArrayInput(e.target.value);
						}}
						placeholder="例: 10,5,3,8,2,7"
						className="input-field"
						disabled={isAnimating}
					/>
					<button
						type="submit"
						className="btn primary"
						disabled={isAnimating || !arrayInput}
					>
						構築
					</button>
				</form>
			</div>

			{/* Operations */}
			<div className="control-group">
				<h3 className="control-title">🔍 基本操作</h3>
				<div className="button-grid">
					<button
						type="button"
						onClick={onLevelOrderTraversal}
						className="btn primary"
						disabled={isAnimating}
					>
						🔄 レベル順走査
					</button>
					<button
						type="button"
						onClick={onResetAnimation}
						className="btn secondary"
						disabled={!isAnimating}
					>
						↩️ リセット
					</button>
				</div>
			</div>

			{/* Heap Operations */}
			<div className="control-group">
				<h3 className="control-title">⚡ ヒープ操作</h3>
				<div className="button-grid">
					<button
						type="button"
						onClick={onExtractRoot}
						className="btn primary"
						disabled={isAnimating}
					>
						🗑️ ルート削除
					</button>
					<button
						type="button"
						onClick={onShuffleAndHeapify}
						className="btn secondary"
						disabled={isAnimating}
					>
						🔀 シャッフル & ヒープ化
					</button>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="control-group">
				<h3 className="control-title">🚀 クイックアクション</h3>
				<div className="button-grid">
					<button
						type="button"
						onClick={onCreateSample}
						className="btn secondary"
						disabled={isAnimating}
					>
						📋 サンプル作成
					</button>
					<button
						type="button"
						onClick={onShuffle}
						className="btn secondary"
						disabled={isAnimating}
					>
						🎲 シャッフル
					</button>
					<button
						type="button"
						onClick={onClear}
						className="btn danger"
						disabled={isAnimating}
					>
						🧹 クリア
					</button>
				</div>
			</div>
		</div>
	);
}
