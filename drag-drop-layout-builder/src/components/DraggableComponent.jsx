// src/components/DraggableComponent.jsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const DraggableComponent = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  // Apply transformations to move the component when dragged
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    border: '1px dashed #ccc',
    padding: '10px',
    margin: '5px',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default DraggableComponent;
