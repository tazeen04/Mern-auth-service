import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import { isJwt } from '../utils';

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        // await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

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
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it('should return an id of the created user', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'abc@gmail.com',
                password: 'secret',
            };
            // act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty('id');
            const repository = connection.getRepository(User);
            const users = await repository.find();
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });

        it('should assign a customer role', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it('should store the hashed password in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            // checking the pattern of the hashed password
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return 400 status code if email is already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const users = await userRepository.find();
            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it('should return access token and refresh token inside a cookie', async () => {
            // store in httpOnly cookie
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

            interface Headers {
                ['set-cookie']: string[];
            }

            // Assert
            let accessToken = null;
            let refreshToken = null;
            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || [];

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });

    describe('Missing fields', () => {
        // validation error
        it('should return 400 status code if email field is missing ', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: '',
                password: 'secret',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            // console.log(response.body);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it('should return 400 status code if firstName is missing ', async () => {
            // Arrange
            const userData = {
                firstName: '',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            // console.log(response.body);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it('should return 400 status code if lastName is missing ', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: '',
                email: 'atazeenm@gmail.com',
                password: 'secret',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            // console.log(response.body);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it('should return 400 status code if password is missing ', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: 'atazeenm@gmail.com',
                password: '',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            // console.log(response.body);
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });

    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            // Arrange
            const userData = {
                firstName: 'Ameena',
                lastName: 'tazeen',
                email: ' atazeenm@gmail.com ',
                password: 'secret',
            };

            // Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            // get data from database
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe('atazeenm@gmail.com');
        });
        it.todo('should return 400 status code if email is not a valid email');
    });
});
