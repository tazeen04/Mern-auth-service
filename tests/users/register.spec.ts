import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            // AAA
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid jason response', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should persist user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.body).toHaveProperty('user');
        });
    });
    describe('Missing fields', () => {});
});
