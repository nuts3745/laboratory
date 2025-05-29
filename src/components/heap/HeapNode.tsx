import type { HeapState } from '../../types/heap.js';

interface HeapNodeProps {
    value: number;
    index: number;
    position: { x: number; y: number };
    heapState: HeapState;
    onNodeClick: (index: number) => void;
}

/**
 * Individual heap node component
 * 単一責任の原則に従い、ノードの描画のみを担当
 */
export function HeapNode({ value, index, position, heapState, onNodeClick }: HeapNodeProps) {
    const getNodeClassName = () => {
        const classes = ['heap-node'];

        if (heapState.activeIndex === index) classes.push('active');
        if (heapState.parentIndex === index) classes.push('parent', 'parent-highlight');
        if (heapState.childIndices.includes(index)) classes.push('child', 'child-highlight');
        if (heapState.comparingIndices.includes(index)) classes.push('comparing');
        if (heapState.swappingIndices.includes(index)) classes.push('swapping');

        return classes.join(' ');
    };

    const handleClick = () => {
        if (!heapState.isAnimating) {
            onNodeClick(index);
        }
    };

    return (
        <button
            type="button"
            className={getNodeClassName()}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label={`ヒープノード: 値${value}, インデックス${index}`}
        >
            {value}
        </button>
    );
}

interface HeapEdgeProps {
    parentPos: { x: number; y: number };
    childPos: { x: number; y: number };
    isHighlighted: boolean;
}

/**
 * Edge component for connecting nodes
 * エッジの描画のみを担当する純粋なコンポーネント
 */
export function HeapEdge({ parentPos, childPos, isHighlighted }: HeapEdgeProps) {
    const dx = childPos.x - parentPos.x;
    const dy = childPos.y - parentPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Adjust positions to start/end at node borders
    const nodeRadius = 22.5; // Half of node width/height
    const startX = parentPos.x + (dx / length) * nodeRadius;
    const startY = parentPos.y + (dy / length) * nodeRadius;

    const adjustedLength = length - (2 * nodeRadius);

    return (
        <div
            className={`heap-edge ${isHighlighted ? 'highlighted' : ''}`}
            style={{
                left: `${startX}px`,
                top: `${startY}px`,
                width: `${adjustedLength}px`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 50%',
            }}
        />
    );
}
