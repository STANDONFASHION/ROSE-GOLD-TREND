exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('name');
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.schema.alterTable('orders', (table) => {
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('orders', (table) => {
      table.dropColumn('user_id');
    })
    .then(() => knex.schema.dropTableIfExists('users'));
};
