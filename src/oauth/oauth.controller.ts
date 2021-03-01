import { Controller, Get, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthService } from './oauth.service';

@Controller()
export class OauthController {
    constructor(private readonly oauthService: OauthService){}
    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req){

    }

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, _password:string){
        const result = await this.oauthService.googleLogin(req)
        console.log("🚀 ~ file: oauth.controller.ts ~ line 18 ~ OauthController ~ googleAuthRedirect ~ result", result)
        
        return result
    }

    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get('auth/facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookLoginRedirect(@Req() req): Promise<any> {
        return this.oauthService.facebookLogin(req)
    }
}
