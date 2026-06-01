export const up = (pgm) => {
  pgm.createTable("stunting_analyses", {
    id: {
      type: "serial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },

    child_name: {
      type: "text",
      notNull: true,
    },

    gender: {
      type: "text",
      notNull: true,
    },

    age_month: {
      type: "integer",
      notNull: true,
    },

    weight_kg: {
      type: "numeric(5,2)",
      notNull: true,
    },

    height_cm: {
      type: "numeric(5,2)",
      notNull: true,
    },

    bmi: {
      type: "numeric(5,2)",
    },

    risk_category: {
      type: "text",
    },

    confidence: {
      type: "text",
    },

    ai_response: {
      type: "text",
    },

    raw_ai_result: {
      type: "jsonb",
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createIndex("stunting_analyses", "user_id");
  pgm.createIndex("stunting_analyses", "created_at");
  pgm.createIndex("stunting_analyses", "risk_category");
};

export const down = (pgm) => {
  pgm.dropIndex("stunting_analyses", "risk_category");
  pgm.dropIndex("stunting_analyses", "created_at");
  pgm.dropIndex("stunting_analyses", "user_id");

  pgm.dropTable("stunting_analyses");
};