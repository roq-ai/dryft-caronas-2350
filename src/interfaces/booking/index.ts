import { RouteInterface } from 'interfaces/route';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookingInterface {
  id?: string;
  route_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  route?: RouteInterface;
  user?: UserInterface;
  _count?: {};
}

export interface BookingGetQueryInterface extends GetQueryInterface {
  id?: string;
  route_id?: string;
  user_id?: string;
}
