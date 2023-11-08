import { expect, jest } from '@jest/globals';
import AuthLogic from '../../../src/business-logic/auth';
import login from '../../../src/controllers/auth/login.controller';
import HTTPError from '../../../src/errors/http.error';
import authErrors from '../../../src/errors/auth.errors';

jest.mock('../../../src/business-logic/auth');

const createResponseObject = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
});

const testLoginError = async (reqBody, errorName, errorMessage) => {
  const res = createResponseObject();
  const req = { body: reqBody };

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith({
    error: new HTTPError({
      name: errorName,
      message: errorMessage,
      code: 400,
    }),
  });
};

describe('Controller: Auth: Login', () => {
  let res;


  beforeEach(() => {
    res = createResponseObject();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should return an error when email is not defined', async () => {
    await testLoginError(
      { password: 'password' },
      authErrors.login.validation.name,
      authErrors.login.validation.messages.email
    );
  });

  it('Should return an error when password is not defined', async () => {
    await testLoginError(
      { email: 'test@example.com' },
      authErrors.login.validation.name,
      authErrors.login.validation.messages.password
    );
  });

  it('Should return a token when email and password are correct', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'password' },
    };

    AuthLogic.login.mockResolvedValueOnce('token');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ token: 'token' });
  });

  it('Should return an error when email is not valid', async () => {
    await testLoginError(
      { email: 'test', password: 'password' },
      authErrors.login.validation.name,
      authErrors.login.validation.messages.email
    );
  });
});