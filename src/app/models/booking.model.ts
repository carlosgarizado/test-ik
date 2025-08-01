export interface IRoute {
  origin: string;
  destination: string;
  origin_arrival_time: string | null;
  destination_arrival_time: string | null;
}

export interface IAdditionalParameters {
  placa: string | null;
  Vehiculo: string | null;
  photo: string | null;
}

export interface IContact {
  additional_parameters: IAdditionalParameters | null;
}

export interface IBooking {
  id: number;
  service: string;
  booking_date: string;
  state: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  route: IRoute | null;
  contact: IContact;
  service_id : number;
}

export interface IBookingDashboardResponse {
  next_booking: IBooking | null;
  history: IBooking[];
}