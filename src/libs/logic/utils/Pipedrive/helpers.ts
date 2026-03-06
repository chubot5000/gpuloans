import { STAGES, STAGES_ORDER } from "data/clients/pipedrive/constants.generated";

const stageIndexMap = new Map<STAGES, number>(STAGES_ORDER.map((stage, index) => [stage, index]));

export const getStageIndex = (stageId: STAGES): number => stageIndexMap.get(stageId) ?? -1;

export const compareStages = (a: STAGES, b: STAGES): number => getStageIndex(a) - getStageIndex(b);

export const isAtOrPastStage = (currentStageId: STAGES, targetStage: STAGES): boolean =>
  getStageIndex(currentStageId) >= getStageIndex(targetStage);

export const isBeforeStage = (currentStageId: STAGES, targetStage: STAGES): boolean =>
  getStageIndex(currentStageId) < getStageIndex(targetStage);

export const isAtStage = (currentStageId: STAGES, targetStage: STAGES): boolean => currentStageId === targetStage;

export const isStageBetween = (currentStageId: STAGES, from: STAGES, to: STAGES): boolean =>
  isAtOrPastStage(currentStageId, from) && !isAtOrPastStage(currentStageId, to);
