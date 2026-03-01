export interface PredictionResponse {
  probability:number;
  risk_level:string;
  shap_values:number[];
  features:string[];
}
