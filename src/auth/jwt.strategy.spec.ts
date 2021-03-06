import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

const mockUserRepository = () => ({
    findOne: jest.fn(),
})

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async() => {
        const module =  await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {provide: UserRepository,useFactory: mockUserRepository}
            ],
        }).compile();
        jwtStrategy = await  module.get<JwtStrategy>(JwtStrategy);
        userRepository = await  module.get<UserRepository>(UserRepository);
    });

    describe("validate",  () => {
        it('validates and returns user based on JWT payload',async () => {
            const user = new User();
            user.username = 'TestUser';
            userRepository.findOne.mockResolvedValue(user);
            const result =  await jwtStrategy.validate({username:'TestUser'});
            expect( userRepository.findOne).toHaveBeenCalledWith({username:'TestUser'});
            expect( result).toEqual(user);
        });

        it('returns unauthorized exception as user can not be found',async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(jwtStrategy.validate({username:'TestUser'})).rejects.toThrow(UnauthorizedException);
        });
    });
});