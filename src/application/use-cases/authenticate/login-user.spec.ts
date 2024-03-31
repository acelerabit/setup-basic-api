import { JwtService } from '@nestjs/jwt';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { vi } from 'vitest';
import { InMemoryUsersRepository } from './../../../../test/repositories/user/in-memory-user-repository';
import { User } from './../../entities/user';
import { CreateUser } from './../user/create-user';
import { LoginUser } from './login-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let loginUser: LoginUser;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let jwt: JwtService;
let createUser: CreateUser;

describe('Authenticate User', () => {
  const mockJwt = vi.fn().mockImplementation(() => {
    return {
      signAsync: vi.fn().mockResolvedValue('sdskdlksd'),
    };
  });

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    jwt = mockJwt();
    loginUser = new LoginUser(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
      jwt,
    );
    createUser = new CreateUser(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able login with existent user', async () => {
    const newUser = new User({
      name: 'user-test',
      email: 'email@test.com',
      password: '123',
      role: 'USER',
      createdAt: new Date(),
    });

    await createUser.execute(newUser);

    const { accessToken } = await loginUser.execute({
      email: 'email@test.com',
      password: '123',
    });

    expect(accessToken).not.toBeFalsy();
  });
});
