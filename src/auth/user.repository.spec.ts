import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {username:'TestUsername' , password:'TestPassword'}
describe('UserReqpository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp',() => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });
        it('successfully signs up the user',async () => {
            save.mockResolvedValue(undefined);
            await expect(userRepository.signup(mockCredentialsDto)).resolves.not.toThrow();
        });
        it('rejects conflict exception : user exists',async () => {
            save.mockRejectedValue({code: '23505'});
            await expect(userRepository.signup(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('Server error', async () => {
            save.mockRejectedValue({code: '123456'}); //unhandled error
            await expect(userRepository.signup(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });


    describe('validateUserPassword',() => {
        let user;
        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUsername';
            user.salt = 'salt';
            user.validatePassword = jest.fn()
        });
        it('returns the username if validation is successful', async () =>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);

            const result =  await userRepository.signin(mockCredentialsDto);
            expect(result).toEqual('TestUsername');
        });

        it('returns null as user not found',async () =>{
            userRepository.findOne.mockResolvedValue(null);
            const result =  await userRepository.signin(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull()
        });

        it('returns null as password is invalid',async () =>{
                userRepository.findOne.mockResolvedValue(user);
                user.validatePassword.mockResolvedValue(false);
                const result =  await userRepository.signin(mockCredentialsDto);
                expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testpassword','testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword','testSalt');
            expect(result).toEqual('testHash')
        });
    });
});