import { useState } from "react";
import {
  createTask,
  updateTask,
  deleteTask,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  createComment,
  updateComment,
  deleteComment,
} from "../api/taskApi";
import type {
  TaskCreatePayload,
  TaskUpdatePayload,
  MilestoneCreatePayload,
  MilestoneUpdatePayload,
  CommentCreatePayload,
} from "../types";

export interface UseTaskMutationsOptions {
  onSuccess?: () => void;
}

export interface UseTaskMutationsResult {
  submitting: boolean;
  error: string | null;
  clearErrors: () => void;
  create: (payload: TaskCreatePayload) => Promise<boolean>;
  update: (id: string, payload: TaskUpdatePayload) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  addMilestone: (taskId: string, payload: MilestoneCreatePayload) => Promise<boolean>;
  editMilestone: (id: string, payload: MilestoneUpdatePayload) => Promise<boolean>;
  removeMilestone: (id: string) => Promise<boolean>;
  addComment: (taskId: string, payload: CommentCreatePayload) => Promise<boolean>;
  editComment: (commentId: string, payload: CommentCreatePayload) => Promise<boolean>;
  removeComment: (commentId: string) => Promise<boolean>;
}

export function useTaskMutations(
  options: UseTaskMutationsOptions = {},
): UseTaskMutationsResult {
  const { onSuccess } = options;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearErrors() {
    setError(null);
  }

  async function withMutationLifecycle(
    fn: () => Promise<void>,
  ): Promise<boolean> {
    if (submitting) return false;
    setSubmitting(true);
    clearErrors();
    try {
      await fn();
      onSuccess?.();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function create(payload: TaskCreatePayload): Promise<boolean> {
    return withMutationLifecycle(() => createTask(payload).then(() => void 0));
  }

  async function update(id: string, payload: TaskUpdatePayload): Promise<boolean> {
    return withMutationLifecycle(() => updateTask(id, payload).then(() => void 0));
  }

  async function remove(id: string): Promise<boolean> {
    return withMutationLifecycle(() => deleteTask(id).then(() => void 0));
  }

  async function addMilestone(
    taskId: string,
    payload: MilestoneCreatePayload,
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      createMilestone(taskId, payload).then(() => void 0),
    );
  }

  async function editMilestone(
    id: string,
    payload: MilestoneUpdatePayload,
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      updateMilestone(id, payload).then(() => void 0),
    );
  }

  async function removeMilestone(id: string): Promise<boolean> {
    return withMutationLifecycle(() => deleteMilestone(id).then(() => void 0));
  }

  async function addComment(
    taskId: string,
    payload: CommentCreatePayload,
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      createComment(taskId, payload).then(() => void 0),
    );
  }

  async function editComment(
    commentId: string,
    payload: CommentCreatePayload,
  ): Promise<boolean> {
    return withMutationLifecycle(() =>
      updateComment(commentId, payload).then(() => void 0),
    );
  }

  async function removeComment(commentId: string): Promise<boolean> {
    return withMutationLifecycle(() => deleteComment(commentId).then(() => void 0));
  }

  return {
    submitting,
    error,
    clearErrors,
    create,
    update,
    remove,
    addMilestone,
    editMilestone,
    removeMilestone,
    addComment,
    editComment,
    removeComment,
  };
}
