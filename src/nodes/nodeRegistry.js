import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import {
  Bot,
  Braces,
  Calculator,
  Database,
  Filter,
  Globe,
  Inbox,
  Mail,
  Upload,
} from 'lucide-react';

export const NODE_REGISTRY = {
  customInput: {
    title: 'Input',
    icon: Inbox,
    description: 'Receives data for the pipeline.',
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'value',
      },
    ],
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: ({ id }) => id.replace('customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: ['Text', 'File'],
      },
    ],
  },
  customOutput: {
    title: 'Output',
    icon: Upload,
    description: 'Returns the final pipeline result.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'value',
      },
    ],
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: ({ id }) => id.replace('customOutput-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { label: 'Text', value: 'Text' },
          { label: 'Image', value: 'File' },
        ],
      },
    ],
  },
  text: {
    title: 'Text',
    icon: Braces,
    description: 'Use {{ input }} to create variable inputs.',
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: 'output',
      },
    ],
    fields: [
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        defaultValue: '{{input}}',
        rows: 2,
        autoResize: true,
      },
    ],
    autoResize: {
      field: 'text',
    },
    variableHandles: {
      field: 'text',
    },
  },
  llm: {
    title: 'LLM',
    icon: Bot,
    body: 'This is a LLM.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'system',
        style: { top: '33%' },
      },
      {
        type: 'target',
        position: Position.Left,
        id: 'prompt',
        style: { top: '66%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'response',
      },
    ],
    fields: [],
  },
  api: {
    title: 'API',
    icon: Globe,
    description: 'Calls an external endpoint.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'request',
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'response',
      },
    ],
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'GET',
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      },
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        defaultValue: 'https://api.example.com',
      },
    ],
  },
  math: {
    title: 'Math',
    icon: Calculator,
    description: 'Applies a numeric operation.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'a',
        style: { top: '35%' },
      },
      {
        type: 'target',
        position: Position.Left,
        id: 'b',
        style: { top: '65%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'result',
      },
    ],
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Add',
        options: ['Add', 'Subtract', 'Multiply', 'Divide'],
      },
    ],
  },
  email: {
    title: 'Email',
    icon: Mail,
    description: 'Formats an email message.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'body',
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'message',
      },
    ],
    fields: [
      {
        name: 'recipient',
        label: 'Recipient',
        type: 'email',
        defaultValue: 'user@example.com',
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        defaultValue: 'Pipeline update',
      },
    ],
  },
  database: {
    title: 'Database',
    icon: Database,
    description: 'Reads or writes stored records.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'query',
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'records',
      },
    ],
    fields: [
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Select',
        options: ['Select', 'Insert', 'Update', 'Delete'],
      },
      {
        name: 'table',
        label: 'Table',
        type: 'text',
        defaultValue: 'users',
      },
    ],
  },
  filter: {
    title: 'Filter',
    icon: Filter,
    description: 'Routes data that matches a condition.',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: 'input',
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'true',
        style: { top: '35%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: 'false',
        style: { top: '65%' },
      },
    ],
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        defaultValue: 'value !== null',
      },
    ],
  },
};

export const createNode = (type) => {
  return function Node(props) {
    return (
      <BaseNode
        {...props}
        config={NODE_REGISTRY[type]}
      />
    );
  };
};

export const nodeTypes = Object.keys(NODE_REGISTRY).reduce((types, type) => {
  types[type] = createNode(type);
  return types;
}, {});
