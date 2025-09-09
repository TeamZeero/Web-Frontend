"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormFlowLogo } from "@/components/ui/logo";
import { FlowBuilder } from "@/components/survey-builder/FlowBuilder";
import { FormPreview } from "@/components/form-renderer/FormPreview";
import { SurveySettings } from "@/components/survey-builder/SurveySettings";

export default function BuilderPage() {
  const [surveyTitle, setSurveyTitle] = useState("Untitled Form");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [viewMode, setViewMode] = useState<
    "flow" | "list" | "preview" | "settings"
  >("flow");
  const [questions, setQuestions] = useState<any[]>([]);
  const [surveyId, setSurveyId] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [surveySettings, setSurveySettings] = useState({
    collectEmail: false,
    requireSignIn: false,
    limitResponses: false,
    maxResponses: 100,
    allowResponseEditing: false,
    showProgressBar: true,
    shuffleQuestions: false,
    confirmationMessage: "Thank you for your response!",
    redirectUrl: "",
    acceptingResponses: true,
    responseDeadline: null,
    allowAnonymous: true,
    showSummaryChart: false,
    emailNotifications: false,
    notificationEmail: "",
  });

  useEffect(() => {
    const savedSurveyId = localStorage.getItem("currentSurveyId");
    if (savedSurveyId) {
      const savedSurvey = localStorage.getItem(savedSurveyId);
      if (savedSurvey) {
        const surveyData = JSON.parse(savedSurvey);
        setSurveyTitle(surveyData.title || "Untitled Form");
        setSurveyDescription(surveyData.description || "");
        setQuestions(surveyData.questions || []);
        setSurveySettings(surveyData.settings || surveySettings);
        setSurveyId(savedSurveyId);
        setLastSaved(new Date(surveyData.lastModified));
      }
    } else {
      // Create new survey ID for new surveys
      const newSurveyId = `survey_${Date.now()}`;
      setSurveyId(newSurveyId);
      localStorage.setItem("currentSurveyId", newSurveyId);
    }
  }, []);

  useEffect(() => {
    if (surveyId) {
      const surveyData = {
        id: surveyId,
        title: surveyTitle,
        description: surveyDescription,
        questions: questions,
        settings: surveySettings,
        status: "draft",
        responses: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(surveyId, JSON.stringify(surveyData));
      setLastSaved(new Date());
    }
  }, [surveyId, surveyTitle, surveyDescription, questions, surveySettings]);

  const handleSave = async () => {
    if (!surveyId) return;

    try {
      const surveyData = {
        id: surveyId,
        title: surveyTitle,
        description: surveyDescription,
        questions: questions,
        settings: surveySettings,
        status: "draft",
        responses: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(surveyId, JSON.stringify(surveyData));
      setLastSaved(new Date());

      // Show success message
      const saveButton = document.querySelector(
        "[data-save-button]"
      ) as HTMLElement;
      if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = "✅ Saved!";
        saveButton.style.backgroundColor = "#10b981";
        setTimeout(() => {
          saveButton.textContent = originalText;
          saveButton.style.backgroundColor = "";
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to save survey:", error);
      alert("Failed to save survey. Please try again.");
    }
  };

  const handlePreview = () => {
    handleSave();
    console.log("[dev] Preview - Current questions:", questions);
    setViewMode("preview");
  };

  const handlePublish = async (surveyData: any) => {
    const fullSurveyData = {
      ...surveyData,
      id: surveyId,
      settings: surveySettings,
      status: "active",
      publishedAt: new Date().toISOString(),
    };

    localStorage.setItem(surveyId, JSON.stringify(fullSurveyData));

    // Generate shareable link
    const shareUrl = `${window.location.origin}/form/${surveyId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert(
        `Survey published successfully! Share link copied to clipboard: ${shareUrl}`
      );
    } catch (error) {
      alert(`Survey published successfully! Share link: ${shareUrl}`);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSettingsSave = () => {
    handleSave();
    alert("Settings saved successfully!");
  };

  const surveyForPreview = {
    id: surveyId,
    title: surveyTitle,
    description: surveyDescription,
    questions: questions,
  };

  console.log("[dev] Survey for preview:", surveyForPreview);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b flex-shrink-0 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <FormFlowLogo size="sm" />
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-800">
                Survey Builder
              </h1>
              <div className="text-sm text-gray-500">
                {lastSaved
                  ? `Last saved: ${lastSaved.toLocaleTimeString()}`
                  : "Not saved"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  ⬅ Back to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                data-save-button
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                💾 Save
              </Button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "flow" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("flow")}
                >
                  🔄 Flow View
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  📋 List View
                </Button>
                <Button
                  variant={viewMode === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={handlePreview}
                >
                  👁️ Preview
                </Button>
                <Button
                  variant={viewMode === "settings" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("settings")}
                >
                  ⚙️ Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {viewMode === "flow" && (
          <FlowBuilder
            surveyTitle={surveyTitle}
            surveyDescription={surveyDescription}
            onTitleChange={setSurveyTitle}
            onDescriptionChange={setSurveyDescription}
            onQuestionsChange={setQuestions}
            questions={questions}
            onPublish={handlePublish}
          />
        )}

        {viewMode === "list" && (
          <ListViewBuilder
            surveyTitle={surveyTitle}
            surveyDescription={surveyDescription}
            questions={questions}
            onTitleChange={setSurveyTitle}
            onDescriptionChange={setSurveyDescription}
            onQuestionsChange={setQuestions}
          />
        )}

        {viewMode === "preview" && (
          <div className="h-full overflow-y-auto bg-gray-50">
            <div className="max-w-2xl mx-auto py-8">
              <div className="mb-4 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Preview Mode - Questions: {questions.length}
                </div>
              </div>
              <FormPreview survey={surveyForPreview} />
            </div>
          </div>
        )}

        {viewMode === "settings" && (
          <div className="h-full overflow-y-auto p-6">
            <SurveySettings
              settings={surveySettings}
              onSettingsChange={setSurveySettings}
              onSave={handleSettingsSave}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function ListViewBuilder({
  surveyTitle,
  surveyDescription,
  questions,
  onTitleChange,
  onDescriptionChange,
  onQuestionsChange,
}: {
  surveyTitle: string;
  surveyDescription: string;
  questions: any[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onQuestionsChange: (questions: any[]) => void;
}) {
  const addQuestion = (type: string) => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type,
      title: `New ${type} question`,
      required: false,
      ...(type === "multipleChoice" && {
        options: ["Option 1", "Option 2", "Option 3"],
      }),
      ...(type === "checkboxes" && {
        options: ["Option 1", "Option 2", "Option 3"],
      }),
      ...(type === "dropdown" && {
        options: ["Option 1", "Option 2", "Option 3"],
      }),
      ...(type === "linearScale" && {
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: "Low",
        scaleMaxLabel: "High",
      }),
      conditionalTarget: null,
      conditionalCondition: null,
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  // Drag and drop reordering (HTML5 DnD)
  const dragItemIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItemIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(index));
    } catch (err) {
      // ignore
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragItemIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null) return;
    if (from === to) return;

    const updated = [...questions];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onQuestionsChange(updated);

    dragItemIndex.current = null;
    dragOverIndex.current = null;
  };

  const updateQuestion = (index: number, updates: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    onQuestionsChange(updatedQuestions);
  };

  const deleteQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < questions.length) {
      [newQuestions[index], newQuestions[targetIndex]] = [
        newQuestions[targetIndex],
        newQuestions[index],
      ];
      onQuestionsChange(newQuestions);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Survey Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <input
            type="text"
            value={surveyTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-2xl font-bold w-full border-none outline-none bg-transparent"
            placeholder="Survey Title"
          />
          <textarea
            value={surveyDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full mt-2 border-none outline-none bg-transparent text-gray-600 resize-none"
            placeholder="Survey description (optional)"
            rows={2}
          />
        </div>

        {/* Questions */}
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <input
                type="text"
                value={question.title}
                onChange={(e) =>
                  updateQuestion(index, { title: e.target.value })
                }
                className="text-lg font-medium w-full border-none outline-none bg-transparent"
                placeholder="Question title"
              />
              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(index, "up")}
                  disabled={index === 0}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveQuestion(index, "down")}
                  disabled={index === questions.length - 1}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </Button>
              </div>
            </div>

            {(question.type === "multipleChoice" ||
              question.type === "checkboxes" ||
              question.type === "dropdown") && (
              <div className="space-y-2">
                {question.options?.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 border-2 border-gray-300 ${
                        question.type === "multipleChoice"
                          ? "rounded-full"
                          : "rounded"
                      }`}
                    ></div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[optIndex] = e.target.value;
                        updateQuestion(index, { options: newOptions });
                      }}
                      className="flex-1 border-none outline-none bg-transparent"
                      placeholder={`Option ${optIndex + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOptions = question.options.filter(
                          (_: any, i: number) => i !== optIndex
                        );
                        // also remove any routing for this option index
                        const newRouting = (question.routing || []).filter((r: any, i: number) => i !== optIndex);
                        updateQuestion(index, { options: newOptions, routing: newRouting });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newOptions = [
                      ...(question.options || []),
                      `Option ${(question.options?.length || 0) + 1}`,
                    ];
                    const newRouting = [...(question.routing || []), null];
                    updateQuestion(index, { options: newOptions, routing: newRouting });
                  }}
                >
                  + Add option
                </Button>
              </div>
            )}

              {/* Per-option routing selector */}
              {(question.options?.length || 0) > 0 && (
                <div className="mt-2 space-y-2">
                  <label className="text-sm font-medium">Option routing</label>
                  {question.options.map((opt: string, oi: number) => (
                    <div key={oi} className="flex items-center gap-2">
                      <div className="text-xs text-gray-600 w-32">{opt}</div>
                      <select
                        value={(question.routing || [])[oi] || ""}
                        onChange={(e) => {
                          const newRouting = [...(question.routing || [])];
                          newRouting[oi] = e.target.value || null;
                          updateQuestion(index, { routing: newRouting });
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="">(Default next)</option>
                        {questions
                          .filter((q) => q.id !== question.id)
                          .map((q) => (
                            <option key={q.id} value={q.id}>
                              {q.title || q.id}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

            {question.type === "shortAnswer" && (
              <input
                type="text"
                disabled
                placeholder="Short answer text"
                className="w-full p-2 border-b border-gray-300 bg-gray-50"
              />
            )}

            {question.type === "paragraph" && (
              <textarea
                disabled
                placeholder="Long answer text"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                rows={3}
              />
            )}

            {question.type === "linearScale" && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label className="text-sm">Scale:</label>
                  <input
                    type="number"
                    value={question.scaleMin || 1}
                    onChange={(e) =>
                      updateQuestion(index, {
                        scaleMin: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-16 p-1 border rounded text-sm"
                    min="0"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={question.scaleMax || 5}
                    onChange={(e) =>
                      updateQuestion(index, {
                        scaleMax: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-16 p-1 border rounded text-sm"
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={question.scaleMinLabel || ""}
                    onChange={(e) =>
                      updateQuestion(index, { scaleMinLabel: e.target.value })
                    }
                    placeholder="Low label"
                    className="flex-1 p-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    value={question.scaleMaxLabel || ""}
                    onChange={(e) =>
                      updateQuestion(index, { scaleMaxLabel: e.target.value })
                    }
                    placeholder="High label"
                    className="flex-1 p-1 border rounded text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Conditional Logic
              </h4>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Condition (e.g., thisQuestion == 'Yes')
                </label>
                <input
                  type="text"
                  value={question.conditionalCondition || ""}
                  onChange={(e) =>
                    updateQuestion(index, {
                      conditionalCondition: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Condition for next step"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Target Question ID (if condition true)
                </label>
                <input
                  type="text"
                  value={question.conditionalTarget || ""}
                  onChange={(e) =>
                    updateQuestion(index, { conditionalTarget: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Next Question ID"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <select
                value={question.type}
                onChange={(e) =>
                  updateQuestion(index, { type: e.target.value })
                }
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="shortAnswer">Short Answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multipleChoice">Multiple Choice</option>
                <option value="checkboxes">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
                <option value="linearScale">Linear Scale</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="fileUpload">File Upload</option>
              </select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) =>
                    updateQuestion(index, { required: e.target.checked })
                  }
                />
                <span className="text-sm">Required</span>
              </label>
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => addQuestion("shortAnswer")}
              variant="outline"
              size="sm"
            >
              📝 Short Answer
            </Button>
            <Button
              onClick={() => addQuestion("paragraph")}
              variant="outline"
              size="sm"
            >
              📄 Paragraph
            </Button>
            <Button
              onClick={() => addQuestion("multipleChoice")}
              variant="outline"
              size="sm"
            >
              ⚪ Multiple Choice
            </Button>
            <Button
              onClick={() => addQuestion("checkboxes")}
              variant="outline"
              size="sm"
            >
              ☑️ Checkboxes
            </Button>
            <Button
              onClick={() => addQuestion("dropdown")}
              variant="outline"
              size="sm"
            >
              📋 Dropdown
            </Button>
            <Button
              onClick={() => addQuestion("linearScale")}
              variant="outline"
              size="sm"
            >
              📊 Linear Scale
            </Button>
            <Button
              onClick={() => addQuestion("date")}
              variant="outline"
              size="sm"
            >
              📅 Date
            </Button>
            <Button
              onClick={() => addQuestion("email")}
              variant="outline"
              size="sm"
            >
              📧 Email
            </Button>
            <Button
              onClick={() => addQuestion("fileUpload")}
              variant="outline"
              size="sm"
            >
              📎 File Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
