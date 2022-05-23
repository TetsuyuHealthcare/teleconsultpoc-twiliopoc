import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveNotNullConstraintInMeets1612755847116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'meets',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'meets',
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'name',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
