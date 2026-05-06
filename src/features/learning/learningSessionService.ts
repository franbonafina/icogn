import { learningSessionsRepository } from '@/lib/firebase/repositories';
import { getCurrentAppUser } from '@/lib/firebase/currentUser';
import { recordLearningSessionInProfileMemory } from '@/features/profile/profileMemoryService';
import type { LearningMode, LearningSession } from '@/types/firestore';

export async function saveLearningSession(input: {
  learningItemId: string;
  learningMode: LearningMode;
  prompt: string;
  response: string;
  score: number;
  title: string;
  tags: string[];
}) {
  const { userId } = await getCurrentAppUser();

  const payload: Omit<LearningSession, 'id'> = {
    userId,
    learningItemId: input.learningItemId,
    learningMode: input.learningMode,
    prompt: input.prompt,
    response: input.response,
    score: input.score,
    durationSeconds: 0,
    reviewedAt: null,
    completedAt: null,
    createdAt: null as never,
    updatedAt: null as never,
  };

  const session = await learningSessionsRepository.create(payload);

  await recordLearningSessionInProfileMemory({
    userId,
    title: input.title,
    tags: input.tags,
    learningMode: input.learningMode,
    score: input.score,
  });

  return session;
}
