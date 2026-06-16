import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { DraggableNode } from './draggableNode';
import { NODE_REGISTRY } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <aside className={`pipeline-toolbar ${isOpen ? 'pipeline-toolbar--open' : ''}`}>
            <button
                className="pipeline-toolbar__toggle"
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
            >
                <span>Nodes</span>
                <ChevronRight
                    className="pipeline-toolbar__toggle-icon"
                    size={14}
                    strokeWidth={2.4}
                />
            </button>

            <div className="pipeline-toolbar__panel">
              <div className="pipeline-toolbar__header">
                <span className="pipeline-toolbar__eyebrow">Nodes</span>
                <h1 className="pipeline-toolbar__title">Pipeline Builder</h1>
              </div>

              <div className="pipeline-toolbar__nodes">
                {Object.entries(NODE_REGISTRY).map(([type, config]) => (
                    <DraggableNode
                        key={type}
                        type={type}
                        icon={config.icon}
                        label={config.title}
                    />
                ))}
              </div>
            </div>
        </aside>
    );
};
