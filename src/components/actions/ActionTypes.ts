export type StatusUpdateFrequency = "daily" | "every-other-day" | "weekly" | "bi-weekly";

export interface InvestigateFormState {
  readonly assign: readonly string[];
  readonly watchers: readonly string[];
  readonly statusUpdateEnabled: boolean;
  readonly statusUpdateFrequency: StatusUpdateFrequency;
  readonly targetDate: string;
  readonly instructions: string;
}

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface TaskPersonnelFormState {
  readonly assign: readonly string[];
  readonly priority: TaskPriority;
  readonly instructions: string;
}

export interface WatchFormState {
  readonly featureAtTop: boolean;
  readonly shareWith: readonly string[];
}
