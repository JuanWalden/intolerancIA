export type ModuleKey =
  | 'inicio'
  | 'situacion'
  | 'trampas'
  | 'cadena'
  | 'arbol'
  | 'hora'
  | 'escalera'
  | 'experimento'
  | 'registro'
  | 'resumen';

export type CertaintyTrap = {
  id: string;
  name: string;
  family: 'head' | 'information' | 'others_decisions';
  description: string;
};

export type UncertaintySituation = {
  id: string;
  description: string;
  unknownElement: string;
  fearedOutcome: string;
  bodySensations: string;
  distress: number;
  urgencyForCertainty: number;
  createdAt: string;
};

export type WhatIfChain = {
  id: string;
  initialTrigger: string;
  links: string[];
  chainName: string;
  finalCatastrophe: string;
  createdAt: string;
};

export type ExposureStep = {
  id: string;
  situation: string;
  distressLevel: number;
  certaintyTrap: string;
  safetyBehaviorToDrop: string;
  valueDirection: string;
  status: 'pending' | 'practicing' | 'completed' | 'repeat';
};

export type BehavioralExperiment = {
  id: string;
  situation: string;
  prediction: string;
  fearedOutcome: string;
  trapToAvoid: string;
  distressBefore: number;
  distressPeak?: number;
  distressAfter?: number;
  valueDirection: string;
  actualOutcome?: string;
  learning?: string;
  createdAt: string;
};

export type AppData = {
  situation?: UncertaintySituation;
  trapsReflections: Record<string, { presence: string; shortRelief: string; longCost: string }>;
  chain?: WhatIfChain;
  decisionLogs: Array<{ concern: string; kind: 'productive' | 'unproductive'; action?: string }>;
  worryPlanner: { hour: string; duration: number; context: string; reminder: string; worries: Array<{ text: string; status?: string; note?: string; createdAt: string }> };
  exposureSteps: ExposureStep[];
  experiments: BehavioralExperiment[];
  weeklyLog: Record<string, { skill: string; distress: number; trap: string; different: string; observed: string; shift: string }>;
  weeklyReflection: Record<string, string>;
  functionalAnalysis: { situation: string; thought: string; emotion: string; trap: string; shortRelief: string; longCost: string; flexibleAlternative: string };
};
