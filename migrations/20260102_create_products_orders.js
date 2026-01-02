exports.up = function(knex) {
  return knex.schema
    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.decimal('price', 10, 2).notNullable().defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.decimal('total', 12, 2).notNullable().defaultTo(0);
      table.timestamps(true, true);
    })
    .createTable('order_items', (table) => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products');
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.decimal('price', 10, 2).notNullable().defaultTo(0);
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('products');
};
