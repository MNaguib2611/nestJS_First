import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}



    @Post('/signin')
    @UsePipes(ValidationPipe)
    signin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
        return this.authService.signin(authCredentialsDto);
    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signup(@Body() authCredentialsDto: AuthCredentialsDto):  Promise<void>{
        return this.authService.signup(authCredentialsDto);
    }





    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){  
        return user;
    }

}
