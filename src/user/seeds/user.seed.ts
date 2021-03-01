import { Command, Positional } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserSeed {
    constructor(
        private readonly connection: Connection
    ) { }
    
    private readonly logger = new Logger(UserSeed.name);

    @Command({ command: 'seed:admin', describe: 'Seed a admin', autoExit: true })
    async createAdmin(
        @Positional({
            name: 'email',
            describe: 'The admin email string',
            type: 'string',
            default: 'phuoctrumcuoi@gmail.com'
          }) email: string,
    ) {
        const admin = new UserEntity();
        admin.firstName = "admin";
        admin.lastName = "Manage";
        admin.email= email;
        admin.password = '12345678';

        const repository = this.connection.getRepository(UserEntity);
        const adminExists = await repository.findOne({ where: { email }});
        if (adminExists) {
            return this.logger.warn(`Email ${email} exixtsed !!!`)
        }
        const result = await this.connection.getRepository(UserEntity).save(admin);
        this.logger.log(`[Seed][Admin] Create new admin successful | ID = ${result.id}`);
    }
}