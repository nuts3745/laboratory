// Binary Heap types
export type HeapType = "max" | "min";

export interface HeapNode {
	value: number;
	index: number;
}

export interface Position {
	x: number;
	y: number;
}

export interface HeapState {
	data: number[];
	type: HeapType;
	activeIndex: number | null;
	parentIndex: number | null;
	childIndices: number[];
	comparingIndices: number[];
	swappingIndices: number[];
	isAnimating: boolean;
}

export interface ToastMessage {
	id: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	duration: number;
	persistent: boolean;
}

export interface HeapOperationResult {
	success: boolean;
	message: string;
	newHeap: number[];
	removedValue?: number;
}
