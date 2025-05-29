import { useCallback, useMemo } from 'react';
import './BinaryHeap.css';
import type { HeapType } from './types/heap.js';
import { useHeapState } from './hooks/useHeapState.js';
import { useHeapOperations } from './hooks/useHeapOperations.js';
import { useAdvancedAnimation } from './hooks/useAdvancedAnimation.js';
import { HeapVisualizer } from './components/heap/HeapVisualizer.js';
import { ArrayDisplay } from './components/heap/ArrayDisplay.js';
import { HeapControls } from './components/heap/HeapControls.js';
import { InfoPanel } from './components/heap/InfoPanel.js';
import { ToastContainer } from './components/ui/ToastContainer.js';

/**
 * Main Binary Heap Visualizer Component
 * 疎結合・高凝集を実現するメインコンポーネント
 * useEffectを使わずに純粋な関数とステート管理で実装
 */
export const BinaryHeap: React.FC<{ isClicked: boolean, setIsClicked: (arg0: boolean) => void }> = (props): React.ReactElement => {
    const { heapState, toasts, actions } = useHeapState('max');
    const heapOperations = useHeapOperations();
    const animation = useAdvancedAnimation();

    // Animation utility without useEffect
    const executeAnimation = useCallback((animationSteps: Array<() => void>) => {
        if (heapState.isAnimating) return;

        actions.setAnimatingState(true);

        const executeNextStep = (index: number) => {
            if (index >= animationSteps.length) {
                actions.setAnimatingState(false);
                actions.clearHighlights();
                return;
            }

            animationSteps[index]();
            setTimeout(() => executeNextStep(index + 1), 800);
        };

        executeNextStep(0);
    }, [heapState.isAnimating, actions]);

    // Advanced animation callbacks with stable references
    const animationCallbacks = useMemo(() => ({
        onCompare: (indices: number[], isComparing: boolean) => {
            if (isComparing) {
                actions.setComparingNodes(indices);
            } else {
                actions.clearHighlights();
            }
        },

        onSwap: (i1: number, i2: number) => {
            actions.setSwappingNodes([i1, i2]);
            // Perform the actual swap in state
            const newData = [...heapState.data];
            [newData[i1], newData[i2]] = [newData[i2], newData[i1]];
            actions.updateHeapData(newData);
        },

        onHighlight: (index: number, isActive: boolean) => {
            if (isActive) {
                actions.setActiveNode(index);
            } else {
                actions.clearHighlights();
            }
        },

        onStep: (description: string) => {
            actions.addToast(description, 'info');
        }
    }), [actions, heapState.data]);

    // Handler functions
    const handleNodeClick = useCallback((index: number) => {
        if (heapState.isAnimating) return;

        if (heapState.activeIndex === index) {
            actions.clearHighlights();
        } else {
            actions.setActiveNode(index);
        }
    }, [heapState.activeIndex, heapState.isAnimating, actions]);

    const handleTypeChange = useCallback((type: HeapType) => {
        if (heapState.isAnimating) return;

        actions.updateHeapType(type);
        actions.clearHighlights();

        if (heapState.data.length > 0) {
            const { newData } = heapOperations.buildHeap(heapState.data, type);
            actions.updateHeapData(newData);
            actions.addToast(`${type === 'max' ? '最大' : '最小'}ヒープに変換しました`, 'success');
        }
    }, [heapState.data, heapState.isAnimating, actions, heapOperations]);

    const handleAddElement = useCallback((value: number) => {
        if (heapState.isAnimating) return;

        const result = heapOperations.insertElement(heapState.data, value, heapState.type);

        if (result.success) {
            // Animation steps for insertion
            const oldLength = heapState.data.length;
            const animationSteps = [
                () => {
                    actions.updateHeapData(result.newHeap);
                    actions.setActiveNode(oldLength); // Highlight newly added element
                },
                () => {
                    // Show heapify up animation would go here
                    actions.clearHighlights();
                }
            ];

            executeAnimation(animationSteps);
            actions.addToast(result.message, 'success');
        } else {
            actions.addToast(result.message, 'error');
        }
    }, [heapState.data, heapState.type, heapState.isAnimating, actions, heapOperations, executeAnimation]);

    const handleAddRandom = useCallback(() => {
        const randomValue = Math.floor(Math.random() * 100) + 1;
        handleAddElement(randomValue);
    }, [handleAddElement]);

    const handleExtractRoot = useCallback(() => {
        if (heapState.isAnimating) return;

        const result = heapOperations.extractRoot(heapState.data, heapState.type);

        if (result.success) {
            const animationSteps = [
                () => {
                    actions.setActiveNode(0); // Highlight root
                },
                () => {
                    actions.updateHeapData(result.newHeap);
                    actions.clearHighlights();
                }
            ];

            executeAnimation(animationSteps);
            actions.addToast(result.message, 'success');
        } else {
            actions.addToast(result.message, 'error');
        }
    }, [heapState.data, heapState.type, heapState.isAnimating, actions, heapOperations, executeAnimation]);

    const handleBuildHeap = useCallback((values: number[]) => {
        if (heapState.isAnimating) return;

        const { newData, operations } = heapOperations.buildHeap(values, heapState.type);

        // First set the raw data
        actions.updateHeapData(values);

        // Then animate the build process
        const animationSteps = operations.flatMap(operation => [
            () => actions.setActiveNode(operation.index),
            () => {
                if (operation.swaps.length > 0) {
                    actions.setSwappingNodes(operation.swaps.flatMap(swap => [swap.from, swap.to]));
                }
            },
            () => actions.clearHighlights()
        ]);

        // Final step: set the completed heap
        animationSteps.push(() => actions.updateHeapData(newData));

        executeAnimation(animationSteps);
        actions.addToast(`${values.length}個の要素からヒープを構築しました`, 'success');
    }, [heapState.type, heapState.isAnimating, actions, heapOperations, executeAnimation]);

    const handleShuffle = useCallback(() => {
        if (heapState.isAnimating || heapState.data.length === 0) return;

        const shuffled = [...heapState.data].sort(() => Math.random() - 0.5);
        handleBuildHeap(shuffled);
    }, [heapState.data, heapState.isAnimating, handleBuildHeap]);

    const handleClear = useCallback(() => {
        if (heapState.isAnimating) return;

        actions.updateHeapData([]);
        actions.clearHighlights();
        actions.addToast('ヒープをクリアしました', 'info');
    }, [heapState.isAnimating, actions]);

    const handleCreateSample = useCallback(() => {
        if (heapState.isAnimating) return;

        const sampleData = heapOperations.generateRandomData(10);
        handleBuildHeap(sampleData);
    }, [heapState.isAnimating, heapOperations, handleBuildHeap]);

    // Advanced animation handlers
    const handleLevelOrderTraversal = useCallback(() => {
        if (heapState.isAnimating || heapState.data.length === 0) return;

        actions.addToast('レベル順走査を開始します', 'info');
        
        animation.executeLevelOrderTraversal(heapState.data, animationCallbacks.onHighlight)
            .then(() => {
                actions.addToast('レベル順走査が完了しました', 'success');
            })
            .catch(() => {
                actions.addToast('走査が中断されました', 'warning');
            });
    }, [heapState.data, heapState.isAnimating, animation, animationCallbacks.onHighlight, actions]);

    const handleShuffleAndHeapify = useCallback(() => {
        if (heapState.isAnimating || heapState.data.length === 0) return;

        const shuffledData = heapOperations.shuffleArray(heapState.data);
        actions.updateHeapData(shuffledData);
        actions.addToast('配列をシャッフルしました', 'info');

        setTimeout(() => {
            const steps = heapOperations.getBuildHeapAnimationSteps(shuffledData, heapState.type);
            
            animation.executeHeapifyAnimation(steps, animationCallbacks)
                .then(() => {
                    const heapifiedData = heapOperations.buildHeap(shuffledData, heapState.type);
                    actions.updateHeapData(heapifiedData.newData);
                    actions.addToast('ヒープ化が完了しました', 'success');
                })
                .catch(() => {
                    actions.addToast('ヒープ化が中断されました', 'warning');
                });
        }, 500);
    }, [heapState.data, heapState.type, heapState.isAnimating, heapOperations, animation, animationCallbacks, actions]);

    const handleResetAnimation = useCallback(() => {
        animation.stopAnimation();
        actions.setAnimatingState(false);
        actions.clearHighlights();
        actions.addToast('アニメーションをリセットしました', 'info');
    }, [animation, actions]);

    return (
        <div className="binary-heap-container">
            <div className="heap-wrapper">
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <div
                    className="back-link"
                    onClick={() => props.setIsClicked(false)}
                >←</div>
                <h1 className="heap-title">🌳 バイナリヒープ可視化ツール</h1>

                <div className="heap-main-content">
                    <HeapVisualizer
                        heapState={heapState}
                        onNodeClick={handleNodeClick}
                    />

                    <ArrayDisplay
                        heapState={heapState}
                        onCellClick={handleNodeClick}
                    />

                    <HeapControls
                        heapType={heapState.type}
                        isAnimating={heapState.isAnimating}
                        onTypeChange={handleTypeChange}
                        onAddElement={handleAddElement}
                        onAddRandom={handleAddRandom}
                        onExtractRoot={handleExtractRoot}
                        onBuildHeap={handleBuildHeap}
                        onShuffle={handleShuffle}
                        onClear={handleClear}
                        onCreateSample={handleCreateSample}
                        onLevelOrderTraversal={handleLevelOrderTraversal}
                        onShuffleAndHeapify={handleShuffleAndHeapify}
                        onResetAnimation={handleResetAnimation}
                    />

                    <InfoPanel heapState={heapState} />
                </div>

                <footer style={{ textAlign: 'center', marginTop: '40px', color: '#718096', fontSize: '14px' }}>
                    <p>バイナリヒープの構造と操作を視覚的に学習できるツールです</p>
                </footer>
            </div>

            <ToastContainer
                toasts={toasts}
                onToastClose={actions.removeToast}
            />
        </div>
    );
}