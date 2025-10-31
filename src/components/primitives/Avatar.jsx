import React from 'react';
import clsx from 'clsx';
import { getInitials } from '../../utils/task.utils';

export const Avatar = ({ 
  name, 
  src, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const classes = clsx(
    'inline-flex items-center justify-center rounded-full bg-primary-500 text-white font-medium',
    sizes[size],
    className
  );

  if (src) {
    return (
      <img
        className={classes}
        src={src}
        alt={name}
        {...props}
      />
    );
  }

  return (
    <div className={classes} {...props}>
      {getInitials(name)}
    </div>
  );
};
