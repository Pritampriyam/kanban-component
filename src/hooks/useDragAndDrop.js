import { useState, useCallback } from 'react';

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedId: null,
    dropTargetId: null,
    dragOverIndex: null,
    dragStartPosition: null,
  });

  const handleDragStart = useCallback((id, position) => {
    setDragState({
      isDragging: true,
      draggedId: id,
      dropTargetId: null,
      dragOverIndex: null,
      dragStartPosition: position,
    });
  }, []);

  const handleDragOver = useCallback((targetId, index) => {
    setDragState(prev => ({
      ...prev,
      dropTargetId: targetId,
      dragOverIndex: index,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      dropTargetId: null,
      dragOverIndex: null,
      dragStartPosition: null,
    });
  }, []);

  const handleDragCancel = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      dropTargetId: null,
      dragOverIndex: null,
      dragStartPosition: null,
    });
  }, []);

  return {
    ...dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};
