import { Moment } from 'moment';

export interface iDeviceRegistration {
  device: string;
  fcmid: string;
  feed: boolean;
  peoplesoft: boolean;
  timeandattendance: boolean;
}

export interface iDeviceRegistrations extends Array<iDeviceRegistration> {}

export interface iSharepointValues {
  Id: number;
  Title: string;
  OPID: string;
  SPUUID: string;
  IsActive: boolean;
  LastRan: Moment;
  Subscription: iDeviceRegistrations;
}
