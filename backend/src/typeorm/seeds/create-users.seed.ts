import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { UserEntity } from '../../user/user.entity';
import { bcryptConstants } from '../../user/constant';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          email: 'admin@gmail.com',
          passwordHash: await bcrypt.hash('password123', bcryptConstants.saltRounds),
        },
      ])
      .execute();
  }
}
