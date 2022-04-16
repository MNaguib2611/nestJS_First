import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JWTPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
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
        return {accessToken};
    }
        
        
    async signup(authCredentialsDto: AuthCredentialsDto){
        return this.userRepository.signup(authCredentialsDto);
    }
}
