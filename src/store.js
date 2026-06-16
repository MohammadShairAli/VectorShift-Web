// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    createNode: (type, position) => {
      const nodeID = get().getNodeID(type);
      const offset = get().nodes.length * 24;
      const nodePosition = position ?? {
        x: 140 + offset,
        y: 80 + offset,
      };

      get().addNode({
        id: nodeID,
        type,
        position: nodePosition,
        data: { id: nodeID, nodeType: type },
      });
    },
    removeNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      });
    },
    removeEdge: (edgeId) => {
      set({
        edges: get().edges.filter((edge) => edge.id !== edgeId),
      });
    },
    removeEdges: (edgesToRemove) => {
      const edgeIds = new Set(edgesToRemove.map((edge) => edge.id));

      set({
        edges: get().edges.filter((edge) => !edgeIds.has(edge.id)),
      });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: '16px', width: '16px' },
          style: { strokeWidth: 2 },
        }, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
