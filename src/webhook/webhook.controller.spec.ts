import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { WebhookService } from './webhook.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getConnection, Connection } from 'typeorm';
import { mocked } from 'ts-jest/utils';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { user } from '../mocks/user';
import { updateResult } from '../mocks/update.result';

describe('Webhook Controller', () => {
  let controller: WebhookController;
  let service: WebhookService;
  let usersService: UsersService;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [
        WebhookService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    service = moduleRef.get<WebhookService>(WebhookService);
    controller = moduleRef.get<WebhookController>(WebhookController);

    app = moduleRef.createNestApplication();

    await app.init();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it(`/POST webhook /subscription_payment_succeeded`, () => {
    jest.spyOn(usersService, 'findOneWithEmail').mockImplementation(async () => user);
    jest.spyOn(usersService, 'updateSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'cancelSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'findOneWithSubscriptionId').mockImplementation(async () => user);

    return request(app.getHttpServer())
      .post('/webhook')
      .send({
        alert_name: 'subscription_payment_succeeded',
        email: "jo@joduplessis.com",
        quantity: 1,
        next_bill_date: moment().format(),
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect({ success: true });
  });

  it(`/POST webhook /subscription_created`, () => {
    jest.spyOn(usersService, 'findOneWithEmail').mockImplementation(async () => user);
    jest.spyOn(usersService, 'updateSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'cancelSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'findOneWithSubscriptionId').mockImplementation(async () => user);

    return request(app.getHttpServer())
      .post('/webhook')
      .send({
        alert_name: 'subscription_created',
        email: "jo@joduplessis.com",
        cancel_url: "https://api.pdfasaurus.com/cancel_url",
        update_url: "https://api.pdfasaurus.com/update_url",
        subscription_id: 3824015,
        next_bill_date: moment().format(),
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect({ success: true });
  });

  it(`/POST webhook /subscription_cancelled`, () => {
    jest.spyOn(usersService, 'findOneWithEmail').mockImplementation(async () => user);
    jest.spyOn(usersService, 'updateSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'cancelSubscription').mockImplementation(async () => updateResult);
    jest.spyOn(usersService, 'findOneWithSubscriptionId').mockImplementation(async () => user);

    return request(app.getHttpServer())
      .post('/webhook')
      .send({
        alert_name: 'subscription_cancelled',
        subscription_id: 3824015,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect({ success: true });
  });

  afterAll(async () => {
    await app.close();
  });
});
