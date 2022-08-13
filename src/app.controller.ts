import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { TaskRes } from './common/Classess';
import { RolerUser } from './common/Enums';
import { RolesGaurd } from './modules/auth/Guards/roles.gaurd';

@Controller()
@ApiTags('ROOT')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Root Api | click to check status' })
  getHello(): TaskRes {
    return this.appService.getHello();
  }

  @Post('email/:emailTo')
  @ApiOperation({ summary: 'Test send mail function: ONLY role [ADMIN]' })
  @UseGuards(AuthGuard(), new RolesGaurd(RolerUser.ADMIN))
  testSendMail(@Param('emailTo') emailTo: string) {
    return this.appService.testSendMail(emailTo);
  }
}
