import type { HeapState } from "../../types/heap.js";
import { BinaryHeapUtils } from "../../utils/heapUtils.js";
import { HeapEdge, HeapNode } from "./HeapNode.js";

interface HeapVisualizerProps {
	heapState: HeapState;
	onNodeClick: (index: number) => void;
	containerWidth?: number;
	containerHeight?: number;
}

/**
 * Heap visualizer component
 * ヒープ全体の可視化を担当
 */
export function HeapVisualizer({
	heapState,
	onNodeClick,
	containerWidth = 700,
	containerHeight = 500,
}: HeapVisualizerProps) {
	// Calculate positions for all nodes
	const nodePositions = heapState.data.map((_, index) =>
		BinaryHeapUtils.calculateNodePosition(
			index,
			containerWidth,
			containerHeight,
		),
	);

	// Generate edges
	const edges = heapState.data.reduce<
		{
			parentPos: { x: number; y: number };
			childPos: { x: number; y: number };
			isHighlighted: boolean;
			key: string;
		}[]
	>((acc, _, index) => {
		const children = BinaryHeapUtils.getChildrenIndices(
			index,
			heapState.data.length,
		);

		for (const childIndex of children) {
			const isHighlighted =
				(heapState.activeIndex === index &&
					heapState.childIndices.includes(childIndex)) ||
				(heapState.activeIndex === childIndex &&
					heapState.parentIndex === index) ||
				heapState.comparingIndices.includes(index) ||
				heapState.comparingIndices.includes(childIndex);

			acc.push({
				parentPos: nodePositions[index],
				childPos: nodePositions[childIndex],
				isHighlighted,
				key: `edge-${index}-${childIndex}`,
			});
		}

		return acc;
	}, []);

	return (
		<div className="heap-visualizer">
			<div
				className="heap-container"
				style={{
					width: containerWidth,
					height: containerHeight,
					position: "relative",
				}}
			>
				{/* Render edges first (behind nodes) */}
				{edges.map((edge) => (
					<HeapEdge
						key={edge.key}
						parentPos={edge.parentPos}
						childPos={edge.childPos}
						isHighlighted={edge.isHighlighted}
					/>
				))}

				{/* Render nodes */}
				{heapState.data.map((value, index) => (
					<HeapNode
						key={`node-${index}-${value}`}
						value={value}
						index={index}
						position={nodePositions[index]}
						heapState={heapState}
						onNodeClick={onNodeClick}
					/>
				))}

				{/* Empty state */}
				{heapState.data.length === 0 && (
					<div className="empty-heap-message">
						<p>ヒープが空です</p>
						<p>要素を追加して始めましょう</p>
					</div>
				)}
			</div>
		</div>
	);
}
