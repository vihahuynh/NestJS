import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';

const USER = [
  { id: 1, email: 'meow01@gmeow.com', password: '123' },
  { id: 1, email: 'meow02@gmeow.com', password: '456' },
  { id: 1, email: 'meow03@gmeow.com', password: '789' },
] as User[];

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) => {
        return Promise.resolve(USER.filter((user) => user.email === email));
      },
      findOne: (id: number) => {
        const user = USER.find((user) => user.id === id);
        if (user) return Promise.resolve(user);
        return Promise.reject('No user found');
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a liest of users with the given email', async () => {
    const USER_EMAIL = 'meow01@gmeow.com';
    const users = await controller.findAllUsers(USER_EMAIL);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(USER_EMAIL);
  });

  it('findUser returns a signle user with the given id', async () => {
    const ID = 1;
    const user = await controller.findUser(ID);
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    const ID = 9;
    await expect(controller.findUser(ID)).rejects.toMatch('No user found');
  });

  it('sign in updates session object and returns user', async () => {
    const session: { userId: number } = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'meow@meow.com',
        password: '12345',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
