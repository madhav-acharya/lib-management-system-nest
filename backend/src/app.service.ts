import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return 'Hello This is the home page of the library management system!';
  }
}
