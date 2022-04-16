import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JWTPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    private logger = new Logger("AuthService");
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        ){}


    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        const username = await  this.userRepository.signin(authCredentialsDto);
        
        if (!username) {
            throw new BadRequestException("username and password dont match");
        }
        const payload: JWTPayload = {username};
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);


        return {accessToken};
    }
        
        
    async signup(authCredentialsDto: AuthCredentialsDto){
        return this.userRepository.signup(authCredentialsDto);
    }
}
