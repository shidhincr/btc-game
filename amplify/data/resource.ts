import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Guess: a
    .model({
      startPrice: a.float().required(),
      direction: a.enum(['UP', 'DOWN']),
      status: a.enum(['PENDING', 'RESOLVED']),
      resolvedPrice: a.float(),
      score: a.integer(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

