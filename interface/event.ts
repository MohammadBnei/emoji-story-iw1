export interface StoryStep {
  selectedEmoji: string;
  order: number;
  emojiCandidate: Record<string, number>;
}

export interface Story {
  storyGPT?: string;
  steps: StoryStep[];
}

export interface ServerToClientEvent {
  'story-update': (story: Story) => void;
  'story-error': (payload: { message: string }) => void;
}

export interface ClientToServerEvent {}
