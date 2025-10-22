import type { HeapState } from "../../types/heap.js";

interface ArrayDisplayProps {
	heapState: HeapState;
	onCellClick: (index: number) => void;
}

/**
 * Array representation of the heap
 * 配列表示の責任のみを持つコンポーネント
 */
export function ArrayDisplay({ heapState, onCellClick }: ArrayDisplayProps) {
	const getCellClassName = (index: number) => {
		const classes = ["array-cell"];

		if (heapState.activeIndex === index) classes.push("active");
		if (heapState.parentIndex === index)
			classes.push("parent", "parent-highlight");
		if (heapState.childIndices.includes(index))
			classes.push("child", "child-highlight");
		if (heapState.comparingIndices.includes(index)) classes.push("comparing");
		if (heapState.swappingIndices.includes(index)) classes.push("swapping");

		return classes.join(" ");
	};

	const handleCellClick = (index: number) => {
		if (!heapState.isAnimating) {
			onCellClick(index);
		}
	};

	return (
		<div className="array-container">
			<h3 className="array-title">配列表現</h3>
			<div className="array-display">
				{heapState.data.length === 0 ? (
					<div className="empty-array">配列が空です</div>
				) : (
					heapState.data.map((value, index) => (
						<button
							type="button"
							key={`cell-${index.toString()}-${value.toString()}`}
							className={getCellClassName(index)}
							onClick={() => {
								handleCellClick(index);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleCellClick(index);
								}
							}}
							aria-label={`配列要素: インデックス${index.toString()}, 値${value.toString()}`}
						>
							<div className="cell-index">{index}</div>
							<div className="cell-value">{value}</div>
						</button>
					))
				)}
			</div>
		</div>
	);
}
