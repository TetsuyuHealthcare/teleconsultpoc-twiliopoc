import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddScheduledTimeToMeets1608749467653 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'meets',
      new TableColumn({
        name: 'scheduledTime',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('meets', 'scheduledTime');
  }
}
