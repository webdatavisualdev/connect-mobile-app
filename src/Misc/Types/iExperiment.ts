export interface iExperiment<T> {
  key: string;
  category: string;
  name: string;
  description: string;
  setting: T;
  defaultSetting: T;
}
