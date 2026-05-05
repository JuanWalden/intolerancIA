import type { AppData } from '../types';

const KEY = 'vivir-en-el-quizas-data';

export const loadData = (): AppData => {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return {
      trapsReflections: {},
      decisionLogs: [],
      worryPlanner: { hour: '19:00', duration: 15, context: '', reminder: '', worries: [] },
      exposureSteps: [],
      experiments: [],
      weeklyLog: {},
      weeklyReflection: {},
      functionalAnalysis: { situation: '', thought: '', emotion: '', trap: '', shortRelief: '', longCost: '', flexibleAlternative: '' },
    };
  }
  return JSON.parse(raw) as AppData;
};

export const saveData = (data: AppData) => localStorage.setItem(KEY, JSON.stringify(data));
export const clearData = () => localStorage.removeItem(KEY);
