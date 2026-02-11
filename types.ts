
export enum MetricType {
  SMALLER_BETTER = 'Smaller is Better',
  LARGER_BETTER = 'Larger is Better',
  NOMINAL_BEST = 'Nominal is Best'
}

export interface Factor {
  id: string;
  name: string;
  levels: string[];
}

export interface OrthogonalArray {
  id: string;
  name: string;
  runs: number;
  factors: number;
  levels: number;
  matrix: number[][];
  description: string;
}

export interface ExperimentData {
  oaId: string;
  metricType: MetricType;
  factors: Factor[];
  responses: number[];
  objective: string;
}

export interface AnalysisResult {
  snRatios: number[];
  meansByFactor: { [factorIndex: number]: { [level: number]: number } };
  snByFactor: { [factorIndex: number]: { [level: number]: number } };
  anova: AnovaItem[];
  optimalSettings: { factor: string; level: string; levelIndex: number }[];
}

export interface AnovaItem {
  source: string;
  df: number;
  ss: number;
  ms: number;
  fRatio: number;
  contribution: number;
}
