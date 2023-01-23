import { iTerm } from './iTermstoreTerm';

export interface iFacilityLocations {
  Title: string;
  Facility: iTerm;
  Region: iTerm;
  AHSDisplayName: string;
  TaxCatchAll: iTaxCatchAll[];
  regionTerm: string;
}

export interface iTaxCatchAll {
  Term: string;
}
