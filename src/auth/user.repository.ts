import {ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
@EntityRepository(User)
export class UserRepository extends Repository<User> {
   async signup(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const {username, password} =  authCredentialsDto; 
    // const salt =await bcrypt.genSalt();
    
    // const user = new User();
    const user = this.create();
    user.salt=await bcrypt.genSalt();;
    user.username=username;
    user.password= await this.hashPassword(password,user.salt);
    try {
        await user.save();  
    } catch (error) {
        if (error.code === "23505") {
            throw new ConflictException('User already exists');
        }else{
            throw new InternalServerErrorException("Something went Wrong");
        }
    }    
   }






   async signin(authCredentialsDto: AuthCredentialsDto): Promise<string>{
        const {username, password} =  authCredentialsDto; 
        const user = await this.findOne({username});
        if (user && await user.validatePassword(password)) {
            return user.username;
        }
        return null;
    }

   private hashPassword (password: string, salt: string): Promise<string>{
        return bcrypt.hash(password,salt);
   }


  
}