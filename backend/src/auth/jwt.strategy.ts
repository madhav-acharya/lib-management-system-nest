import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { JwtPayload } from "src/interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private readonly usersService: UsersService) {
        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret) {
            throw new Error('jwt secret is not defined in the configuration');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        })
    }

    async validate(payload: JwtPayload) {
        try {
            const user = await this.usersService.findUserByEmail(payload.email);
            if (!user.data) {
                throw new Error('User not found');
            }
            return {
                id: user.data.id,
                email: user.data.email,
                role: user.data.role,
                name: user.data.name,
                phoneNumber: user.data.phoneNumber,
                address: user.data.address,
            };
        } catch (error) {
            throw new Error('Error validating JWT token: ' + error.message);
            
        }
    }
    
}