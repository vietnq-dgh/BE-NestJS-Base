import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PublicModules } from "src/common/PublicModules";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../dto/JwtPayload";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      ignoreExpiration: false,
      secretOrKey: PublicModules.TOKEN_SECRETKEY,
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let data = request?.cookies["jwt"];
        if (!data) {
          return null;
        }
        
        return data;
      }])
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    return user;
  }
}