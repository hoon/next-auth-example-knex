import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from 'next-auth/adapters'

import type { Knex } from 'knex'
import crypto from 'crypto'

export interface KnexAdapterOptions {}

export default function KnexAdapter(knex: Knex<any, unknown[]>): Adapter {
  return {
    async createUser(user) {
      const newUid = crypto.randomUUID()
      await knex('user').insert({ id: newUid, ...user })
      const result = await knex<AdapterUser>('user')
        .where({ id: newUid })
        .first()

      return result!
    },
    async getUser(id) {
      const result = await knex<AdapterUser>('user').where({ id }).first()

      return result ?? null
    },
    async getUserByEmail(email) {
      const result = await knex<AdapterUser>('user').where({ email }).first()

      return result ?? null
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const accountResult = await knex<AdapterAccount>('account')
        .where({ provider, providerAccountId })
        .first()

      if (!accountResult) {
        return null
      }

      const userResult = await knex<AdapterUser>('user')
        .where({ id: accountResult.userId })
        .first()

      return userResult ?? null
    },
    async updateUser(user) {
      await knex('user').where({ id: user.id }).update(user)
      const result = await knex<AdapterUser>('user')
        .where({ id: user.id })
        .first()

      return result!
    },
    async deleteUser(userId) {
      const result = await knex<AdapterUser>('user')
        .where({ id: userId })
        .first()
      await knex('user').where({ id: userId }).delete()

      return result
    },
    async linkAccount(account) {
      await knex('account').insert({ id: crypto.randomUUID(), ...account })
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await knex('account').where({ provider, providerAccountId }).delete()
    },
    async createSession(session) {
      await knex('session').insert({ id: crypto.randomUUID(), ...session })

      const result = await knex<AdapterSession>('session')
        .where({ sessionToken: session.sessionToken })
        .first()

      return result!
    },
    async getSessionAndUser(sessionToken) {
      const sessionResult = await knex<AdapterSession>('session')
        .where({ sessionToken })
        .first()
      if (!sessionResult) {
        return null
      }

      const userResult = await knex<AdapterUser>('user')
        .where({ id: sessionResult.userId })
        .first()
      if (!userResult) {
        return null
      }

      return {
        session: sessionResult!,
        user: userResult!,
      }
    },
    async updateSession({ sessionToken, expires }) {
      await knex('session').where({ sessionToken }).update({ expires })
      return await knex<AdapterSession>('session')
        .where({ sessionToken })
        .first()
    },
    async deleteSession(sessionToken) {
      await knex('session').where({ sessionToken }).delete()
    },
    async createVerificationToken(token) {
      await knex('verification_token').insert(token)
      return knex<VerificationToken>('verification_token')
        .where({ token: token.token })
        .first()
    },
    async useVerificationToken({ identifier, token }) {
      const result = await knex<VerificationToken>('verification_token')
        .where({ identifier, token })
        .first()
      await knex('verification_token').where({ identifier, token }).delete()

      return result ?? null
    },
  }
}
