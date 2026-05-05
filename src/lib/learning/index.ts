export type LearningTrack = {
  id: string;
  name: string;
  description: string;
};

export const learningTracks: LearningTrack[] = [
  {
    id: 'memory',
    name: 'Memory',
    description: 'Recall drills and spaced reinforcement prompts.',
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    description: 'Argument decomposition and structured analysis.',
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Decision practice, reflection, and communication exercises.',
  },
];
