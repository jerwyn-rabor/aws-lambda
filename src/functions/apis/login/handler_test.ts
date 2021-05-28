import { execute } from './handler';
import { ApiGatewayEvent } from '../../../libs/Contracts/ApiGatewayEvent';
import { LoginRequest } from './requests';

test('422: PARAMETER ERROR', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify({}),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('errors');
    expect(response).toHaveProperty('errors.password');

    expect(result.statusCode).toBe(422);
    expect(response.code).toBe(422);
});

test('200: SUCCESS - EMAIL', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<LoginRequest>{
            email: 'example@example.com',
            password: 'password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('user.id');
    expect(response).toHaveProperty('user.name');
    expect(response).toHaveProperty('user.email');
    expect(response).toHaveProperty('user.mobile');
    expect(response).toHaveProperty('user.email_verified_at');
    expect(response).toHaveProperty('user.mobile_verified_at');
    expect(response).toHaveProperty('token');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});

test('200: SUCCESS - MOBILE', async () => {
    const event: ApiGatewayEvent = {
        body: JSON.stringify(<LoginRequest>{
            mobile: '09123456789',
            password: 'password',
        }),
    };

    const result = await execute(event);
    const response = JSON.parse(result.body);

    expect(result).toHaveProperty('statusCode');
    expect(result).toHaveProperty('body');
    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('user.id');
    expect(response).toHaveProperty('user.name');
    expect(response).toHaveProperty('user.email');
    expect(response).toHaveProperty('user.mobile');
    expect(response).toHaveProperty('user.email_verified_at');
    expect(response).toHaveProperty('user.mobile_verified_at');
    expect(response).toHaveProperty('token');

    expect(result.statusCode).toBe(200);
    expect(response.code).toBe(200);
});
