import { createAccessCodesSeed } from './createAccessCodes.js';
import { seedDemoProfile } from './seedDemoProfile.js';
import { seedDecisionScenariosData } from './seedDecisionScenarios.js';
import { seedLearningItemsData } from './seedLearningItems.js';

async function main() {
  await createAccessCodesSeed();
  await seedLearningItemsData();
  await seedDecisionScenariosData();
  await seedDemoProfile();
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
