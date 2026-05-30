export const up = (pgm) => {
  pgm.createTable('articles', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    excerpt: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'TEXT',
      notNull: true,
    },
    source_name: {
      type: 'TEXT',
      notNull: true,
    },
    source_url: {
      type: 'TEXT',
      notNull: true,
    },
    image_url: {
      type: 'TEXT',
    },
    is_featured: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
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

  pgm.createIndex('articles', 'category');
  pgm.createIndex('articles', 'is_featured');
};

export const down = (pgm) => {
  pgm.dropTable('articles');
};