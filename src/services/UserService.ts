import { Repository } from 'typeorm';
import { User } from '../entity/User';
import { LimitedUserData, UserData } from '../types';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export class UserService {
    // constructor(private userRepository: Repository<User>) {}
    constructor(private userRepository: Repository<User>) {}

    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            // handle error
            const error = createHttpError(400, 'Email already exists');
            throw error;
        }

        // hash password -- use library like bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // store data using USER REPO
        try {
            const newUser = this.userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: Number(tenantId) } : undefined,
            });
            return await this.userRepository.save(newUser); // returns a single user
        } catch {
            throw createHttpError(
                500,
                'Failed to store the data in the database',
            );
        }
    }

    async findbyEmailWithPassword(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'role',
                'password',
            ],
        });
        return user;
    }

    async findById(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        return user;
    }
    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to update the user in the database',
            );
            throw error;
        }
    }
    async getAll() {
        return await this.userRepository.find();
    }
    async deleteById(userId: number) {
        return await this.userRepository.delete(userId);
    }
}
