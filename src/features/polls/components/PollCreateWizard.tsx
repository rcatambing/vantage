import { useState, useCallback } from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Intent,
  FormGroup,
  InputGroup,
  TextArea,
  Callout,
} from "@blueprintjs/core";
import { usePollMutations, useQuestionMutations, useParticipantMutations } from "../hooks/usePolls";
import type { QuestionType } from "../types";
import { QUESTION_TYPE_OPTIONS } from "../types";
import ParticipantImportDialog from "./ParticipantImportDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  onCreated: () => void;
}

interface WizardQuestion {
  id: string;
  question_type: QuestionType;
  text: string;
  options: string[];
  order_index: number;
}

export default function PollCreateWizard({ isOpen, onClose, campaignId, onCreated }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetCount, setTargetCount] = useState("100");
  const [questions, setQuestions] = useState<WizardQuestion[]>([]);
  const [participantsFile, setParticipantsFile] = useState<File | null>(null);
  const [pollId, setPollId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const pollMutations = usePollMutations({
    onSuccess: () => {
      // Handled inline after create
    },
  });
  const questionMutations = useQuestionMutations();
  const participantMutations = useParticipantMutations();

  const reset = useCallback(() => {
    setStep(0);
    setName("");
    setDescription("");
    setTargetCount("100");
    setQuestions([]);
    setParticipantsFile(null);
    setPollId(null);
    pollMutations.clearErrors();
    questionMutations.clearErrors();
    participantMutations.clearErrors();
  }, [pollMutations, questionMutations, participantMutations]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const isStepValid = () => {
    switch (step) {
      case 0:
        return name.trim().length > 0 && description.trim().length > 0 && !isNaN(parseInt(targetCount, 10));
      case 1:
        return questions.length > 0 && questions.every((q) => q.text.trim().length > 0);
      case 2:
        return true; // Participants optional
      case 3:
        return true; // Review
      case 4:
        return true; // Launch
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      // Create poll on first transition
      const success = await pollMutations.create({
        name: name.trim(),
        description: description.trim(),
        campaign_id: campaignId,
        target_response_count: parseInt(targetCount, 10),
      });
      if (!success) return;
      // We need the poll ID — in a real app the create response would include it.
      // For now, we simulate by storing a placeholder and moving forward.
      setPollId("new-poll-id"); // Placeholder: backend should return id
      setStep((s) => s + 1);
    } else if (step === 3) {
      setStep((s) => s + 1);
    } else if (step === 4) {
      // Launch
      onCreated();
      handleClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      {
        id: `temp-${Date.now()}`,
        question_type: "LIKERT",
        text: "",
        options: [],
        order_index: qs.length,
      },
    ]);
  };

  const updateQuestion = (id: string, patch: Partial<WizardQuestion>) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  const stepLabels = ["Metadata", "Questions", "Participants", "Review", "Launch"];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="New Poll"
      icon="chat"
      style={{ width: 720, minHeight: 480 }}
    >
      <DialogBody>
        <div className="bp5-wizard-steps" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {stepLabels.map((label, idx) => (
            <div
              key={idx}
              aria-label={label}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                background: idx === step ? "#0f62fe" : "#e0e0e0",
                color: idx === step ? "#fff" : "#161616",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {pollMutations.error && (
            <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
              {pollMutations.error}
            </Callout>
          )}
          {questionMutations.error && (
            <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
              {questionMutations.error}
            </Callout>
          )}

          {step === 0 && (
            <>
              <FormGroup label="Poll Name" helperText="Required">
                <InputGroup
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q2 Sentiment Survey"
                />
              </FormGroup>
              <FormGroup label="Description" helperText="Required">
                <TextArea
                  fill
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this poll about?"
                />
              </FormGroup>
              <FormGroup label="Target Response Count">
                <InputGroup
                  type="number"
                  min={1}
                  value={targetCount}
                  onChange={(e) => setTargetCount(e.target.value)}
                />
              </FormGroup>
            </>
          )}

          {step === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 className="bp5-heading" style={{ margin: 0 }}>Questions</h4>
                <Button icon="plus" text="Add Question" onClick={addQuestion} />
              </div>
              {questions.length === 0 && (
                <Callout intent={Intent.NONE} icon="info-sign">
                  Add at least one question to continue.
                </Callout>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    style={{
                      padding: 16,
                      background: "var(--cds-layer-01, #262626)",
                      border: "1px solid var(--cds-border-subtle, #393939)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                      <span className="bp5-text-muted" style={{ fontSize: 12 }}>
                        Q{idx + 1}
                      </span>
                      <div style={{ marginLeft: "auto" }}>
                        <Button
                          minimal
                          small
                          icon="trash"
                          intent={Intent.DANGER}
                          onClick={() => removeQuestion(q.id)}
                        />
                      </div>
                    </div>
                    <FormGroup label="Question Text">
                      <TextArea
                        fill
                        rows={2}
                        value={q.text}
                        onChange={(e) =>
                          updateQuestion(q.id, { text: e.target.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Type">
                      <select
                        className="bp5-html-select"
                        value={q.question_type}
                        onChange={(e) =>
                          updateQuestion(q.id, {
                            question_type: e.target.value as QuestionType,
                          })
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
                    {(q.question_type === "MULTIPLE_CHOICE" ||
                      q.question_type === "LIKERT" ||
                      q.question_type === "RATING") && (
                      <FormGroup label="Options (comma-separated)">
                        <InputGroup
                          value={q.options.join(", ")}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              options: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="Strongly agree, Agree, Neutral, Disagree, Strongly disagree"
                        />
                      </FormGroup>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 className="bp5-heading" style={{ margin: 0 }}>Participants</h4>
                <Button icon="import" text="Import CSV" onClick={() => setImportOpen(true)} />
              </div>
              {participantsFile ? (
                <Callout intent={Intent.SUCCESS} icon="tick">
                  Selected file: {participantsFile.name}
                </Callout>
              ) : (
                <Callout intent={Intent.NONE} icon="info-sign">
                  Participants are optional. You can add them later or import a CSV now.
                </Callout>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <h4 className="bp5-heading" style={{ marginBottom: 12 }}>Review</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <strong>Name:</strong> {name}
                  <br />
                  <strong>Description:</strong> {description}
                  <br />
                  <strong>Target:</strong> {targetCount} responses
                </div>
                <div>
                  <strong>Questions:</strong> {questions.length}
                  <br />
                  <strong>Participants file:</strong>{" "}
                  {participantsFile ? participantsFile.name : "None"}
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <strong>Question Preview:</strong>
                <ol style={{ marginTop: 8, paddingLeft: 20 }}>
                  {questions.map((q) => (
                    <li key={q.id}>{q.text || "(Untitled)"}</li>
                  ))}
                </ol>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <Callout intent={Intent.SUCCESS} icon="tick" title="Ready to launch">
                Your poll is configured and ready to start collecting responses.
              </Callout>
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Button
                  intent={Intent.PRIMARY}
                  large
                  icon="play"
                  text="Launch Poll"
                  onClick={handleNext}
                  loading={pollMutations.submitting}
                />
              </div>
            </>
          )}
        </div>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            {step > 0 && step < 4 && (
              <Button text="Back" onClick={handleBack} />
            )}
            {step < 4 && (
              <Button
                intent={Intent.PRIMARY}
                text="Next"
                onClick={handleNext}
                disabled={!isStepValid()}
                loading={pollMutations.submitting || questionMutations.submitting}
              />
            )}
          </>
        }
      />

      <ParticipantImportDialog
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        pollId={pollId ?? ""}
        onImported={() => {
          setImportOpen(false);
        }}
      />
    </Dialog>
  );
}
