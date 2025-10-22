import { useCallback, useEffect, useRef } from "react";

/**
 * Advanced high-performance animation system
 * 元のHTML版と同等以上の高度なアニメーション機能を提供
 */
export interface AnimationStep {
	id: string;
	type: "highlight" | "compare" | "swap" | "traverse" | "insert" | "delete";
	indices: number[];
	duration?: number;
	callback?: () => void;
	description?: string;
}

export interface AnimationConfig {
	duration: number;
	fps: number;
	easing: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface HeapifyStep {
	type: "compare" | "swap" | "highlight";
	indices: number[];
	description?: string;
}

export interface AnimationCallbacks {
	onCompare: (indices: number[], isComparing: boolean) => void;
	onSwap: (i1: number, i2: number) => void;
	onHighlight: (index: number, isActive: boolean) => void;
	onStep?: (description: string) => void;
}

export const useAdvancedAnimation = () => {
	const animationRef = useRef<number | null>(null);
	const stepIndexRef = useRef(0);
	const isRunningRef = useRef(false);
	const stopAnimationRef = useRef<(() => void) | null>(null);

	const defaultConfig: AnimationConfig = {
		duration: 800,
		fps: 60,
		easing: "ease-out",
	};

	const executeSteps = useCallback(
		(
			steps: AnimationStep[],
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				if (isRunningRef.current) {
					stopAnimationRef.current?.();
				}

				const mergedConfig = { ...defaultConfig, ...config };
				stepIndexRef.current = 0;
				isRunningRef.current = true;

				const executeStep = (stepIndex: number) => {
					if (stepIndex >= steps.length) {
						isRunningRef.current = false;
						resolve();
						return;
					}

					const step = steps[stepIndex];
					const stepDuration = step.duration ?? mergedConfig.duration;

					if (step.callback) {
						step.callback();
					}

					setTimeout(() => {
						stepIndexRef.current++;
						executeStep(stepIndex + 1);
					}, stepDuration);
				};

				executeStep(0);
			});
		},
		[],
	);

	const executeAnimatedTraversal = useCallback(
		(
			indices: number[],
			onStep: (index: number, isActive: boolean) => void,
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				if (isRunningRef.current) {
					stopAnimationRef.current?.();
				}

				const mergedConfig = { ...defaultConfig, ...config };
				stepIndexRef.current = 0;
				isRunningRef.current = true;

				const executeTraversalStep = (stepIndex: number) => {
					if (stepIndex >= indices.length) {
						// Clear all highlights
						for (const index of indices) {
							onStep(index, false);
						}
						isRunningRef.current = false;
						resolve();
						return;
					}

					const currentIndex = indices[stepIndex];

					// Clear previous highlight
					if (stepIndex > 0) {
						onStep(indices[stepIndex - 1], false);
					}

					// Highlight current
					onStep(currentIndex, true);

					setTimeout(() => {
						stepIndexRef.current++;
						executeTraversalStep(stepIndex + 1);
					}, mergedConfig.duration / 2);
				};

				executeTraversalStep(0);
			});
		},
		[],
	);

	const executeSwapAnimation = useCallback(
		(
			index1: number,
			index2: number,
			onSwap: (i1: number, i2: number) => void,
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				const mergedConfig = { ...defaultConfig, ...config };

				onSwap(index1, index2);

				setTimeout(() => {
					resolve();
				}, mergedConfig.duration);
			});
		},
		[],
	);

	const executeCompareAnimation = useCallback(
		(
			indices: number[],
			onCompare: (indices: number[], isComparing: boolean) => void,
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				const mergedConfig = { ...defaultConfig, ...config };

				onCompare(indices, true);

				setTimeout(() => {
					onCompare(indices, false);
					resolve();
				}, mergedConfig.duration);
			});
		},
		[],
	);

	const executeHeapifyAnimation = useCallback(
		(
			steps: HeapifyStep[],
			callbacks: AnimationCallbacks,
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				if (isRunningRef.current) {
					stopAnimationRef.current?.();
				}

				const mergedConfig = { ...defaultConfig, ...config };
				stepIndexRef.current = 0;
				isRunningRef.current = true;

				const executeHeapifyStep = (stepIndex: number) => {
					if (stepIndex >= steps.length) {
						isRunningRef.current = false;
						resolve();
						return;
					}

					const step = steps[stepIndex];

					if (callbacks.onStep && step.description) {
						callbacks.onStep(step.description);
					}

					switch (step.type) {
						case "compare":
							callbacks.onCompare(step.indices, true);
							if (callbacks.onStep && step.description) {
								callbacks.onStep(step.description);
							}
							setTimeout(() => {
								callbacks.onCompare(step.indices, false);
								setTimeout(() => {
									executeHeapifyStep(stepIndex + 1);
								}, 200);
							}, mergedConfig.duration / 2);
							break;

						case "swap":
							if (step.indices.length >= 2) {
								if (callbacks.onStep && step.description) {
									callbacks.onStep(step.description);
								}
								callbacks.onSwap(step.indices[0], step.indices[1]);
								setTimeout(() => {
									executeHeapifyStep(stepIndex + 1);
								}, mergedConfig.duration * 0.8);
							} else {
								executeHeapifyStep(stepIndex + 1);
							}
							break;

						case "highlight":
							for (const index of step.indices) {
								callbacks.onHighlight(index, true);
							}
							if (callbacks.onStep && step.description) {
								callbacks.onStep(step.description);
							}
							setTimeout(() => {
								for (const index of step.indices) {
									callbacks.onHighlight(index, false);
								}
								setTimeout(() => {
									executeHeapifyStep(stepIndex + 1);
								}, 200);
							}, mergedConfig.duration / 2);
							break;

						default:
							executeHeapifyStep(stepIndex + 1);
					}
				};

				executeHeapifyStep(0);
			});
		},
		[],
	);

	const executeLevelOrderTraversal = useCallback(
		(
			heapData: number[],
			onStep: (index: number, isActive: boolean) => void,
			config: Partial<AnimationConfig> = {},
		): Promise<void> => {
			return new Promise((resolve) => {
				if (isRunningRef.current) {
					stopAnimationRef.current?.();
				}

				const mergedConfig = { ...defaultConfig, ...config };
				stepIndexRef.current = 0;
				isRunningRef.current = true;

				// Generate level-order indices
				const indices: number[] = [];
				for (let i = 0; i < heapData.length; i++) {
					indices.push(i);
				}

				executeAnimatedTraversal(indices, onStep, mergedConfig)
					.then(() => {
						resolve();
					})
					.catch(() => {
						resolve();
					});
			});
		},
		[executeAnimatedTraversal],
	);

	const stopAnimation = useCallback(() => {
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current);
			animationRef.current = null;
		}
		isRunningRef.current = false;
		stepIndexRef.current = 0;
	}, []);

	// Update ref after render
	useEffect(() => {
		stopAnimationRef.current = stopAnimation;
	}, [stopAnimation]);

	const isRunning = useCallback(() => {
		return isRunningRef.current;
	}, []);

	const getCurrentStep = useCallback(() => {
		return stepIndexRef.current;
	}, []);

	return {
		executeSteps,
		executeAnimatedTraversal,
		executeSwapAnimation,
		executeCompareAnimation,
		executeHeapifyAnimation,
		executeLevelOrderTraversal,
		stopAnimation,
		isRunning,
		getCurrentStep,
	};
};
