import { useState } from "react";
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
  TextArea,
  Callout,
  Card,
  Classes,
} from "@blueprintjs/core";
import { useQuestionMutations } from "../hooks/usePolls";
import type { PollQuestion, QuestionType } from "../types";
import { QUESTION_TYPE_OPTIONS } from "../types";

interface Props {
  pollId: string;
  questions: PollQuestion[];
  loading: boolean;
  onMutate: () => void;
}

export default function PollQuestionEditor({ pollId, questions, loading, onMutate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editType, setEditType] = useState<QuestionType>("LIKERT");
  const [editOptions, setEditOptions] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  const mutations = useQuestionMutations({ onSuccess: onMutate });

  const startAdd = () => {
    setEditingId("__new__");
    setEditText("");
    setEditType("LIKERT");
    setEditOptions("");
    setEditOrder(questions.length);
  };

  const startEdit = (q: PollQuestion) => {
    setEditingId(q.id);
    setEditText(q.text);
    setEditType(q.question_type);
    setEditOptions(q.options?.join(", ") ?? "");
    setEditOrder(q.order_index);
  };

  const cancelEdit = () => {
    setEditingId(null);
    mutations.clearErrors();
  };

  const handleSave = async () => {
    const options = editOptions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId === "__new__") {
      const success = await mutations.add(pollId, {
        question_type: editType,
        text: editText.trim(),
        options: editType === "TEXT" || editType === "BOOLEAN" ? undefined : options,
        order_index: editOrder,
      });
      if (success) {
        setEditingId(null);
      }
    } else if (editingId) {
      const success = await mutations.update(pollId, editingId, {
        question_type: editType,
        text: editText.trim(),
        options: editType === "TEXT" || editType === "BOOLEAN" ? null : options,
        order_index: editOrder,
      });
      if (success) {
        setEditingId(null);
      }
    }
  };

  const handleDelete = async (questionId: string) => {
    await mutations.remove(pollId, questionId);
  };

  const needsOptions = (type: QuestionType) =>
    type === "MULTIPLE_CHOICE" || type === "LIKERT" || type === "RATING";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h4 className="bp5-heading" style={{ margin: 0 }}>Questions</h4>
        <Button icon="plus" text="Add Question" onClick={startAdd} />
      </div>

      {mutations.error && (
        <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
          {mutations.error}
        </Callout>
      )}

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div className="bp5-spinner">
            <div className="bp5-spinner-animation" />
          </div>
        </div>
      )}

      {!loading && questions.length === 0 && editingId !== "__new__" && (
        <Callout intent={Intent.NONE} icon="info-sign">
          No questions yet. Add one to get started.
        </Callout>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {questions.map((q) => (
          <Card
            key={q.id}
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
            }}
          >
            {editingId === q.id ? (
              <>
                <FormGroup label="Question Text">
                  <TextArea
                    fill
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                </FormGroup>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <FormGroup label="Type">
                    <select
                      className="bp5-html-select"
                      value={editType}
                      onChange={(e) =>
                        setEditType(e.target.value as QuestionType)
                      }
                      style={{ width: "100%" }}
                    >
                      {QUESTION_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup label="Order">
                    <InputGroup
                      type="number"
                      min={0}
                      value={String(editOrder)}
                      onChange={(e) =>
                        setEditOrder(parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </FormGroup>
                </div>
                {needsOptions(editType) && (
                  <FormGroup label="Options (comma-separated)">
                    <InputGroup
                      value={editOptions}
                      onChange={(e) => setEditOptions(e.target.value)}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </FormGroup>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Button
                    intent={Intent.PRIMARY}
                    small
                    text="Save"
                    onClick={handleSave}
                    loading={mutations.submitting}
                  />
                  <Button small text="Cancel" onClick={cancelEdit} />
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      Q{q.order_index + 1}. {q.text}
                    </div>
                    <div
                      className={Classes.TEXT_MUTED}
                      style={{ fontSize: 12, marginTop: 4 }}
                    >
                      {QUESTION_TYPE_OPTIONS.find((o) => o.value === q.question_type)?.label ??
                        q.question_type}
                      {q.options && q.options.length > 0 && (
                        <> — {q.options.join(", ")}</>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Button
                      minimal
                      small
                      icon="edit"
                      onClick={() => startEdit(q)}
                      aria-label="Edit question"
                    />
                    <Button
                      minimal
                      small
                      icon="trash"
                      intent={Intent.DANGER}
                      onClick={() => handleDelete(q.id)}
                      aria-label="Delete question"
                    />
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}

        {editingId === "__new__" && (
          <Card
            style={{
              padding: 16,
              background: "var(--cds-layer-01, #262626)",
              border: "1px dashed var(--cds-border-strong, #6f6f6f)",
            }}
          >
            <FormGroup label="Question Text">
              <TextArea
                fill
                rows={2}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Enter your question..."
              />
            </FormGroup>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <FormGroup label="Type">
                <select
                  className="bp5-html-select"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as QuestionType)}
                  style={{ width: "100%" }}
                >
                  {QUESTION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Order">
                <InputGroup
                  type="number"
                  min={0}
                  value={String(editOrder)}
                  onChange={(e) =>
                    setEditOrder(parseInt(e.target.value, 10) || 0)
                  }
                />
              </FormGroup>
            </div>
            {needsOptions(editType) && (
              <FormGroup label="Options (comma-separated)">
                <InputGroup
                  value={editOptions}
                  onChange={(e) => setEditOptions(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                />
              </FormGroup>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Button
                intent={Intent.PRIMARY}
                small
                text="Save"
                onClick={handleSave}
                loading={mutations.submitting}
                disabled={editText.trim().length === 0}
              />
              <Button small text="Cancel" onClick={cancelEdit} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
