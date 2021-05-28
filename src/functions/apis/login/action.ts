import { Connection } from 'typeorm';
import { UserRepository } from '../../../repositories/UserRepository';
import { AuthAccessDeniedByUsername, AuthAccessDeniedByPassword, AuthAccessDeniedByLockedAccount } from './responses';
import * as bcrypt from 'bcrypt';
import { JWT } from '../../../libs/JWT';
import { Carbon } from '../../../libs/Carbon';
import { MIN_ATTEMPT, MAX_ATTEMPT } from '../../../helpers/variables';

interface OutputData {
    user: {
        id: string;
        name: string;
        email: string;
        mobile: string;
        email_verified_at: string;
        mobile_verified_at: string;
    };
    token: string;
}

interface Uuid {
    uuid: string;
}

export class LoginAction {
    private connection: Connection;
    private repository: UserRepository;

    constructor(connection: Connection) {
        this.connection = connection;
        this.repository = connection.getCustomRepository(UserRepository);
    }

    async execute(username: string, password: string): Promise<OutputData> {
        const user = await this.repository.getUserByUserName(username);

        if (!user) throw new AuthAccessDeniedByUsername();

        if (user.attempts === MIN_ATTEMPT) {
            const unlock = Carbon.greaterThanDateTime(user.attempts_at);

            if (unlock) {
                await this.repository.updateUnlockUser(user.uuid);
            } else {
                await this.repository.updateLockUser(user.uuid);
                throw new AuthAccessDeniedByLockedAccount();
            }
        }

        if (!bcrypt.compareSync(password, user.password)) {
            await this.repository.updateAttemptOfUser(user.uuid);
            const attempt = (user.attempts == MIN_ATTEMPT ? MAX_ATTEMPT : user.attempts) - 1;
            throw new AuthAccessDeniedByPassword(attempt);
        }

        // Reset Attempts every successful login
        await this.repository.updateUnlockUser(user.uuid);

        const token = await JWT.generateToken<Uuid>({ uuid: user.uuid });

        return {
            user: {
                id: user.uuid,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                email_verified_at: user.email_verified_at,
                mobile_verified_at: user.mobile_verified_at,
            },
            token: token,
        };
    }
}
