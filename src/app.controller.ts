import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  verifyApi(): string {
    return 'The Connection to the APi is correct.';
  }

  @UseGuards(AuthGuard())
  @Get('/token')
  verifyToken(): string {
    return 'The user token works correctly.';
  }
}
