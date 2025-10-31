import { useState, useCallback } from 'react';
import { reorderTasks, moveTaskBetweenColumns } from '../utils/task.utils';

export const useKanbanBoard = (initialColumns = [], initialTasks = {}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  // Move task within same column
  const moveTaskInColumn = useCallback((columnId, fromIndex, toIndex) => {
    setColumns(prevColumns => 
      prevColumns.map(column => {
        if (column.id === columnId) {
          const reorderedTaskIds = reorderTasks(column.taskIds, fromIndex, toIndex);
          return { ...column, taskIds: reorderedTaskIds };
        }
        return column;
      })
    );
  }, []);

  // Move task between columns
  const moveTaskBetweenColumnsHandler = useCallback((
    taskId,
    sourceColumnId,
    destinationColumnId,
    sourceIndex,
    destinationIndex
  ) => {
    setColumns(prevColumns => {
      const sourceColumn = prevColumns.find(col => col.id === sourceColumnId);
      const destColumn = prevColumns.find(col => col.id === destinationColumnId);

      if (!sourceColumn || !destColumn) return prevColumns;

      const { source: updatedSource, destination: updatedDest } = 
        moveTaskBetweenColumns(
          sourceColumn.taskIds,
          destColumn.taskIds,
          sourceIndex,
          destinationIndex
        );

      return prevColumns.map(column => {
        if (column.id === sourceColumnId) {
          return { ...column, taskIds: updatedSource };
        }
        if (column.id === destinationColumnId) {
          return { ...column, taskIds: updatedDest };
        }
        return column;
      });
    });

    // Update task status
    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        status: destinationColumnId,
      }
    }));
  }, []);

  // Create new task
  const createTask = useCallback((columnId, taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      ...taskData,
      status: columnId,
    };

    setTasks(prev => ({ ...prev, [newTask.id]: newTask }));
    
    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, taskIds: [...column.taskIds, newTask.id] }
          : column
      )
    );

    return newTask;
  }, []);

  // Update existing task
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates }
    }));
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prevColumns => 
      prevColumns.map(column => ({
        ...column,
        taskIds: column.taskIds.filter(id => id !== taskId)
      }))
    );
  }, []);

  // Filter tasks based on search and filters
  const getFilteredTasks = useCallback((columnTasks) => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      return columnTasks;
    }

    return columnTasks.filter(taskId => {
      const task = tasks[taskId];
      if (!task) return false;

      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesTags = !filters.tags || 
        (task.tags && filters.tags.every(tag => task.tags.includes(tag)));

      return matchesSearch && matchesAssignee && matchesPriority && matchesTags;
    });
  }, [searchTerm, filters, tasks]);

  return {
    columns,
    tasks,
    searchTerm,
    filters,
    setSearchTerm,
    setFilters,
    moveTaskInColumn,
    moveTaskBetweenColumns: moveTaskBetweenColumnsHandler,
    createTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
  };
};
