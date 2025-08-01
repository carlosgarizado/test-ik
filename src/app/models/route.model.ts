export interface IContactParameters {
  Placa: string;
  Vehiculo: string;
}

export interface IStop {
  id: number;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface IRoute {
  id: number;
  name: string;
  schedule_start_date: string;
  schedule_end_date: string;
  schedule_start_time: string;
  schedule_end_time: string;
  max_capacity: number;
  remaining_capacity: number;
  contact_additional_parameters?: IContactParameters | null;
  state: 'available' | 'full' | string;
  first_stop: IStop;
  last_stop: IStop;
}

export interface IRouteResponse {
  avaliable_services: IRoute[];
}
