import { useCallback, useRef, useState } from "react";

export interface AnimationStep {
	type: "highlight" | "compare" | "swap" | "complete";
	indices: number[];
	description: string;
	duration?: number;
}

export interface AnimationState {
	isAnimating: boolean;
	currentStep: number;
	highlightedNodes: number[];
	comparingNodes: number[];
	swappingNodes: number[];
}

/**
 * シンプルなアニメーションフック
 * 複雑な非同期処理を避け、明確で予測可能な動作を提供
 */
export const useSimpleAnimation = () => {
	const [animationState, setAnimationState] = useState<AnimationState>({
		isAnimating: false,
		currentStep: 0,
		highlightedNodes: [],
		comparingNodes: [],
		swappingNodes: [],
	});

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const stepsRef = useRef<AnimationStep[]>([]);

	const clearAnimation = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setAnimationState({
			isAnimating: false,
			currentStep: 0,
			highlightedNodes: [],
			comparingNodes: [],
			swappingNodes: [],
		});
		stepsRef.current = [];
	}, []);

	const executeStep = useCallback(
		(stepIndex: number, onSwap?: (i1: number, i2: number) => void) => {
			const steps = stepsRef.current;
			if (stepIndex >= steps.length) {
				clearAnimation();
				return;
			}

			const step = steps[stepIndex];
			const duration = step.duration || 800;

			setAnimationState((prev) => ({
				...prev,
				currentStep: stepIndex,
				highlightedNodes: step.type === "highlight" ? step.indices : [],
				comparingNodes: step.type === "compare" ? step.indices : [],
				swappingNodes: step.type === "swap" ? step.indices : [],
			}));

			// スワップの場合は実際のデータ変更を実行
			if (step.type === "swap" && step.indices.length >= 2 && onSwap) {
				setTimeout(() => {
					onSwap(step.indices[0], step.indices[1]);
				}, duration / 2); // アニメーションの中間で実行
			}

			timeoutRef.current = setTimeout(() => {
				executeStep(stepIndex + 1, onSwap);
			}, duration);
		},
		[clearAnimation],
	);

	const startAnimation = useCallback(
		(steps: AnimationStep[], onSwap?: (i1: number, i2: number) => void) => {
			if (animationState.isAnimating) {
				clearAnimation();
			}

			stepsRef.current = steps;
			setAnimationState((prev) => ({
				...prev,
				isAnimating: true,
				currentStep: 0,
			}));

			executeStep(0, onSwap);
		},
		[animationState.isAnimating, clearAnimation, executeStep],
	);

	const stopAnimation = useCallback(() => {
		clearAnimation();
	}, [clearAnimation]);

	return {
		animationState,
		startAnimation,
		stopAnimation,
		isAnimating: animationState.isAnimating,
	};
};
