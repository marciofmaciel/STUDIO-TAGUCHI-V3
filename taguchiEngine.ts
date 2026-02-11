
import { ExperimentData, AnalysisResult, MetricType, AnovaItem } from '../types';

export const calculateAnalysis = (data: ExperimentData, matrix: number[][]): AnalysisResult => {
  const { responses, metricType, factors } = data;
  const numRuns = matrix.length;
  
  // 1. Calculate S/N Ratios
  const snRatios = responses.map(y => {
    switch (metricType) {
      case MetricType.SMALLER_BETTER:
        return -10 * Math.log10(y * y);
      case MetricType.LARGER_BETTER:
        return -10 * Math.log10(1 / (y * y));
      case MetricType.NOMINAL_BEST:
        return 10 * Math.log10((y * y) / 1); // Simplified for single-run
      default:
        return 0;
    }
  });

  // 2. Main Effects (Means & SN)
  const meansByFactor: { [f: number]: { [l: number]: number } } = {};
  const snByFactor: { [f: number]: { [l: number]: number } } = {};

  factors.forEach((factor, fIdx) => {
    meansByFactor[fIdx] = {};
    snByFactor[fIdx] = {};
    
    const levelsInMatrix = Array.from(new Set(matrix.map(row => row[fIdx])));
    
    levelsInMatrix.forEach(level => {
      const indices = matrix.map((row, i) => row[fIdx] === level ? i : -1).filter(i => i !== -1);
      const avgMean = indices.reduce((sum, idx) => sum + responses[idx], 0) / indices.length;
      const avgSN = indices.reduce((sum, idx) => sum + snRatios[idx], 0) / indices.length;
      
      meansByFactor[fIdx][level] = avgMean;
      snByFactor[fIdx][level] = avgSN;
    });
  });

  // 3. ANOVA (Approximate)
  const grandMeanSN = snRatios.reduce((a, b) => a + b, 0) / numRuns;
  const totalSS = snRatios.reduce((sum, sn) => sum + Math.pow(sn - grandMeanSN, 2), 0);
  
  const anova: AnovaItem[] = factors.map((factor, fIdx) => {
    const levels = Object.keys(snByFactor[fIdx]).map(Number);
    const n_level = numRuns / levels.length;
    let ssFactor = 0;
    levels.forEach(l => {
        ssFactor += n_level * Math.pow(snByFactor[fIdx][l] - grandMeanSN, 2);
    });
    
    return {
      source: factor.name,
      df: levels.length - 1,
      ss: ssFactor,
      ms: ssFactor / (levels.length - 1),
      fRatio: 0, // Needs error variance for real F-test
      contribution: (ssFactor / totalSS) * 100
    };
  });

  // 4. Optimal Settings (Based on SN)
  const optimalSettings = factors.map((factor, fIdx) => {
    const levels = Object.keys(snByFactor[fIdx]).map(Number);
    let bestLevel = levels[0];
    let maxSN = snByFactor[fIdx][levels[0]];
    
    levels.forEach(l => {
      if (snByFactor[fIdx][l] > maxSN) {
        maxSN = snByFactor[fIdx][l];
        bestLevel = l;
      }
    });
    
    return {
      factor: factor.name,
      level: factor.levels[bestLevel - 1] || `Level ${bestLevel}`,
      levelIndex: bestLevel
    };
  });

  return { snRatios, meansByFactor, snByFactor, anova, optimalSettings };
};

export const checkInteractions = (matrix: number[][], col1: number, col2: number): number[] => {
  // Simple check for 2-level designs where col1 * col2 = aliased column
  return matrix.map(row => (row[col1] === row[col2] ? 1 : 2));
};
