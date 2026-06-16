import { useRef } from 'react';
import { useStore } from './store';

export const DraggableNode = ({ type, icon, label }) => {
    const wasDragged = useRef(false);
    const createNode = useStore((state) => state.createNode);
    const Icon = icon;

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      wasDragged.current = true;
      event.currentTarget.classList.add('cursor-grabbing');
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnd = (event) => {
      event.currentTarget.classList.remove('cursor-grabbing');
      setTimeout(() => {
        wasDragged.current = false;
      }, 0);
    };

    const onClick = () => {
      if (!wasDragged.current) {
        createNode(type);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        createNode(type);
      }
    };
  
    return (
      <div
        className="draggable-node"
        role="button"
        tabIndex={0}
        aria-label={`Create ${label} node`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={onDragEnd}
        draggable
      >
          <span className="draggable-node__content">
            <span className="node-icon">
              {Icon && <Icon size={14} strokeWidth={2.2} />}
            </span>
            <span className="draggable-node__label">{label}</span>
          </span>
      </div>
    );
  };
  
