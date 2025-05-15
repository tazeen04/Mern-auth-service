import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import createJWKSMock from 'mock-jwks';
import { isJwt } from '../utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('GET /auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should return the 200 status code', async () => {
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });

        it('should return the user data', async () => {
            // user shld be registered
            const userData = {
                firstName: 'Ameena',
                lastName: 'Tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            // Add token to cookie

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();
            // Assert
            // check if user is maches with registred user
            expect((response.body as Record<string, string>).id).toBe(data.id);
        });

        it('should not return the password field', async () => {
            // user shld be registered
            const userData = {
                firstName: 'Ameena',
                lastName: 'Tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            // Add token to cookie

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();
            // Assert
            // check if user is maches with registred user
            expect(response.body as Record<string, string>).not.toHaveProperty(
                'password',
            );
        });

        it('should return 401 status code if token does not exits', async () => {
            // user shld be registered
            const userData = {
                firstName: 'Ameena',
                lastName: 'Tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            // Add token to cookie

            const response = await request(app).get('/auth/self').send();
            // Assert
            expect(response.statusCode).toBe(401);
        });
    });
});
