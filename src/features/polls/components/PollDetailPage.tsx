import { useState } from "react";
import {
  Spinner,
  NonIdealState,
  Callout,
  Intent,
  Tag,
  Button,
  Tabs,
  Tab,
  Card,
  Classes,
} from "@blueprintjs/core";
import { useParams, useNavigate } from "react-router";
import { usePoll, useQuestions, useParticipants, useResponseAggregates } from "../hooks/usePolls";
import { POLL_STATUS_INTENT, POLL_STATUS_LABEL } from "../types";
import PollLifecycleActions from "./PollLifecycleActions";
import PollQuestionEditor from "./PollQuestionEditor";
import ParticipantListTable from "./ParticipantListTable";
import PollResponseDashboard from "./PollResponseDashboard";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { poll, loading, error, refetch } = usePoll(id);
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuestions(id);
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
    refetch: refetchParticipants,
  } = useParticipants(id);
  const {
    aggregates,
    loading: aggregatesLoading,
    error: aggregatesError,
    refetch: _refetchAggregates,
  } = useResponseAggregates(id);

  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 80,
        }}
      >
        <Spinner size={40} />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <NonIdealState
        icon="error"
        title="Poll not found"
        description={error ?? "The requested poll could not be loaded."}
        action={<Button text="Back" onClick={() => navigate(-1)} />}
      />
    );
  }

  const responseRate =
    poll.target_response_count > 0
      ? Math.round((poll.actual_response_count / poll.target_response_count) * 100)
      : 0;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Button
          minimal
          icon="arrow-left"
          text="Polls"
          onClick={() => navigate(-1)}
        />
        <Tag intent={POLL_STATUS_INTENT[poll.status]} minimal>
          {POLL_STATUS_LABEL[poll.status]}
        </Tag>
        <div style={{ marginLeft: "auto" }}>
          <PollLifecycleActions
            pollId={poll.id}
            status={poll.status}
            onMutate={refetch}
          />
        </div>
      </div>

      <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600 }}>
        {poll.name}
      </h2>
      <p
        className={Classes.TEXT_MUTED}
        style={{ margin: "0 0 20px", fontSize: 14 }}
      >
        {poll.description}
      </p>

      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card style={{ background: "var(--cds-layer-01, #262626)" }}>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            RESPONSES
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
            {poll.actual_response_count}
          </div>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
            of {poll.target_response_count} target
          </div>
        </Card>
        <Card style={{ background: "var(--cds-layer-01, #262626)" }}>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            RESPONSE RATE
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
            {responseRate}%
          </div>
        </Card>
        <Card style={{ background: "var(--cds-layer-01, #262626)" }}>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            QUESTIONS
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
            {questions.length}
          </div>
        </Card>
        <Card style={{ background: "var(--cds-layer-01, #262626)" }}>
          <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>
            PARTICIPANTS
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
            {participants.length}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        selectedTabId={activeTab}
        onChange={(id) => setActiveTab(id as string)}
      >
        <Tab id="overview" title="Overview" panel={
          <div style={{ paddingTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h4 className="bp5-heading" style={{ fontSize: 14, marginBottom: 12 }}>Details</h4>
                <div style={{ marginBottom: 12 }}>
                  <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>CREATED</div>
                  <div style={{ fontSize: 13 }}>{formatDate(poll.created_at)}</div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className={Classes.TEXT_MUTED} style={{ fontSize: 11 }}>CAMPAIGN</div>
                  <div style={{ fontSize: 13 }}>{poll.campaign_id}</div>
                </div>
              </div>
              <div>
                <h4 className="bp5-heading" style={{ fontSize: 14, marginBottom: 12 }}>Response Progress</h4>
                <div
                  style={{
                    height: 8,
                    background: "var(--cds-border-subtle, #393939)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${responseRate}%`,
                      height: "100%",
                      background:
                        responseRate >= 80
                          ? "#24a148"
                          : responseRate >= 50
                            ? "#0f62fe"
                            : "#f1c21b",
                      transition: "width 200ms ease",
                    }}
                  />
                </div>
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 12, marginTop: 8 }}>
                  {poll.actual_response_count} of {poll.target_response_count} responses collected
                </div>
              </div>
            </div>
          </div>
        } />

        <Tab
          id="questions"
          title={`Questions (${questions.length})`}
          panel={
            <div style={{ paddingTop: 16 }}>
              {questionsError && (
                <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
                  {questionsError}
                </Callout>
              )}
              <PollQuestionEditor
                pollId={poll.id}
                questions={questions}
                loading={questionsLoading}
                onMutate={refetchQuestions}
              />
            </div>
          }
        />

        <Tab
          id="participants"
          title={`Participants (${participants.length})`}
          panel={
            <div style={{ paddingTop: 16 }}>
              {participantsError && (
                <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
                  {participantsError}
                </Callout>
              )}
              <ParticipantListTable
                pollId={poll.id}
                participants={participants}
                loading={participantsLoading}
                onMutate={refetchParticipants}
              />
            </div>
          }
        />

        <Tab
          id="responses"
          title="Responses"
          panel={
            <div style={{ paddingTop: 16 }}>
              {aggregatesError && (
                <Callout intent={Intent.DANGER} icon="error" style={{ marginBottom: 16 }}>
                  {aggregatesError}
                </Callout>
              )}
              <PollResponseDashboard
                aggregates={aggregates}
                loading={aggregatesLoading}
              />
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
