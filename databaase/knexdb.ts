import knex from 'knex'
import config from '../knexfile'

let knexConfigForEnv = ['development', 'staging', 'production'].includes(
  process.env.NODE_ENV,
)
  ? config[process.env.NODE_ENV]
  : config['development']

export default knex(knexConfigForEnv)
