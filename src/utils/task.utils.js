import { format, isAfter, isToday, isTomorrow } from 'date-fns';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return isAfter(new Date(), dueDate) && !isToday(dueDate);
};

/**
 * Gets initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  return colors[priority] || colors.medium;
};

/**
 * Formats date for display
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else {
    return format(date, 'MMM dd');
  }
};

/**
 * Gets due date color class
 */
export const getDueDateColor = (dueDate) => {
  if (!dueDate) return 'text-neutral-500';
  
  if (isOverdue(dueDate)) {
    return 'text-error-600 font-medium';
  } else if (isToday(dueDate)) {
    return 'text-warning-600 font-medium';
  } else {
    return 'text-neutral-500';
  }
};

/**
 * Reorders tasks after drag and drop
 */
export const reorderTasks = (tasks, startIndex, endIndex) => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (sourceColumn, destColumn, sourceIndex, destIndex) => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Filters tasks based on search criteria
 */
export const filterTasks = (tasks, searchTerm, filters = {}) => {
  return tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAssignee = !filters.assignee || task.assignee === filters.assignee;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesTags = !filters.tags || filters.tags.every(tag => task.tags?.includes(tag));

    return matchesSearch && matchesAssignee && matchesPriority && matchesTags;
  });
};
