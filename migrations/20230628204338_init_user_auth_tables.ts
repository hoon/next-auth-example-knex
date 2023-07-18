import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('user', (table) => {
      table.uuid('id').primary()
      table.string('name')
      table.string('email').unique()
      table.dateTime('emailVerified')
      table.string('image')
    })
    .createTable('account', (table) => {
      table.uuid('id').primary()
      table.uuid('userId')
      table.string('type').notNullable()
      table.string('provider').notNullable()
      table.string('providerAccountId').notNullable()
      table.string('refresh_token')
      table.string('access_token')
      table.integer('expires_at')
      table.string('token_type')
      table.string('scope')
      table.string('id_token')
      table.string('session_state')
    })
    .createTable('session', (table) => {
      table.uuid('id').primary()
      table.datetime('expires').notNullable()
      table.string('sessionToken').unique().notNullable()
      table.uuid('userId')
    })
    .createTable('verification_token', (table) => {
      table.uuid('token').primary()
      table.string('identifier').notNullable()
      table.datetime('expires').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('user')
    .dropTable('account')
    .dropTable('session')
    .dropTable('verification_token')
}
