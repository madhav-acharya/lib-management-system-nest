import { Request } from 'express';

export interface ReqUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    name: string;
    phoneNumber: string;
    address: string;
  };
}