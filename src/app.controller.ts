import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ip } from './decorators/ip.Decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger();

  @Get()
  getHello(@Ip() ip:string): string {
    return this.appService.getHello();
  }
}
