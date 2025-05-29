import { useState, useCallback } from 'react';
import type { HeapState, HeapType, ToastMessage } from '../types/heap.js';
import { BinaryHeapUtils } from '../utils/heapUtils.js';

/**
 * Custom hook for managing heap state
 * State management logic を分離して疎結合を実現
 */
export function useHeapState(initialType: HeapType = 'max') {
  const [heapState, setHeapState] = useState<HeapState>({
    data: [],
    type: initialType,
    activeIndex: null,
    parentIndex: null,
    childIndices: [],
    comparingIndices: [],
    swappingIndices: [],
    isAnimating: false
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pure state update functions
  const updateHeapType = useCallback((type: HeapType) => {
    setHeapState(prev => ({ ...prev, type }));
  }, []);

  const updateHeapData = useCallback((data: number[]) => {
    setHeapState(prev => ({ ...prev, data: [...data] }));
  }, []);

  const setActiveNode = useCallback((index: number | null) => {
    setHeapState(prev => {
      const newState = { ...prev, activeIndex: index };
      
      if (index !== null) {
        // Calculate related indices
        const parentIndex = BinaryHeapUtils.getParentIndex(index);
        const childIndices = BinaryHeapUtils.getChildrenIndices(index, prev.data.length);
        
        newState.parentIndex = parentIndex;
        newState.childIndices = childIndices;
      } else {
        newState.parentIndex = null;
        newState.childIndices = [];
      }
      
      return newState;
    });
  }, []);

  const setComparingNodes = useCallback((indices: number[]) => {
    setHeapState(prev => ({ ...prev, comparingIndices: [...indices] }));
  }, []);

  const setSwappingNodes = useCallback((indices: number[]) => {
    setHeapState(prev => ({ ...prev, swappingIndices: [...indices] }));
  }, []);

  const setAnimatingState = useCallback((isAnimating: boolean) => {
    setHeapState(prev => ({ ...prev, isAnimating }));
  }, []);

  const clearHighlights = useCallback(() => {
    setHeapState(prev => ({
      ...prev,
      activeIndex: null,
      parentIndex: null,
      childIndices: [],
      comparingIndices: [],
      swappingIndices: []
    }));
  }, []);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration = 5000, persistent = false) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, message, type, duration, persistent };
    
    setToasts(prev => [...prev, newToast]);

    if (!persistent) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    heapState,
    toasts,
    actions: {
      updateHeapType,
      updateHeapData,
      setActiveNode,
      setComparingNodes,
      setSwappingNodes,
      setAnimatingState,
      clearHighlights,
      addToast,
      removeToast,
      clearAllToasts
    }
  };
}
