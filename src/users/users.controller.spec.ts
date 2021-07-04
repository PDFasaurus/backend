import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { IUpdateTemplate } from 'src/lib/update-template';
import { IUserSubscription } from 'src/lib/user-subscription';
import { JwtService, JwtModule } from '@nestjs/jwt';
const https = require("https");
import { user } from '../mocks/user';
import { updateResult } from '../mocks/update.result';

jest.mock('https');

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: JwtService,
          useValue: {}
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ]
    }).compile();

    // Create our mock objects
    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);

    // Set up the mock functions
    jest.spyOn(service, 'findOne').mockImplementation(async () => user);
    jest.spyOn(service, 'findOneWithSubscriptionId').mockImplementation(async () => user);
    jest.spyOn(service, 'findOneWithEmail').mockImplementation(async () => user);
    jest.spyOn(service, 'findOneWithEmailAndResetToken').mockImplementation(async () => user);
    jest.spyOn(service, 'findOneWithApiKey').mockImplementation(async () => user);
    jest.spyOn(service, 'findOneWithApiKeyWithRequests').mockImplementation(async () => user);
    jest.spyOn(service, 'updateApiKey').mockImplementation(async () => updateResult);
    jest.spyOn(service, 'update').mockImplementation(async () => updateResult);
    jest.spyOn(service, 'cancelSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(service, 'updateSubscriptionPlan').mockImplementation(async () => updateResult);
    jest.spyOn(service, 'updateSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(service, 'create').mockImplementation(async () => user);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find one user', async () => {
    expect(await controller.findOne(1, <User>{})).toBe(user);
  });

  it('update user', async () => {
    expect(await controller.update(1, <User>{ name: "Jo" })).toBe(updateResult);
  })

  it('update user subscriptions', async () => {
    expect(await controller.updateSubscription(1, <User>{})).toBeTruthy();
    expect(await controller.cancelSubscription(1)).toBeTruthy();
  });
});
