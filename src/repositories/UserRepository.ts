import { EntityRepository, Repository } from 'typeorm';
import { UserModel } from '../models/UserModel';
import { Carbon } from '../libs/Carbon';
import { MAX_ATTEMPT } from '../helpers/variables';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
    async getUserByUserName(username: string): Promise<UserModel | undefined> {
        return this.createQueryBuilder('users')
            .where('users.email = :username', { username })
            .orWhere('users.mobile = :username', { username })
            .getOne();
    }

    async updateAttemptOfUser(uuid: string): Promise<void> {
        await this.createQueryBuilder()
            .update()
            .set({ attempts: () => 'attempts - 1' })
            .where('uuid = :uuid', { uuid: uuid })
            .execute();
    }

    async updateLockUser(uuid: string): Promise<void> {
        const now = Carbon.nowFormatted();
        await this.createQueryBuilder()
            .update()
            .set({ attempts_at: now })
            .where('uuid = :uuid', { uuid: uuid })
            .execute();
    }

    async updateUnlockUser(uuid: string): Promise<void> {
        await this.createQueryBuilder()
            .update()
            .set({ attempts: MAX_ATTEMPT, attempts_at: undefined })
            .where('uuid = :uuid', { uuid: uuid })
            .execute();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    async checkExist(column: object): Promise<boolean> {
        const count = await this.count({
            where: column,
        });

        return count > 0;
    }

    async deleteUser(uuid: string): Promise<UserModel> {
        const user = await this.findOneOrFail({
            uuid: uuid,
        });
        await this.softDelete(user);
        return user;
    }

    async getUserByUuid(uuid: string): Promise<UserModel> {
        return await this.findOneOrFail({
            uuid: uuid,
        });
    }
}
