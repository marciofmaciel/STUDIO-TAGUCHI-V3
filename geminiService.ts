
import { GoogleGenAI } from "@google/genai";
import { ExperimentData, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTechnicalReport = async (data: ExperimentData, results: AnalysisResult) => {
  const prompt = `
    Act as a senior DOE consultant. Generate a Technical Report for a Taguchi Experiment.
    
    Experiment Setup:
    - Objective: ${data.objective}
    - Metric: ${data.metricType}
    - Factors: ${JSON.stringify(data.factors.map(f => f.name))}
    
    Results:
    - Optimal Settings: ${JSON.stringify(results.optimalSettings)}
    - ANOVA Contributions: ${JSON.stringify(results.anova.map(a => ({ source: a.source, contribution: a.contribution.toFixed(2) + '%' })))}
    
    Format using Markdown:
    ## Technical Report — DOE Taguchi
    ### Analysis of Data
    - Response column analysis overview.
    - Metric interpretation (${data.metricType}).
    
    ### Main Effects
    - Highlight which factors are most significant.
    
    ### Recommendation
    - Detail the optimal levels.
    
    ### Confirmation
    - Suggest a confirmation test strategy.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text;
};

export const generateExecutiveReport = async (data: ExperimentData, results: AnalysisResult) => {
  const prompt = `
    Generate an Executive Summary for a Taguchi DOE.
    
    Experiment Setup:
    - Objective: ${data.objective}
    - Metric: ${data.metricType}
    - Array: ${data.oaId}
    - Optimal Recommendation: ${results.optimalSettings.map(s => `${s.factor}: ${s.level}`).join(', ')}

    Format using Markdown:
    ## Executive Report — DOE Taguchi
    ### Objective
    Brief summary.
    ### Setup
    Brief summary of the OA used.
    ### Recommendation
    Strategic advice based on the optimal levels.
    ### Conclusion
    Final takeaway for management.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  return response.text;
};
