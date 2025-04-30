import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { UserData } from '../types';

export class UserService {
    async create({ firstName, lastName, email, password }: UserData) {
        const userRepository = AppDataSource.getRepository(User);

        // store data using USER REPO
        await userRepository.save({
            firstName,
            lastName,
            email,
            password,
        });
    }
}
