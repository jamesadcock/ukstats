// Response shapes returned by www.ons.gov.uk/{path}/timeseries/{CDID}/data

export interface OnsTimeseriesMonth {
  date: string; // e.g. "2026 FEB"
  value: string; // e.g. "3.2"
  label: string; // e.g. "2026 FEB"
  year: string; // e.g. "2026"
  month: string; // e.g. "February"
  quarter: string;
  sourceDataset: string;
  updateDate: string; // ISO e.g. "2026-03-20T00:00:00.000Z"
}

export interface OnsTimeseriesQuarter {
  date: string; // e.g. "2025 Q4"
  value: string;
  label: string;
  year: string;
  quarter: string; // e.g. "Q4"
  sourceDataset: string;
  updateDate: string;
}

export interface OnsTimeseriesYear {
  date: string; // e.g. "2025"
  value: string;
  label: string;
  year: string;
  sourceDataset: string;
  updateDate: string;
}

export interface OnsTimeseriesDescription {
  title: string;
  unit: string;
  preUnit: string;
  source: string;
  releaseDate: string;
  nextRelease: string;
  importantNotes: string;
}

export interface OnsTimeseriesResponse {
  description: OnsTimeseriesDescription;
  months: OnsTimeseriesMonth[];
  quarters: OnsTimeseriesQuarter[];
  years: OnsTimeseriesYear[];
}
