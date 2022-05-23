import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): Record<string, string> {
    return {
      app: 'twilliopc',
      version: 'v0.0.1',
    };
  }
}
