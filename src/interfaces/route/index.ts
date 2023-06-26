import { BookingInterface } from 'interfaces/booking';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RouteInterface {
  id?: string;
  origin: string;
  destination: string;
  available_seats: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  booking?: BookingInterface[];
  user?: UserInterface;
  _count?: {
    booking?: number;
  };
}

export interface RouteGetQueryInterface extends GetQueryInterface {
  id?: string;
  origin?: string;
  destination?: string;
  user_id?: string;
}
