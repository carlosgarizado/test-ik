export interface IGeoFence {
  type: 'Point';
  coordinates: [number, number];
}
export interface IStop {
  order: number;
  description: string;
  address: string;
  extra_address: string;
  geo_fence: IGeoFence;
  latitude: number | null;
  longitude: number | null;
  arrival_time : string;
}
export interface IStopsResponse {
  stops: IStop[];
}