class MigrationSteps {
  static schema = 'daita';
  static table = 'migrationSteps';

  migrationId!: string;
  migrationSchema!: string;
  index!: number;
  step!: string;
}
