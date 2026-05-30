export const up = (pgm) => {
  pgm.createTable('mothers', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_id: {
      type: 'INTEGER',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    age: {
      type: 'INTEGER',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('children', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    user_id: {
      type: 'INTEGER',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    mother_id: {
      type: 'INTEGER',
      references: '"mothers"',
      onDelete: 'SET NULL',
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    birth_date: {
      type: 'DATE',
      notNull: true,
    },
    gender: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('mothers', 'user_id');
  pgm.createIndex('children', 'user_id');
  pgm.createIndex('children', 'mother_id');
};

export const down = (pgm) => {
  pgm.dropTable('children');
  pgm.dropTable('mothers');
};