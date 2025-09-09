"use client";

import type React from "react";

import { useCallback, useState, useMemo, useRef, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { QuestionNode } from "./nodes/QuestionNode";
import { StartNode } from "./nodes/StartNode";
import { EndNode } from "./nodes/EndNode";
import { LogicNode } from "./nodes/LogicNode";
import { QuestionToolbar } from "./QuestionToolbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FlowBuilderProps {
  surveyTitle: string;
  surveyDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onQuestionsChange?: (questions: any[]) => void;
  questions?: any[];
  onPublish?: (surveyData: any) => void;
}

const initialNodes: Node[] = [
  {
    id: "start",
    type: "startNode",
    position: { x: 250, y: 50 },
    data: { label: "Start" },
  },
  {
    id: "end",
    type: "endNode",
    position: { x: 250, y: 400 },
    data: { label: "Submit" },
  },
];

const initialEdges: Edge[] = [];

export function FlowBuilder({
  surveyTitle,
  surveyDescription,
  onTitleChange,
  onDescriptionChange,
  onQuestionsChange,
  questions,
  onPublish,
}: FlowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastNodesStringRef = useRef<string>("");
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const reactFlowInstance = useRef<any>(null);
  const savedEdgesRef = useRef<Record<string, Edge[]>>({});
  const prevQuestionsRef = useRef<string[] | null>(null);
  const [toolMode, setToolMode] = useState<"none" | "cut" | "reattach" | "logic">("none");
  const pendingSourceRef = useRef<string | null>(null);
  const nodeMouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const [enforceLinear, setEnforceLinear] = useState<boolean>(true);

  const nodeTypes = useMemo(
    () => ({
      questionNode: QuestionNode,
      startNode: StartNode,
      endNode: EndNode,
      logicNode: LogicNode,
    }),
    []
  );

  // helper: build edges as a single path start -> q1 -> q2 -> ... -> end
  const buildLinearEdges = useCallback((allNodes: Node[]) => {
    const questionNodes = allNodes.filter((n) => n.type === "questionNode");
    const edges: Edge[] = [];

    if (questionNodes.length > 0) {
      edges.push({
        id: `edge-start-${questionNodes[0].id}`,
        source: "start",
        target: questionNodes[0].id,
        type: "smoothstep",
      });
      for (let i = 0; i < questionNodes.length - 1; i++) {
        edges.push({
          id: `edge-${questionNodes[i].id}-${questionNodes[i + 1].id}`,
          source: questionNodes[i].id,
          target: questionNodes[i + 1].id,
          type: "smoothstep",
        });
      }
      edges.push({
        id: `edge-${questionNodes[questionNodes.length - 1].id}-end`,
        source: questionNodes[questionNodes.length - 1].id,
        target: "end",
        type: "smoothstep",
      });
    } else {
      // no questions -> nothing between start and end
    }

    return edges;
  }, []);

  const nodesToQuestions = useCallback((allNodes: Node[]) => {
    return allNodes
      .filter((n) => n.type === "questionNode" || n.type === "logicNode")
      .map((n) => {
        if (n.type === "questionNode") {
            return {
              id: n.id,
              type: n.data?.questionType,
              title: n.data?.title,
              description: n.data?.description,
              required: n.data?.required,
              options: n.data?.options,
              routing: n.data?.routing || null,
              scaleMin: n.data?.scaleMin,
              scaleMax: n.data?.scaleMax,
              scaleMinLabel: n.data?.scaleMinLabel,
              scaleMaxLabel: n.data?.scaleMaxLabel,
              position: n.position,
              conditionalTarget: n.data?.conditionalTarget || null,
              conditionalCondition: n.data?.conditionalCondition || null,
            };
        } else if (n.type === "logicNode") {
          return {
            id: n.id,
            type: "logic",
            logicType: n.data?.type,
            condition: n.data?.condition || null,
            target: n.data?.target || null,
            position: n.position,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, []);

  // Sync incoming `questions` prop into nodes/edges
  useEffect(() => {
    if (!questions) return;

    const incomingIds = (questions as any[]).map((q: any) => q.id);

    setNodes((prevNodes) => {
      // preserve start/end nodes from prevNodes
      const startEnd = prevNodes.filter(
        (n) => n.type === "startNode" || n.type === "endNode"
      );

      // map existing question and logic nodes by id for position/data preservation
      const prevQuestionLogicNodes = prevNodes.filter(
        (n) => n.type === "questionNode" || n.type === "logicNode"
      );
      const prevById = new Map(prevQuestionLogicNodes.map((n) => [n.id, n]));

      let questionLogicNodes: Node[] = [];

      if (enforceLinear) {
        questionLogicNodes = (questions as any[]).map((q: any, i: number) => {
          const existing = prevById.get(q.id);
          if (q.type === "logic") {
            return {
              id: q.id,
              type: "logicNode",
              position: existing?.position ??
                q.position ?? { x: 250, y: 120 + i * 120 },
              data: {
                type: q.logicType,
                condition: q.condition,
                target: q.target,
              },
            };
          } else {
            return {
              id: q.id,
              type: "questionNode",
              position: existing?.position ??
                q.position ?? { x: 250, y: 120 + i * 120 },
              data: {
                questionType: q.type,
                title: q.title,
                description: q.description,
                required: q.required,
                options: q.options,
                scaleMin: q.scaleMin,
                scaleMax: q.scaleMax,
                scaleMinLabel: q.scaleMinLabel,
                scaleMaxLabel: q.scaleMaxLabel,
                conditionalTarget: q.conditionalTarget || null,
                conditionalCondition: q.conditionalCondition || null,
              },
            };
          }
        });
      } else {
        questionLogicNodes = prevQuestionLogicNodes;

        for (const q of questions as any[]) {
          if (!prevById.has(q.id)) {
            if (q.type === "logic") {
              questionLogicNodes.push({
                id: q.id,
                type: "logicNode",
                position: q.position ?? {
                  x: 250,
                  y: 150 + questionLogicNodes.length * 120,
                },
                data: {
                  type: q.logicType,
                  condition: q.condition,
                  target: q.target,
                },
              });
            } else {
              questionLogicNodes.push({
                id: q.id,
                type: "questionNode",
                position: q.position ?? {
                  x: 250,
                  y: 150 + questionLogicNodes.length * 120,
                },
                data: {
                  questionType: q.type,
                  title: q.title,
                  description: q.description,
                  required: q.required,
                  options: q.options,
                  scaleMin: q.scaleMin,
                  scaleMax: q.scaleMax,
                  scaleMinLabel: q.scaleMinLabel,
                  scaleMaxLabel: q.scaleMaxLabel,
                  conditionalTarget: q.conditionalTarget || null,
                  conditionalCondition: q.conditionalCondition || null,
                },
              });
            }
          }
        }

        // remove any nodes that were deleted upstream
        const incomingSet = new Set(incomingIds);
        questionLogicNodes = questionLogicNodes.filter((n) =>
          incomingSet.has(n.id)
        );
      }

      const newNodes = [...startEnd, ...questionLogicNodes];

      // edges: rebuild only when enforceLinear true; otherwise preserve edges but remove ones that reference removed nodes
      if (enforceLinear) {
        const newEdges = buildLinearEdges(newNodes);
        setEdges(newEdges);
      } else {
        setEdges((prevEdges) => {
          const nodeIds = new Set(newNodes.map((n) => n.id));
          return prevEdges.filter(
            (e) =>
              (nodeIds.has(String(e.source)) || e.source === "start") &&
              (nodeIds.has(String(e.target)) || e.target === "end")
          );
        });
      }

      // update prevQuestionsRef for future diffs
      prevQuestionsRef.current = incomingIds;

      return newNodes;
    });
  }, [questions, buildLinearEdges, setNodes, enforceLinear, selectedNode]);

  // Sync incoming questions prop into nodes state (preserve positions when possible)
  useEffect(() => {
    if (!arguments || !Array.isArray(arguments as any)) {
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      console.debug("FlowBuilder onConnect", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Allow dropping new question types from outside (toolbar)
  const onDragOverCanvas = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDropCanvas = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type =
        e.dataTransfer.getData("application/question-type") ||
        e.dataTransfer.getData("text/plain");
      if (!type) return;
      // compute accurate drop position relative to the ReactFlow viewport using the instance
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      let position = {
        x: clientX - (bounds?.left || 0) - 100,
        y: clientY - (bounds?.top || 0) - 20,
      };

      if (
        reactFlowInstance.current &&
        typeof reactFlowInstance.current.project === "function" &&
        bounds
      ) {
        const projected = reactFlowInstance.current.project({
          x: clientX - bounds.left,
          y: clientY - bounds.top,
        });
        position = { x: projected.x, y: projected.y };
      }

      let newNode: Node;

      if (type === "conditional" || type === "loop") {
        newNode = {
          id: `${type}-${Date.now()}`,
          type: "logicNode",
          position,
          data: {
            type: type as "conditional" | "loop",
            condition: "",
            target: "",
          },
        };
      } else {
        newNode = {
          id: `question-${Date.now()}`,
          type: "questionNode",
          position,
          data: {
            questionType: type,
            title: `${type} Question`,
            description: "",
            required: false,
            options: ["Option 1", "Option 2", "Option 3"],
          },
        };
      }
      setNodes((nds) => nds.concat(newNode));

      // Auto-connect only when enforceLinear is enabled
      if (enforceLinear) {
        const questionNodes = nodes.filter((n) => n.type === "questionNode");
        if (questionNodes.length > 0) {
          const lastQuestionNode = questionNodes[questionNodes.length - 1];
          const newEdge: Edge = {
            id: `edge-${lastQuestionNode.id}-${newNode.id}`,
            source: lastQuestionNode.id,
            target: newNode.id,
            type: "smoothstep",
          };
          setEdges((eds) => [...eds, newEdge]);
        } else {
          const startEdge: Edge = {
            id: `edge-start-${newNode.id}`,
            source: "start",
            target: newNode.id,
            type: "smoothstep",
          };
          setEdges((eds) => [...eds, startEdge]);
        }

        const endEdge: Edge = {
          id: `edge-${newNode.id}-end`,
          source: newNode.id,
          target: "end",
          type: "smoothstep",
        };
        // Remove any existing edges from question nodes directly to end so there is a single path
        setEdges((eds) => {
          const filtered = eds.filter(
            (e) =>
              !(e.target === "end" && String(e.source).startsWith("question-"))
          );
          return [...filtered, endEdge];
        });
      }
    },
    [nodes, setEdges, setNodes]
  );

  const autoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const currentNodesString = JSON.stringify(nodes);

      // Only save if nodes actually changed
      if (currentNodesString !== lastNodesStringRef.current) {
        lastNodesStringRef.current = currentNodesString;
        setLastSaved(new Date());

        if (onQuestionsChange) {
          const questions = nodes
            .filter(
              (node) =>
                node.type === "questionNode" || node.type === "logicNode"
            )
            .map((n) => {
              if (n.type === "questionNode") {
                return {
                  id: n.id,
                  type: n.data.questionType,
                  title: n.data.title,
                  description: n.data.description,
                  required: n.data.required,
                  options: n.data.options,
                  scaleMin: n.data.scaleMin,
                  scaleMax: n.data.scaleMax,
                  scaleMinLabel: n.data.scaleMinLabel,
                  scaleMaxLabel: n.data.scaleMaxLabel,
                  position: n.position,
                  conditionalTarget: n.data?.conditionalTarget || null,
                  conditionalCondition: n.data?.conditionalCondition || null,
                };
              } else if (n.type === "logicNode") {
                return {
                  id: n.id,
                  type: "logic",
                  logicType: n.data?.type,
                  condition: n.data?.condition || null,
                  target: n.data?.target || null,
                  position: n.position,
                };
              }
              return null;
            })
            .filter(Boolean);

          onQuestionsChange(questions as any[]);
        }
      }
    }, 1000);
  }, [nodes, onQuestionsChange]);

  const handleManualSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        questions: nodes
          .filter(
            (node) => node.type === "questionNode" || node.type === "logicNode"
          )
          .map((n) => {
            if (n.type === "questionNode") {
              return {
                id: n.id,
                type: n.data.questionType,
                title: n.data.title,
                description: n.data.description,
                required: n.data.required,
                options: n.data.options,
                scaleMin: n.data.scaleMin,
                scaleMax: n.data.scaleMax,
                scaleMinLabel: n.data.scaleMinLabel,
                scaleMaxLabel: n.data.scaleMaxLabel,
                conditionalTarget: n.data?.conditionalTarget || null,
                conditionalCondition: n.data?.conditionalCondition || null,
              };
            } else if (n.type === "logicNode") {
              return {
                id: n.id,
                type: "logic",
                logicType: n.data?.type,
                condition: n.data?.condition || null,
                target: n.data?.target || null,
              };
            }
            return null;
          })
          .filter(Boolean) as any[],
        status: "draft",
        responses: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
      };

      const surveyId = `survey_${Date.now()}`;
      localStorage.setItem(surveyId, JSON.stringify(surveyData));
      setLastSaved(new Date());

      if (onQuestionsChange) {
        onQuestionsChange(surveyData.questions);
      }
    } catch (error) {
      console.error("Failed to save survey:", error);
      alert("Failed to save survey. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [surveyTitle, surveyDescription, nodes, onQuestionsChange]);

  useEffect(() => {
    autoSave();
  }, [nodes, autoSave]);

  const addQuestionNode = useCallback(
    (type: string) => {
      const questionLogicNodes = nodes.filter(
        (node) => node.type === "questionNode" || node.type === "logicNode"
      );
      const yPosition =
        questionLogicNodes.length > 0
          ? Math.max(...questionLogicNodes.map((node) => node.position.y)) + 120
          : 150;

      let newNode: Node;

      if (type === "conditional" || type === "loop") {
        newNode = {
          id: `${type}-${Date.now()}`,
          type: "logicNode",
          position: { x: 250, y: yPosition },
          data: {
            type: type as "conditional" | "loop",
            condition: "",
            target: "",
          },
        };
      } else {
        newNode = {
          id: `question-${Date.now()}`,
          type: "questionNode",
          position: { x: 250, y: yPosition },
          data: {
            questionType: type,
            title: `${
              type === "shortAnswer"
                ? "Short Answer"
                : type === "multipleChoice"
                ? "Multiple Choice"
                : type === "checkboxes"
                ? "Checkboxes"
                : type === "dropdown"
                ? "Dropdown"
                : type === "linearScale"
                ? "Linear Scale"
                : type === "paragraph"
                ? "Paragraph"
                : type === "fileUpload"
                ? "File Upload"
                : type === "date"
                ? "Date"
                : "Email"
            } Question`,
            description: "",
            required: false,
            options:
              type === "multipleChoice" ||
              type === "checkboxes" ||
              type === "dropdown"
                ? ["Option 1", "Option 2", "Option 3"]
                : [],
            scaleMin: type === "linearScale" ? 1 : undefined,
            scaleMax: type === "linearScale" ? 5 : undefined,
            scaleMinLabel:
              type === "linearScale" ? "Strongly Disagree" : undefined,
            scaleMaxLabel:
              type === "linearScale" ? "Strongly Agree" : undefined,
            conditionalTarget: null,
            conditionalCondition: null,
          },
        };
      }
      setNodes((nds) => nds.concat(newNode));

      if (enforceLinear) {
        if (questionLogicNodes.length > 0) {
          const lastNode = questionLogicNodes[questionLogicNodes.length - 1];
          const newEdge: Edge = {
            id: `edge-${lastNode.id}-${newNode.id}`,
            source: lastNode.id,
            target: newNode.id,
            type: "smoothstep",
          };
          setEdges((eds) => [...eds, newEdge]);
        } else {
          // Connect start to first node
          const startEdge: Edge = {
            id: `edge-start-${newNode.id}`,
            source: "start",
            target: newNode.id,
            type: "smoothstep",
          };
          setEdges((eds) => [...eds, startEdge]);
        }

        // Connect to end node
        const endEdge: Edge = {
          id: `edge-${newNode.id}-end`,
          source: newNode.id,
          target: "end",
          type: "smoothstep",
        };
        setEdges((eds) => {
          const filtered = eds.filter(
            (e) =>
              !(
                e.target === "end" &&
                (String(e.source).startsWith("question-") ||
                  String(e.source).startsWith("conditional-") ||
                  String(e.source).startsWith("loop-"))
              )
          );
          return [...filtered, endEdge];
        });
      }
    },
    [setNodes, setEdges, nodes, enforceLinear]
  );

  // Sync `questions` prop -> nodes/edges when prop changes
  useEffect(() => {
    if (!Array.isArray(arguments as any)) {
      // nothing
    }
  }, []);

  const generateShareUrl = useCallback(() => {
    const surveyId = `survey-${Date.now()}`;
    const url = `${window.location.origin}/form/${surveyId}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  }, []);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        questions: nodes
          .filter(
            (node) => node.type === "questionNode" || node.type === "logicNode"
          )
          .map((n) => {
            if (n.type === "questionNode") {
              return {
                id: n.id,
                type: n.data.questionType,
                title: n.data.title,
                description: n.data.description,
                required: n.data.required,
                options: n.data.options,
                scaleMin: n.data.scaleMin,
                scaleMax: n.data.scaleMax,
                scaleMinLabel: n.data.scaleMinLabel,
                scaleMaxLabel: n.data.scaleMaxLabel,
                conditionalTarget: n.data?.conditionalTarget || null,
                conditionalCondition: n.data?.conditionalCondition || null,
              };
            } else if (n.type === "logicNode") {
              return {
                id: n.id,
                type: "logic",
                logicType: n.data?.type,
                condition: n.data?.condition || null,
                target: n.data?.target || null,
              };
            }
            return null;
          })
          .filter(Boolean) as any[],
        publishedAt: new Date().toISOString(),
      };

      if (onPublish) {
        await onPublish(surveyData);
      }

      // Generate and copy share URL
      generateShareUrl();
      alert("Survey published successfully! Share URL copied to clipboard.");
    } catch (error) {
      console.error("Failed to publish survey:", error);
      alert("Failed to publish survey. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }, [surveyTitle, surveyDescription, nodes, onPublish, generateShareUrl]);

  const updateNodeData = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) => {
        const updated = nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        );
        // immediately notify parent of question data changes
        if (onQuestionsChange) {
          onQuestionsChange(nodesToQuestions(updated));
        }
        return updated;
      });
    },
    [setNodes, nodesToQuestions, onQuestionsChange]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const remaining = nds.filter((node) => node.id !== nodeId);
        if (onQuestionsChange) {
          onQuestionsChange(nodesToQuestions(remaining));
        }
        return remaining;
      });
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges, nodesToQuestions, onQuestionsChange]
  );

  const cutNode = useCallback(
    (nodeId: string) => {
      // remove edges connected to node and save them so they can be reattached
      setEdges((eds) => {
        const toRemove = eds.filter(
          (e) => e.source === nodeId || e.target === nodeId
        );
        if (toRemove.length > 0) {
          savedEdgesRef.current[nodeId] = toRemove;
          console.debug(
            "FlowBuilder cutNode - saved edges for",
            nodeId,
            toRemove
          );
        } else {
          console.debug("FlowBuilder cutNode - no edges to cut for", nodeId);
        }
        return eds.filter((e) => e.source !== nodeId && e.target !== nodeId);
      });
    },
    [setEdges]
  );

  const reattachNode = useCallback(
    (nodeId: string) => {
      const saved = savedEdgesRef.current[nodeId];
      if (saved && saved.length > 0) {
        setEdges((eds) => {
          // avoid duplicating edges that may already exist
          const existingIds = new Set(eds.map((e) => e.id));
          const toAdd = saved.filter((e) => !existingIds.has(e.id));
          console.debug(
            "FlowBuilder reattachNode - restoring saved edges for",
            nodeId,
            toAdd
          );
          return [...eds, ...toAdd];
        });
        delete savedEdgesRef.current[nodeId];
        return;
      }

      // Fallback: if there were no saved edges, auto-connect this node into the flow.
      if (enforceLinear) {
        setEdges((eds) => {
          const questionLogicNodes = nodes.filter(
            (n) =>
              (n.type === "questionNode" || n.type === "logicNode") &&
              n.id !== nodeId
          );
          const newEdges: Edge[] = [];

          if (questionLogicNodes.length > 0) {
            const last = questionLogicNodes[questionLogicNodes.length - 1];
            newEdges.push({
              id: `edge-${last.id}-${nodeId}`,
              source: last.id,
              target: nodeId,
              type: "smoothstep",
            });
          } else {
            newEdges.push({
              id: `edge-start-${nodeId}`,
              source: "start",
              target: nodeId,
              type: "smoothstep",
            });
          }

          newEdges.push({
            id: `edge-${nodeId}-end`,
            source: nodeId,
            target: "end",
            type: "smoothstep",
          });

          console.debug(
            "FlowBuilder reattachNode - auto connecting",
            nodeId,
            newEdges
          );
          return [...eds, ...newEdges];
        });
      } else {
        // when not enforcing linear path, do not auto-connect as a fallback
        console.debug(
          "FlowBuilder reattachNode - enforceLinear is false, skipping auto-connect for",
          nodeId
        );
      }
    },
    [nodes, setEdges, enforceLinear]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.debug("FlowBuilder onNodeClick", node?.id, "toolMode=", toolMode);

      // Reattach mode: click one node then another to create an edge
      if (toolMode === "reattach") {
        const pending = pendingSourceRef.current;
        if (!pending) {
          pendingSourceRef.current = node.id;
          console.debug("FlowBuilder reattach - selected source", node.id);
        } else if (pending !== node.id) {
          const connection: any = { source: pending, target: node.id };
          setEdges((eds) => addEdge(connection, eds));
          console.debug("FlowBuilder reattach - created edge", connection);
          pendingSourceRef.current = null;
          setToolMode("none");
        }

        // don't change selected node focus while in reattach flow
        return;
      }

      // Logic mode: click one node (source) then another (target) to create a logic edge
      if (toolMode === "logic") {
        const pending = pendingSourceRef.current;
        if (!pending) {
          pendingSourceRef.current = node.id;
          console.debug("FlowBuilder logic - selected source", node.id);
        } else if (pending !== node.id) {
          const connection: any = { source: pending, target: node.id, data: { label: "logic" } };
          setEdges((eds) => addEdge(connection, eds));
          console.debug("FlowBuilder logic - created edge", connection);

          // persist simple routing metadata on source node
          setNodes((nds) =>
            nds.map((n) => {
              if (n.id === pending) {
                const existingRouting = (n.data?.routing as any) || [];
                const newRouting = [...existingRouting, { to: node.id, label: "logic" }];
                return { ...n, data: { ...n.data, routing: newRouting } };
              }
              return n;
            })
          );

          // notify parent about routing change
          setTimeout(() => {
            if (onQuestionsChange) onQuestionsChange(nodesToQuestions(nodes));
          }, 0);

          pendingSourceRef.current = null;
          setToolMode("none");
        }

        return;
      }

      // default behavior: select node for editing
      setSelectedNode(node.id);
    },
    [toolMode, setEdges]
  );

  const onNodeMouseDown = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // record mouse down position and candidate source
      nodeMouseDownPosRef.current = {
        x: (event as any).clientX,
        y: (event as any).clientY,
      };
      pendingSourceRef.current = node.id;
      console.debug("FlowBuilder onNodeMouseDown", node.id);

      // Defensive: some outer layers can swallow click events. Ensure we select
      // the node on mousedown when not in a special tool mode so the toolbar
      // reliably shows the node for editing.
      if (toolMode === "none") {
        setSelectedNode(node.id);
      }
    },
    [toolMode]
  );

  const onNodeMouseUp = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.debug(
        "FlowBuilder onNodeMouseUp",
        node.id,
        "pending=",
        pendingSourceRef.current
      );
      const start = nodeMouseDownPosRef.current;
      nodeMouseDownPosRef.current = null;

      const pending = pendingSourceRef.current;
      // only create drag-to-connect when in reattach tool or when auto-path is disabled
      if (!pending) return;
      if (pending === node.id) {
        // clicked the same node, ignore
        pendingSourceRef.current = null;
        return;
      }

      const dx = start ? (event as any).clientX - start.x : 0;
      const dy = start ? (event as any).clientY - start.y : 0;
      const moved = Math.hypot(dx, dy) > 6;

      if (moved && (toolMode === "reattach" || !enforceLinear)) {
        const connection: any = { source: pending, target: node.id };
        setEdges((eds) => addEdge(connection, eds));
        console.debug("FlowBuilder drag-reattach - created edge", connection);
      }

      pendingSourceRef.current = null;
    },
    [toolMode, enforceLinear, setEdges]
  );

    const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
      // double-click should focus the node for editing as a fallback
      console.debug('FlowBuilder onNodeDoubleClick', node.id)
      setSelectedNode(node.id)
    }, [])

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      console.debug("FlowBuilder onEdgeClick", edge?.id, "toolMode=", toolMode);
      if (toolMode === "cut") {
        // remove the clicked edge
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        console.debug("FlowBuilder cut - removed edge", edge.id);
        setToolMode("none");
      }
    },
    [toolMode, setEdges]
  );

  // handle selection change (box select / keyboard) and sync selectedNode to the toolbar
  const onSelectionChange = useCallback(
    (selection: { nodes: Node[]; edges: Edge[] } | null) => {
      const selectedNodes = selection?.nodes || [];
      if (selectedNodes.length > 0) {
        setSelectedNode(selectedNodes[0].id);
      } else {
        // avoid clearing selection on transient empty selection events (scroll/blur)
        // if we still have the previously selected node present, keep it selected
        setSelectedNode((prev) => {
          if (!prev) return null;
          const exists = nodes.find((n) => n.id === prev);
          return exists ? prev : null;
        });
      }
    },
    [nodes]
  );

  const onWrapperPointerDebug = useCallback((e: React.MouseEvent) => {
    // quick debug to see if pointer events reach the flow wrapper
    console.debug(
      "FlowBuilder wrapper event",
      e.type,
      "target=",
      (e.target as HTMLElement)?.className
    );
  }, []);

  // when nodes change or enforceLinear toggles, perform a fitView after mount/visibility
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (
          reactFlowInstance.current &&
          typeof reactFlowInstance.current.fitView === "function"
        ) {
          reactFlowInstance.current.fitView({ padding: 0.1 });
          console.debug("FlowBuilder fitView invoked");
        }
      } catch (err) {
        console.debug("FlowBuilder fitView failed", err);
      }
    }, 120);

    return () => clearTimeout(t);
  }, [nodes.length, enforceLinear]);

  // listen for custom node mousedown events dispatched from node components
  useEffect(() => {
    const handler = (e: any) => {
      const nodeId = e?.detail?.id;
      if (nodeId && toolMode === "none") {
        setSelectedNode(nodeId);
      }
    };
    window.addEventListener("flow-node-mousedown", handler as EventListener);
    return () => window.removeEventListener("flow-node-mousedown", handler as EventListener);
  }, [toolMode]);

  return (
    <div className="h-full flex">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <Card className="px-3 py-2 shadow-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  {lastSaved
                    ? `Saved ${lastSaved.toLocaleTimeString()}`
                    : "Not saved"}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleManualSave}
                disabled={isSaving}
                className="h-7 bg-transparent"
              >
                {isSaving ? "Saving..." : "💾 Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={generateShareUrl}
                className="h-7 bg-transparent"
              >
                📋 Copy Link
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={
                  isPublishing ||
                  nodes.filter((n) => n.type === "questionNode").length === 0
                }
                className="h-7 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPublishing ? "Publishing..." : "🚀 Publish"}
              </Button>
              {shareUrl && (
                <span className="text-green-600 text-xs">Link copied!</span>
              )}
            </div>
          </Card>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Card className="px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={toolMode === "cut" ? "default" : "outline"}
                onClick={() => {
                  setToolMode(toolMode === "cut" ? "none" : "cut");
                  pendingSourceRef.current = null;
                }}
              >
                ✂️ Cut
              </Button>
              <Button
                size="sm"
                variant={toolMode === "reattach" ? "default" : "outline"}
                onClick={() => {
                  setToolMode(toolMode === "reattach" ? "none" : "reattach");
                  pendingSourceRef.current = null;
                }}
              >
                🔗 Reattach
              </Button>
              <Button
                size="sm"
                variant={toolMode === "logic" ? "default" : "outline"}
                onClick={() => {
                  setToolMode(toolMode === "logic" ? "none" : "logic");
                  pendingSourceRef.current = null;
                }}
              >
                🧠 Logic
              </Button>
              <Button
                size="sm"
                variant={enforceLinear ? "default" : "outline"}
                onClick={() => setEnforceLinear((v) => !v)}
              >
                {enforceLinear ? "Auto Path: ON" : "Auto Path: OFF"}
              </Button>
            </div>
          </Card>
        </div>

        <div
          ref={(el) => {
            reactFlowWrapper.current = el;
          }}
          className="h-full w-full"
          onClick={onWrapperPointerDebug}
          onMouseDown={onWrapperPointerDebug}
        >
          <ReactFlow
            onInit={(instance) => {
              reactFlowInstance.current = instance;
            }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onPaneClick={(e) => console.debug("FlowBuilder onPaneClick", e)}
            onMouseDown={(e: unknown) =>
              console.debug("FlowBuilder onMouseDown", e)
            }
            onNodeDragStop={(event, node) => {
              // update node position in state
              setNodes((nds) => {
                // update moved node position
                const updated = nds.map((n) =>
                  n.id === node.id ? { ...n, position: node.position } : n
                );

                // Reorder question nodes by vertical position (y) so List view matches visual order
                const startNode = updated.find((n) => n.type === "startNode");
                const endNode = updated.find((n) => n.type === "endNode");
                const questionNodes = updated
                  .filter((n) => n.type === "questionNode")
                  .slice();
                questionNodes.sort(
                  (a, b) => (a.position?.y || 0) - (b.position?.y || 0)
                );

                const newNodes: Node[] = [];
                if (startNode) newNodes.push(startNode);
                newNodes.push(...questionNodes);
                if (endNode) newNodes.push(endNode);

                // after nodes moved, rebuild linear edges when enforceLinear is true
                if (enforceLinear) {
                  const newEdges = buildLinearEdges(newNodes);
                  setEdges(newEdges);
                }

                // notify parent about updated question order and data
                if (onQuestionsChange) {
                  onQuestionsChange(nodesToQuestions(newNodes));
                }

                return newNodes;
              });
            }}
            onSelectionChange={onSelectionChange}
            onEdgeClick={onEdgeClick}
            onDrop={onDropCanvas}
            onDragOver={onDragOverCanvas}
            // ensure interactivity: allow dragging nodes, creating connections and selecting elements
            nodesDraggable={true}
            nodesConnectable={true}
            edgesReconnectable={true}
            nodesFocusable={true}
            elementsSelectable={true}
            panOnDrag={true}
            // nodeTypes cast to any to avoid strict typing issues with memoized components
            nodeTypes={nodeTypes as any}
            // don't use ReactFlow's automatic fitView prop because when the component
            // mounts after being hidden (switching from List/Preview) the container
            // size can be zero and fitView computes an incorrect zoom. We call
            // fitView programmatically after a short delay when nodes change.
            style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 z-0"
            defaultEdgeOptions={{
              type: "smoothstep",
              style: { stroke: "#6366f1", strokeWidth: 2 },
            }}
          >
            <Controls className="bg-white shadow-lg rounded-lg" />
            <MiniMap
              className="bg-white shadow-lg rounded-lg"
              nodeColor="#6366f1"
              maskColor="rgba(99, 102, 241, 0.1)"
            />
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#e0e7ff"
            />
          </ReactFlow>
        </div>
      </div>

      <QuestionToolbar
        onAddQuestion={addQuestionNode}
        selectedNode={selectedNode}
        nodes={nodes}
        onUpdateNode={updateNodeData}
        onDeleteNode={deleteNode}
        surveyTitle={surveyTitle}
        surveyDescription={surveyDescription}
        onTitleChange={onTitleChange}
        onDescriptionChange={onDescriptionChange}
      />
    </div>
  );
}
