import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

const VARIABLE_PATTERN = /{{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*}}/g;

const getDefaultValue = (field, node) => {
  if (typeof field.defaultValue === 'function') {
    return field.defaultValue(node);
  }

  return field.defaultValue ?? '';
};

const getInitialFieldValues = (fields, node) => {
  return fields.reduce((values, field) => {
    values[field.name] = node.data?.[field.name] ?? getDefaultValue(field, node);
    return values;
  }, {});
};

const getHandleId = (handle, nodeId) => {
  if (typeof handle.id === 'function') {
    return handle.id(nodeId);
  }

  return handle.id ? `${nodeId}-${handle.id}` : undefined;
};

const getVariables = (text) => {
  const variables = new Set();
  const source = String(text ?? '');
  VARIABLE_PATTERN.lastIndex = 0;
  let match = VARIABLE_PATTERN.exec(source);

  while (match) {
    variables.add(match[1]);
    match = VARIABLE_PATTERN.exec(source);
  }

  return Array.from(variables);
};

const getAutoSize = (config, fieldValues) => {
  if (!config.autoResize?.field) {
    return {};
  }

  const text = String(fieldValues[config.autoResize.field] ?? '');
  const lines = text.split('\n');
  const longestLine = Math.max(...lines.map((line) => line.length), 0);
  const width = Math.min(Math.max(200, longestLine * 7 + 56), 360);
  const height = Math.min(Math.max(112, lines.length * 18 + 108), 320);

  return {
    width,
    minHeight: height,
  };
};

const renderField = (field, value, onChange) => {
  const commonProps = {
    id: field.name,
    name: field.name,
    value,
    onChange: (event) => onChange(field.name, event.target.value),
    className: 'node-field-control',
  };

  if (field.type === 'select') {
    return (
      <select {...commonProps}>
        {field.options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    );
  }

  if (field.type === 'textarea') {
    const rowCount = field.autoResize
      ? Math.min(Math.max(2, String(value ?? '').split('\n').length), 8)
      : field.rows ?? 3;

    return (
      <textarea
        {...commonProps}
        rows={rowCount}
        className="node-field-control resize-y"
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={field.type ?? 'text'}
    />
  );
};

export const BaseNode = ({ id, data, config }) => {
  const fields = config.fields ?? [];
  const Icon = config.icon;
  const removeNode = useStore((state) => state.removeNode);
  const updateNodeInternals = useUpdateNodeInternals();
  const [fieldValues, setFieldValues] = useState(() =>
    getInitialFieldValues(fields, { id, data })
  );

  const variableNames = useMemo(() => {
    if (!config.variableHandles?.field) {
      return [];
    }

    return getVariables(fieldValues[config.variableHandles.field]);
  }, [config.variableHandles, fieldValues]);

  const variableHandles = useMemo(() => {
    return variableNames.map((variableName, index) => ({
      type: 'target',
      position: Position.Left,
      id: variableName,
      variableName,
      style: {
        top: `${((index + 1) / (variableNames.length + 1)) * 100}%`,
      },
    }));
  }, [variableNames]);

  const handles = useMemo(
    () => [...variableHandles, ...(config.handles ?? [])],
    [config.handles, variableHandles]
  );

  const nodeStyle = useMemo(
    () => getAutoSize(config, fieldValues),
    [config, fieldValues]
  );

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals, variableNames]);

  const updateField = (fieldName, fieldValue) => {
    setFieldValues((values) => ({
      ...values,
      [fieldName]: fieldValue,
    }));
  };

  return (
    <div className="pipeline-node" style={nodeStyle}>
      {handles.map((handle) => (
        <Handle
          key={`${handle.type}-${handle.position}-${handle.id}`}
          type={handle.type}
          position={handle.position}
          id={getHandleId(handle, id)}
          style={{ zIndex: 5, ...handle.style }}
        />
      ))}
      {variableHandles.map((handle) => (
        <span
          key={`${handle.variableName}-label`}
          className="pipeline-node__variable-label"
          style={handle.style}
        >
          {handle.variableName}
        </span>
      ))}

      <div className="pipeline-node__header">
        <div className="pipeline-node__title-row">
          <span className="pipeline-node__title-group">
            <span className="node-icon node-icon--small">
              {Icon && <Icon size={12} strokeWidth={2.2} />}
            </span>
            <span className="pipeline-node__title">{config.title}</span>
          </span>
          <button
            className="pipeline-node__delete"
            type="button"
            aria-label={`Delete ${config.title} node`}
            onClick={() => removeNode(id)}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
        {config.description && (
          <span className="pipeline-node__description">{config.description}</span>
        )}
      </div>

      <div className="pipeline-node__content">
        {fields.length > 0 ? (
          fields.map((field) => (
            <label key={field.name} htmlFor={field.name} className="node-field">
              <span className="node-field__label">{field.label}</span>
              {renderField(field, fieldValues[field.name], updateField)}
            </label>
          ))
        ) : (
          <span className="pipeline-node__body">{config.body}</span>
        )}
      </div>
    </div>
  );
};
