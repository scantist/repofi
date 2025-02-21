import { z } from 'zod';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ApiKeyScalarFieldEnumSchema = z.enum(['key','name','userAddress','createdAt','expiredAt']);

export const UserScalarFieldEnumSchema = z.enum(['address','name','email','referralCode','role','createdAt','updatedAt','invitedBy']);

export const DaoStarScalarFieldEnumSchema = z.enum(['daoId','userAddress']);

export const DaoScalarFieldEnumSchema = z.enum(['id','name','ticker','type','description','avatar','createdAt','updatedAt','createdBy','walletAddress','tokenAddress','links','status','marketCapUsd','priceUsd']);

export const DaoTokenHolderScalarFieldEnumSchema = z.enum(['holderAddress','tokenAddress','tokenAmount']);

export const DaoInfoScalarFieldEnumSchema = z.enum(['tokenAddress','name','ticker','creator','createdAt','marketCap','totalSupply','holderCount','assetTokenAddress','tradingOnUniswap','uniswapV2Pair']);

export const ForumMessageScalarFieldEnumSchema = z.enum(['id','daoId','message','createdAt','createdBy','deletedAt','replyToMessage','replyToUser','rootMessageId']);

export const ContributionScalarFieldEnumSchema = z.enum(['id','daoId','userAddress','isValid','githubEmail','createdAt','updatedAt']);

export const ContributionHistoryScalarFieldEnumSchema = z.enum(['id','tag','value','createdAt','updatedAt','contributionId','isOnChain']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['USER','ADMIN']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const DaoTypeSchema = z.enum(['CODE','MODEL','DATASET']);

export type DaoTypeType = `${z.infer<typeof DaoTypeSchema>}`

export const DaoStatusSchema = z.enum(['INACTIVE','PRELAUNCH','LAUNCHED']);

export type DaoStatusType = `${z.infer<typeof DaoStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// API KEY SCHEMA
/////////////////////////////////////////

export const ApiKeySchema = z.object({
  key: z.string(),
  name: z.string(),
  userAddress: z.string().nullable(),
  createdAt: z.coerce.date(),
  expiredAt: z.coerce.date().nullable(),
})

export type ApiKey = z.infer<typeof ApiKeySchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  address: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  referralCode: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  invitedBy: z.string().array(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// DAO STAR SCHEMA
/////////////////////////////////////////

export const DaoStarSchema = z.object({
  daoId: z.string(),
  userAddress: z.string(),
})

export type DaoStar = z.infer<typeof DaoStarSchema>

/////////////////////////////////////////
// DAO SCHEMA
/////////////////////////////////////////

export const DaoSchema = z.object({
  type: DaoTypeSchema,
  status: DaoStatusSchema,
  id: z.string(),
  name: z.string(),
  ticker: z.string(),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.string(),
  walletAddress: z.string().nullable(),
  tokenAddress: z.string(),
  links: JsonValueSchema,
  marketCapUsd: z.instanceof(Prisma.Decimal, { message: "Field 'marketCapUsd' must be a Decimal. Location: ['Models', 'Dao']"}),
  priceUsd: z.instanceof(Prisma.Decimal, { message: "Field 'priceUsd' must be a Decimal. Location: ['Models', 'Dao']"}),
})

export type Dao = z.infer<typeof DaoSchema>

/////////////////////////////////////////
// DAO TOKEN HOLDER SCHEMA
/////////////////////////////////////////

export const DaoTokenHolderSchema = z.object({
  holderAddress: z.string(),
  tokenAddress: z.string(),
  tokenAmount: z.instanceof(Prisma.Decimal, { message: "Field 'tokenAmount' must be a Decimal. Location: ['Models', 'DaoTokenHolder']"}),
})

export type DaoTokenHolder = z.infer<typeof DaoTokenHolderSchema>

/////////////////////////////////////////
// DAO INFO SCHEMA
/////////////////////////////////////////

export const DaoInfoSchema = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint(),
  marketCap: z.instanceof(Prisma.Decimal, { message: "Field 'marketCap' must be a Decimal. Location: ['Models', 'DaoInfo']"}),
  totalSupply: z.instanceof(Prisma.Decimal, { message: "Field 'totalSupply' must be a Decimal. Location: ['Models', 'DaoInfo']"}),
  holderCount: z.number().int(),
  assetTokenAddress: z.string(),
  tradingOnUniswap: z.boolean(),
  uniswapV2Pair: z.string().nullable(),
})

export type DaoInfo = z.infer<typeof DaoInfoSchema>

/////////////////////////////////////////
// FORUM MESSAGE SCHEMA
/////////////////////////////////////////

export const ForumMessageSchema = z.object({
  id: z.string(),
  daoId: z.string(),
  message: z.string(),
  createdAt: z.coerce.date(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().nullable(),
  replyToMessage: z.string().nullable(),
  replyToUser: z.string().nullable(),
  rootMessageId: z.string().nullable(),
})

export type ForumMessage = z.infer<typeof ForumMessageSchema>

/////////////////////////////////////////
// CONTRIBUTION SCHEMA
/////////////////////////////////////////

export const ContributionSchema = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string(),
  isValid: z.boolean(),
  githubEmail: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Contribution = z.infer<typeof ContributionSchema>

/////////////////////////////////////////
// CONTRIBUTION HISTORY SCHEMA
/////////////////////////////////////////

export const ContributionHistorySchema = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.instanceof(Prisma.Decimal, { message: "Field 'value' must be a Decimal. Location: ['Models', 'ContributionHistory']"}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contributionId: z.string(),
  isOnChain: z.boolean(),
})

export type ContributionHistory = z.infer<typeof ContributionHistorySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// API KEY
//------------------------------------------------------

export const ApiKeySelectSchema: z.ZodType<Prisma.ApiKeySelect> = z.object({
  key: z.boolean().optional(),
  name: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  expiredAt: z.boolean().optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  daos: z.union([z.boolean(),z.lazy(() => DaoFindManyArgsSchema)]).optional(),
  contributions: z.union([z.boolean(),z.lazy(() => ContributionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  stars: z.boolean().optional(),
  daos: z.boolean().optional(),
  contributions: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  address: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  referralCode: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  invitedBy: z.boolean().optional(),
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  daos: z.union([z.boolean(),z.lazy(() => DaoFindManyArgsSchema)]).optional(),
  contributions: z.union([z.boolean(),z.lazy(() => ContributionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DAO STAR
//------------------------------------------------------

export const DaoStarIncludeSchema: z.ZodType<Prisma.DaoStarInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const DaoStarArgsSchema: z.ZodType<Prisma.DaoStarDefaultArgs> = z.object({
  select: z.lazy(() => DaoStarSelectSchema).optional(),
  include: z.lazy(() => DaoStarIncludeSchema).optional(),
}).strict();

export const DaoStarSelectSchema: z.ZodType<Prisma.DaoStarSelect> = z.object({
  daoId: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// DAO
//------------------------------------------------------

export const DaoIncludeSchema: z.ZodType<Prisma.DaoInclude> = z.object({
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  info: z.union([z.boolean(),z.lazy(() => DaoInfoArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => ForumMessageFindManyArgsSchema)]).optional(),
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  contributions: z.union([z.boolean(),z.lazy(() => ContributionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DaoArgsSchema: z.ZodType<Prisma.DaoDefaultArgs> = z.object({
  select: z.lazy(() => DaoSelectSchema).optional(),
  include: z.lazy(() => DaoIncludeSchema).optional(),
}).strict();

export const DaoCountOutputTypeArgsSchema: z.ZodType<Prisma.DaoCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DaoCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DaoCountOutputTypeSelectSchema: z.ZodType<Prisma.DaoCountOutputTypeSelect> = z.object({
  messages: z.boolean().optional(),
  stars: z.boolean().optional(),
  contributions: z.boolean().optional(),
}).strict();

export const DaoSelectSchema: z.ZodType<Prisma.DaoSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  ticker: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  avatar: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  walletAddress: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  links: z.boolean().optional(),
  status: z.boolean().optional(),
  marketCapUsd: z.boolean().optional(),
  priceUsd: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  info: z.union([z.boolean(),z.lazy(() => DaoInfoArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => ForumMessageFindManyArgsSchema)]).optional(),
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  contributions: z.union([z.boolean(),z.lazy(() => ContributionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DAO TOKEN HOLDER
//------------------------------------------------------

export const DaoTokenHolderIncludeSchema: z.ZodType<Prisma.DaoTokenHolderInclude> = z.object({
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoInfoArgsSchema)]).optional(),
}).strict()

export const DaoTokenHolderArgsSchema: z.ZodType<Prisma.DaoTokenHolderDefaultArgs> = z.object({
  select: z.lazy(() => DaoTokenHolderSelectSchema).optional(),
  include: z.lazy(() => DaoTokenHolderIncludeSchema).optional(),
}).strict();

export const DaoTokenHolderSelectSchema: z.ZodType<Prisma.DaoTokenHolderSelect> = z.object({
  holderAddress: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  tokenAmount: z.boolean().optional(),
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoInfoArgsSchema)]).optional(),
}).strict()

// DAO INFO
//------------------------------------------------------

export const DaoInfoIncludeSchema: z.ZodType<Prisma.DaoInfoInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  holders: z.union([z.boolean(),z.lazy(() => DaoTokenHolderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoInfoCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DaoInfoArgsSchema: z.ZodType<Prisma.DaoInfoDefaultArgs> = z.object({
  select: z.lazy(() => DaoInfoSelectSchema).optional(),
  include: z.lazy(() => DaoInfoIncludeSchema).optional(),
}).strict();

export const DaoInfoCountOutputTypeArgsSchema: z.ZodType<Prisma.DaoInfoCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DaoInfoCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DaoInfoCountOutputTypeSelectSchema: z.ZodType<Prisma.DaoInfoCountOutputTypeSelect> = z.object({
  holders: z.boolean().optional(),
}).strict();

export const DaoInfoSelectSchema: z.ZodType<Prisma.DaoInfoSelect> = z.object({
  tokenAddress: z.boolean().optional(),
  name: z.boolean().optional(),
  ticker: z.boolean().optional(),
  creator: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  marketCap: z.boolean().optional(),
  totalSupply: z.boolean().optional(),
  holderCount: z.boolean().optional(),
  assetTokenAddress: z.boolean().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  holders: z.union([z.boolean(),z.lazy(() => DaoTokenHolderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoInfoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORUM MESSAGE
//------------------------------------------------------

export const ForumMessageIncludeSchema: z.ZodType<Prisma.ForumMessageInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
}).strict()

export const ForumMessageArgsSchema: z.ZodType<Prisma.ForumMessageDefaultArgs> = z.object({
  select: z.lazy(() => ForumMessageSelectSchema).optional(),
  include: z.lazy(() => ForumMessageIncludeSchema).optional(),
}).strict();

export const ForumMessageSelectSchema: z.ZodType<Prisma.ForumMessageSelect> = z.object({
  id: z.boolean().optional(),
  daoId: z.boolean().optional(),
  message: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  deletedAt: z.boolean().optional(),
  replyToMessage: z.boolean().optional(),
  replyToUser: z.boolean().optional(),
  rootMessageId: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
}).strict()

// CONTRIBUTION
//------------------------------------------------------

export const ContributionIncludeSchema: z.ZodType<Prisma.ContributionInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => ContributionHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContributionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ContributionArgsSchema: z.ZodType<Prisma.ContributionDefaultArgs> = z.object({
  select: z.lazy(() => ContributionSelectSchema).optional(),
  include: z.lazy(() => ContributionIncludeSchema).optional(),
}).strict();

export const ContributionCountOutputTypeArgsSchema: z.ZodType<Prisma.ContributionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ContributionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ContributionCountOutputTypeSelectSchema: z.ZodType<Prisma.ContributionCountOutputTypeSelect> = z.object({
  histories: z.boolean().optional(),
}).strict();

export const ContributionSelectSchema: z.ZodType<Prisma.ContributionSelect> = z.object({
  id: z.boolean().optional(),
  daoId: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  isValid: z.boolean().optional(),
  githubEmail: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => ContributionHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContributionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTRIBUTION HISTORY
//------------------------------------------------------

export const ContributionHistoryIncludeSchema: z.ZodType<Prisma.ContributionHistoryInclude> = z.object({
  contribution: z.union([z.boolean(),z.lazy(() => ContributionArgsSchema)]).optional(),
}).strict()

export const ContributionHistoryArgsSchema: z.ZodType<Prisma.ContributionHistoryDefaultArgs> = z.object({
  select: z.lazy(() => ContributionHistorySelectSchema).optional(),
  include: z.lazy(() => ContributionHistoryIncludeSchema).optional(),
}).strict();

export const ContributionHistorySelectSchema: z.ZodType<Prisma.ContributionHistorySelect> = z.object({
  id: z.boolean().optional(),
  tag: z.boolean().optional(),
  value: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  contributionId: z.boolean().optional(),
  isOnChain: z.boolean().optional(),
  contribution: z.union([z.boolean(),z.lazy(() => ContributionArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const ApiKeyWhereInputSchema: z.ZodType<Prisma.ApiKeyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  expiredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ApiKeyOrderByWithRelationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithRelationInput> = z.object({
  key: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const ApiKeyWhereUniqueInputSchema: z.ZodType<Prisma.ApiKeyWhereUniqueInput> = z.union([
  z.object({
    key: z.string(),
    name_userAddress: z.lazy(() => ApiKeyNameUserAddressCompoundUniqueInputSchema)
  }),
  z.object({
    key: z.string(),
  }),
  z.object({
    name_userAddress: z.lazy(() => ApiKeyNameUserAddressCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  key: z.string().optional(),
  name_userAddress: z.lazy(() => ApiKeyNameUserAddressCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyWhereInputSchema),z.lazy(() => ApiKeyWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  expiredAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict());

export const ApiKeyOrderByWithAggregationInputSchema: z.ZodType<Prisma.ApiKeyOrderByWithAggregationInput> = z.object({
  key: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiredAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ApiKeyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ApiKeyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ApiKeyMinOrderByAggregateInputSchema).optional()
}).strict();

export const ApiKeyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ApiKeyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema),z.lazy(() => ApiKeyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  key: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  expiredAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  referralCode: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.lazy(() => StringNullableListFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  daos: z.lazy(() => DaoListRelationFilterSchema).optional(),
  contributions: z.lazy(() => ContributionListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  referralCode: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  stars: z.lazy(() => DaoStarOrderByRelationAggregateInputSchema).optional(),
  daos: z.lazy(() => DaoOrderByRelationAggregateInputSchema).optional(),
  contributions: z.lazy(() => ContributionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    address: z.string(),
    email: z.string(),
    referralCode: z.string()
  }),
  z.object({
    address: z.string(),
    email: z.string(),
  }),
  z.object({
    address: z.string(),
    referralCode: z.string(),
  }),
  z.object({
    address: z.string(),
  }),
  z.object({
    email: z.string(),
    referralCode: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    referralCode: z.string(),
  }),
])
.and(z.object({
  address: z.string().optional(),
  email: z.string().optional(),
  referralCode: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.lazy(() => StringNullableListFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  daos: z.lazy(() => DaoListRelationFilterSchema).optional(),
  contributions: z.lazy(() => ContributionListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  referralCode: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  referralCode: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema),z.lazy(() => UserRoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  invitedBy: z.lazy(() => StringNullableListFilterSchema).optional()
}).strict();

export const DaoStarWhereInputSchema: z.ZodType<Prisma.DaoStarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoStarWhereInputSchema),z.lazy(() => DaoStarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoStarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoStarWhereInputSchema),z.lazy(() => DaoStarWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const DaoStarOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoStarOrderByWithRelationInput> = z.object({
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const DaoStarWhereUniqueInputSchema: z.ZodType<Prisma.DaoStarWhereUniqueInput> = z.object({
  daoId_userAddress: z.lazy(() => DaoStarDaoIdUserAddressCompoundUniqueInputSchema)
})
.and(z.object({
  daoId_userAddress: z.lazy(() => DaoStarDaoIdUserAddressCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => DaoStarWhereInputSchema),z.lazy(() => DaoStarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoStarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoStarWhereInputSchema),z.lazy(() => DaoStarWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const DaoStarOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoStarOrderByWithAggregationInput> = z.object({
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DaoStarCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoStarMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoStarMinOrderByAggregateInputSchema).optional()
}).strict();

export const DaoStarScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoStarScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoStarScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoStarScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoStarScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoStarScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoStarScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const DaoWhereInputSchema: z.ZodType<Prisma.DaoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoWhereInputSchema),z.lazy(() => DaoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoWhereInputSchema),z.lazy(() => DaoWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  links: z.lazy(() => JsonFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  info: z.union([ z.lazy(() => DaoInfoScalarRelationFilterSchema),z.lazy(() => DaoInfoWhereInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageListRelationFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  contributions: z.lazy(() => ContributionListRelationFilterSchema).optional()
}).strict();

export const DaoOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  info: z.lazy(() => DaoInfoOrderByWithRelationInputSchema).optional(),
  messages: z.lazy(() => ForumMessageOrderByRelationAggregateInputSchema).optional(),
  stars: z.lazy(() => DaoStarOrderByRelationAggregateInputSchema).optional(),
  contributions: z.lazy(() => ContributionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DaoWhereUniqueInputSchema: z.ZodType<Prisma.DaoWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string()
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    id: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
  }),
  z.object({
    name: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    name: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    name: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    ticker: z.string(),
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    ticker: z.string(),
    walletAddress: z.string(),
  }),
  z.object({
    ticker: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    ticker: z.string(),
  }),
  z.object({
    walletAddress: z.string(),
    tokenAddress: z.string(),
  }),
  z.object({
    walletAddress: z.string(),
  }),
  z.object({
    tokenAddress: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  ticker: z.string().optional(),
  walletAddress: z.string().optional(),
  tokenAddress: z.string().optional(),
  AND: z.union([ z.lazy(() => DaoWhereInputSchema),z.lazy(() => DaoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoWhereInputSchema),z.lazy(() => DaoWhereInputSchema).array() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  links: z.lazy(() => JsonFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  info: z.union([ z.lazy(() => DaoInfoScalarRelationFilterSchema),z.lazy(() => DaoInfoWhereInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageListRelationFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  contributions: z.lazy(() => ContributionListRelationFilterSchema).optional()
}).strict());

export const DaoOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DaoCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DaoAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DaoSumOrderByAggregateInputSchema).optional()
}).strict();

export const DaoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeWithAggregatesFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  links: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusWithAggregatesFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoTokenHolderWhereInputSchema: z.ZodType<Prisma.DaoTokenHolderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  holderAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAmount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoInfoScalarRelationFilterSchema),z.lazy(() => DaoInfoWhereInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoTokenHolderOrderByWithRelationInput> = z.object({
  holderAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAmount: z.lazy(() => SortOrderSchema).optional(),
  tokenInfo: z.lazy(() => DaoInfoOrderByWithRelationInputSchema).optional()
}).strict();

export const DaoTokenHolderWhereUniqueInputSchema: z.ZodType<Prisma.DaoTokenHolderWhereUniqueInput> = z.object({
  holderAddress_tokenAddress: z.lazy(() => DaoTokenHolderHolderAddressTokenAddressCompoundUniqueInputSchema)
})
.and(z.object({
  holderAddress_tokenAddress: z.lazy(() => DaoTokenHolderHolderAddressTokenAddressCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  holderAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAmount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoInfoScalarRelationFilterSchema),z.lazy(() => DaoInfoWhereInputSchema) ]).optional(),
}).strict());

export const DaoTokenHolderOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoTokenHolderOrderByWithAggregationInput> = z.object({
  holderAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAmount: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DaoTokenHolderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DaoTokenHolderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoTokenHolderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoTokenHolderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DaoTokenHolderSumOrderByAggregateInputSchema).optional()
}).strict();

export const DaoTokenHolderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoTokenHolderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenHolderScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoTokenHolderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoTokenHolderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  holderAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenAmount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoInfoWhereInputSchema: z.ZodType<Prisma.DaoInfoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoInfoWhereInputSchema),z.lazy(() => DaoInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoInfoWhereInputSchema),z.lazy(() => DaoInfoWhereInputSchema).array() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradingOnUniswap: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  uniswapV2Pair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoNullableScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderListRelationFilterSchema).optional()
}).strict();

export const DaoInfoOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoInfoOrderByWithRelationInput> = z.object({
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingOnUniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV2Pair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DaoInfoWhereUniqueInputSchema: z.ZodType<Prisma.DaoInfoWhereUniqueInput> = z.object({
  tokenAddress: z.string()
})
.and(z.object({
  tokenAddress: z.string().optional(),
  AND: z.union([ z.lazy(() => DaoInfoWhereInputSchema),z.lazy(() => DaoInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoInfoWhereInputSchema),z.lazy(() => DaoInfoWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradingOnUniswap: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  uniswapV2Pair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoNullableScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderListRelationFilterSchema).optional()
}).strict());

export const DaoInfoOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoInfoOrderByWithAggregationInput> = z.object({
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingOnUniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV2Pair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DaoInfoCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DaoInfoAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoInfoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoInfoMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DaoInfoSumOrderByAggregateInputSchema).optional()
}).strict();

export const DaoInfoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoInfoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoInfoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tradingOnUniswap: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  uniswapV2Pair: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ForumMessageWhereInputSchema: z.ZodType<Prisma.ForumMessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ForumMessageWhereInputSchema),z.lazy(() => ForumMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ForumMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ForumMessageWhereInputSchema),z.lazy(() => ForumMessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  replyToMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  replyToUser: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rootMessageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
}).strict();

export const ForumMessageOrderByWithRelationInputSchema: z.ZodType<Prisma.ForumMessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  replyToMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  replyToUser: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rootMessageId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional()
}).strict();

export const ForumMessageWhereUniqueInputSchema: z.ZodType<Prisma.ForumMessageWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ForumMessageWhereInputSchema),z.lazy(() => ForumMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ForumMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ForumMessageWhereInputSchema),z.lazy(() => ForumMessageWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  replyToMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  replyToUser: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rootMessageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
}).strict());

export const ForumMessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.ForumMessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  replyToMessage: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  replyToUser: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rootMessageId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ForumMessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ForumMessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ForumMessageMinOrderByAggregateInputSchema).optional()
}).strict();

export const ForumMessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ForumMessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ForumMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ForumMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ForumMessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ForumMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ForumMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  replyToMessage: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  replyToUser: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  rootMessageId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ContributionWhereInputSchema: z.ZodType<Prisma.ContributionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionWhereInputSchema),z.lazy(() => ContributionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionWhereInputSchema),z.lazy(() => ContributionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  githubEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => ContributionHistoryListRelationFilterSchema).optional()
}).strict();

export const ContributionOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  githubEmail: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ContributionWhereUniqueInputSchema: z.ZodType<Prisma.ContributionWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContributionWhereInputSchema),z.lazy(() => ContributionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionWhereInputSchema),z.lazy(() => ContributionWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  githubEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => ContributionHistoryListRelationFilterSchema).optional()
}).strict());

export const ContributionOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  githubEmail: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributionMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContributionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  githubEmail: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ContributionHistoryWhereInputSchema: z.ZodType<Prisma.ContributionHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionHistoryWhereInputSchema),z.lazy(() => ContributionHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionHistoryWhereInputSchema),z.lazy(() => ContributionHistoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isOnChain: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  contribution: z.union([ z.lazy(() => ContributionScalarRelationFilterSchema),z.lazy(() => ContributionWhereInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributionHistoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributionId: z.lazy(() => SortOrderSchema).optional(),
  isOnChain: z.lazy(() => SortOrderSchema).optional(),
  contribution: z.lazy(() => ContributionOrderByWithRelationInputSchema).optional()
}).strict();

export const ContributionHistoryWhereUniqueInputSchema: z.ZodType<Prisma.ContributionHistoryWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContributionHistoryWhereInputSchema),z.lazy(() => ContributionHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionHistoryWhereInputSchema),z.lazy(() => ContributionHistoryWhereInputSchema).array() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isOnChain: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  contribution: z.union([ z.lazy(() => ContributionScalarRelationFilterSchema),z.lazy(() => ContributionWhereInputSchema) ]).optional(),
}).strict());

export const ContributionHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributionHistoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributionId: z.lazy(() => SortOrderSchema).optional(),
  isOnChain: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributionHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContributionHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributionHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributionHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContributionHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const ContributionHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributionHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  contributionId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isOnChain: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ApiKeyCreateInputSchema: z.ZodType<Prisma.ApiKeyCreateInput> = z.object({
  key: z.string(),
  name: z.string(),
  userAddress: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  expiredAt: z.coerce.date().optional().nullable()
}).strict();

export const ApiKeyUncheckedCreateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedCreateInput> = z.object({
  key: z.string(),
  name: z.string(),
  userAddress: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  expiredAt: z.coerce.date().optional().nullable()
}).strict();

export const ApiKeyUpdateInputSchema: z.ZodType<Prisma.ApiKeyUpdateInput> = z.object({
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ApiKeyUncheckedUpdateInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateInput> = z.object({
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ApiKeyCreateManyInputSchema: z.ZodType<Prisma.ApiKeyCreateManyInput> = z.object({
  key: z.string(),
  name: z.string(),
  userAddress: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  expiredAt: z.coerce.date().optional().nullable()
}).strict();

export const ApiKeyUpdateManyMutationInputSchema: z.ZodType<Prisma.ApiKeyUpdateManyMutationInput> = z.object({
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ApiKeyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ApiKeyUncheckedUpdateManyInput> = z.object({
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiredAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutUserInputSchema).optional(),
  daos: z.lazy(() => DaoCreateNestedManyWithoutCreatorInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  daos: z.lazy(() => DaoUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutUserNestedInputSchema).optional(),
  daos: z.lazy(() => DaoUpdateManyWithoutCreatorNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  daos: z.lazy(() => DaoUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
}).strict();

export const DaoStarCreateInputSchema: z.ZodType<Prisma.DaoStarCreateInput> = z.object({
  dao: z.lazy(() => DaoCreateNestedOneWithoutStarsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutStarsInputSchema)
}).strict();

export const DaoStarUncheckedCreateInputSchema: z.ZodType<Prisma.DaoStarUncheckedCreateInput> = z.object({
  daoId: z.string(),
  userAddress: z.string()
}).strict();

export const DaoStarUpdateInputSchema: z.ZodType<Prisma.DaoStarUpdateInput> = z.object({
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutStarsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutStarsNestedInputSchema).optional()
}).strict();

export const DaoStarUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateInput> = z.object({
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoStarCreateManyInputSchema: z.ZodType<Prisma.DaoStarCreateManyInput> = z.object({
  daoId: z.string(),
  userAddress: z.string()
}).strict();

export const DaoStarUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoStarUpdateManyMutationInput> = z.object({
}).strict();

export const DaoStarUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateManyInput> = z.object({
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoCreateInputSchema: z.ZodType<Prisma.DaoCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  info: z.lazy(() => DaoInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateInputSchema: z.ZodType<Prisma.DaoUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUpdateInputSchema: z.ZodType<Prisma.DaoUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  info: z.lazy(() => DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoCreateManyInputSchema: z.ZodType<Prisma.DaoCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const DaoUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateInput> = z.object({
  holderAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  tokenInfo: z.lazy(() => DaoInfoCreateNestedOneWithoutHoldersInputSchema)
}).strict();

export const DaoTokenHolderUncheckedCreateInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateInput> = z.object({
  holderAddress: z.string(),
  tokenAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  tokenInfo: z.lazy(() => DaoInfoUpdateOneRequiredWithoutHoldersNestedInputSchema).optional()
}).strict();

export const DaoTokenHolderUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateManyInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyInput> = z.object({
  holderAddress: z.string(),
  tokenAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyMutationInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateManyInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoInfoCreateInputSchema: z.ZodType<Prisma.DaoInfoCreateInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutInfoInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoInfoUncheckedCreateInputSchema: z.ZodType<Prisma.DaoInfoUncheckedCreateInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoUncheckedCreateNestedOneWithoutInfoInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoInfoUpdateInputSchema: z.ZodType<Prisma.DaoInfoUpdateInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneWithoutInfoNestedInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoInfoUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoInfoUncheckedUpdateInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUncheckedUpdateOneWithoutInfoNestedInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoInfoCreateManyInputSchema: z.ZodType<Prisma.DaoInfoCreateManyInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable()
}).strict();

export const DaoInfoUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoInfoUpdateManyMutationInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DaoInfoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoInfoUncheckedUpdateManyInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ForumMessageCreateInputSchema: z.ZodType<Prisma.ForumMessageCreateInput> = z.object({
  id: z.string().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutMessagesInputSchema)
}).strict();

export const ForumMessageUncheckedCreateInputSchema: z.ZodType<Prisma.ForumMessageUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable()
}).strict();

export const ForumMessageUpdateInputSchema: z.ZodType<Prisma.ForumMessageUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutMessagesNestedInputSchema).optional()
}).strict();

export const ForumMessageUncheckedUpdateInputSchema: z.ZodType<Prisma.ForumMessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ForumMessageCreateManyInputSchema: z.ZodType<Prisma.ForumMessageCreateManyInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable()
}).strict();

export const ForumMessageUpdateManyMutationInputSchema: z.ZodType<Prisma.ForumMessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ForumMessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ForumMessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContributionCreateInputSchema: z.ZodType<Prisma.ContributionCreateInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionUncheckedCreateInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionUpdateInputSchema: z.ZodType<Prisma.ContributionUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionCreateManyInputSchema: z.ZodType<Prisma.ContributionCreateManyInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ContributionUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryCreateInputSchema: z.ZodType<Prisma.ContributionHistoryCreateInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isOnChain: z.boolean().optional(),
  contribution: z.lazy(() => ContributionCreateNestedOneWithoutHistoriesInputSchema)
}).strict();

export const ContributionHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedCreateInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  contributionId: z.string(),
  isOnChain: z.boolean().optional()
}).strict();

export const ContributionHistoryUpdateInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  contribution: z.lazy(() => ContributionUpdateOneRequiredWithoutHistoriesNestedInputSchema).optional()
}).strict();

export const ContributionHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contributionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryCreateManyInputSchema: z.ZodType<Prisma.ContributionHistoryCreateManyInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  contributionId: z.string(),
  isOnChain: z.boolean().optional()
}).strict();

export const ContributionHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contributionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ApiKeyNameUserAddressCompoundUniqueInputSchema: z.ZodType<Prisma.ApiKeyNameUserAddressCompoundUniqueInput> = z.object({
  name: z.string(),
  userAddress: z.string()
}).strict();

export const ApiKeyCountOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyCountOrderByAggregateInput> = z.object({
  key: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiredAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMaxOrderByAggregateInput> = z.object({
  key: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiredAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ApiKeyMinOrderByAggregateInputSchema: z.ZodType<Prisma.ApiKeyMinOrderByAggregateInput> = z.object({
  key: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiredAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const DaoStarListRelationFilterSchema: z.ZodType<Prisma.DaoStarListRelationFilter> = z.object({
  every: z.lazy(() => DaoStarWhereInputSchema).optional(),
  some: z.lazy(() => DaoStarWhereInputSchema).optional(),
  none: z.lazy(() => DaoStarWhereInputSchema).optional()
}).strict();

export const DaoListRelationFilterSchema: z.ZodType<Prisma.DaoListRelationFilter> = z.object({
  every: z.lazy(() => DaoWhereInputSchema).optional(),
  some: z.lazy(() => DaoWhereInputSchema).optional(),
  none: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const ContributionListRelationFilterSchema: z.ZodType<Prisma.ContributionListRelationFilter> = z.object({
  every: z.lazy(() => ContributionWhereInputSchema).optional(),
  some: z.lazy(() => ContributionWhereInputSchema).optional(),
  none: z.lazy(() => ContributionWhereInputSchema).optional()
}).strict();

export const DaoStarOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoStarOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContributionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  referralCode: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  invitedBy: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  referralCode: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  referralCode: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const DaoScalarRelationFilterSchema: z.ZodType<Prisma.DaoScalarRelationFilter> = z.object({
  is: z.lazy(() => DaoWhereInputSchema).optional(),
  isNot: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const DaoStarDaoIdUserAddressCompoundUniqueInputSchema: z.ZodType<Prisma.DaoStarDaoIdUserAddressCompoundUniqueInput> = z.object({
  daoId: z.string(),
  userAddress: z.string()
}).strict();

export const DaoStarCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoStarCountOrderByAggregateInput> = z.object({
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoStarMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoStarMaxOrderByAggregateInput> = z.object({
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoStarMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoStarMinOrderByAggregateInput> = z.object({
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDaoTypeFilterSchema: z.ZodType<Prisma.EnumDaoTypeFilter> = z.object({
  equals: z.lazy(() => DaoTypeSchema).optional(),
  in: z.lazy(() => DaoTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => NestedEnumDaoTypeFilterSchema) ]).optional(),
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const EnumDaoStatusFilterSchema: z.ZodType<Prisma.EnumDaoStatusFilter> = z.object({
  equals: z.lazy(() => DaoStatusSchema).optional(),
  in: z.lazy(() => DaoStatusSchema).array().optional(),
  notIn: z.lazy(() => DaoStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => NestedEnumDaoStatusFilterSchema) ]).optional(),
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const DaoInfoScalarRelationFilterSchema: z.ZodType<Prisma.DaoInfoScalarRelationFilter> = z.object({
  is: z.lazy(() => DaoInfoWhereInputSchema).optional(),
  isNot: z.lazy(() => DaoInfoWhereInputSchema).optional()
}).strict();

export const ForumMessageListRelationFilterSchema: z.ZodType<Prisma.ForumMessageListRelationFilter> = z.object({
  every: z.lazy(() => ForumMessageWhereInputSchema).optional(),
  some: z.lazy(() => ForumMessageWhereInputSchema).optional(),
  none: z.lazy(() => ForumMessageWhereInputSchema).optional()
}).strict();

export const ForumMessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ForumMessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoAvgOrderByAggregateInput> = z.object({
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  walletAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoSumOrderByAggregateInput> = z.object({
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumDaoTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDaoTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoTypeSchema).optional(),
  in: z.lazy(() => DaoTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => NestedEnumDaoTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoTypeFilterSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const EnumDaoStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDaoStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoStatusSchema).optional(),
  in: z.lazy(() => DaoStatusSchema).array().optional(),
  notIn: z.lazy(() => DaoStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => NestedEnumDaoStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoStatusFilterSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const DaoTokenHolderHolderAddressTokenAddressCompoundUniqueInputSchema: z.ZodType<Prisma.DaoTokenHolderHolderAddressTokenAddressCompoundUniqueInput> = z.object({
  holderAddress: z.string(),
  tokenAddress: z.string()
}).strict();

export const DaoTokenHolderCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderCountOrderByAggregateInput> = z.object({
  holderAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderAvgOrderByAggregateInput> = z.object({
  tokenAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderMaxOrderByAggregateInput> = z.object({
  holderAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderMinOrderByAggregateInput> = z.object({
  holderAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderSumOrderByAggregateInput> = z.object({
  tokenAmount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntFilterSchema: z.ZodType<Prisma.BigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DaoNullableScalarRelationFilterSchema: z.ZodType<Prisma.DaoNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => DaoWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DaoWhereInputSchema).optional().nullable()
}).strict();

export const DaoTokenHolderListRelationFilterSchema: z.ZodType<Prisma.DaoTokenHolderListRelationFilter> = z.object({
  every: z.lazy(() => DaoTokenHolderWhereInputSchema).optional(),
  some: z.lazy(() => DaoTokenHolderWhereInputSchema).optional(),
  none: z.lazy(() => DaoTokenHolderWhereInputSchema).optional()
}).strict();

export const DaoTokenHolderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoInfoCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoInfoCountOrderByAggregateInput> = z.object({
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingOnUniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV2Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoInfoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoInfoAvgOrderByAggregateInput> = z.object({
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoInfoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoInfoMaxOrderByAggregateInput> = z.object({
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingOnUniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV2Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoInfoMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoInfoMinOrderByAggregateInput> = z.object({
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingOnUniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV2Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoInfoSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoInfoSumOrderByAggregateInput> = z.object({
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const ForumMessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.ForumMessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  replyToMessage: z.lazy(() => SortOrderSchema).optional(),
  replyToUser: z.lazy(() => SortOrderSchema).optional(),
  rootMessageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ForumMessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ForumMessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  replyToMessage: z.lazy(() => SortOrderSchema).optional(),
  replyToUser: z.lazy(() => SortOrderSchema).optional(),
  rootMessageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ForumMessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.ForumMessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  deletedAt: z.lazy(() => SortOrderSchema).optional(),
  replyToMessage: z.lazy(() => SortOrderSchema).optional(),
  replyToUser: z.lazy(() => SortOrderSchema).optional(),
  rootMessageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const ContributionHistoryListRelationFilterSchema: z.ZodType<Prisma.ContributionHistoryListRelationFilter> = z.object({
  every: z.lazy(() => ContributionHistoryWhereInputSchema).optional(),
  some: z.lazy(() => ContributionHistoryWhereInputSchema).optional(),
  none: z.lazy(() => ContributionHistoryWhereInputSchema).optional()
}).strict();

export const ContributionHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContributionHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  githubEmail: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  githubEmail: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  githubEmail: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionScalarRelationFilterSchema: z.ZodType<Prisma.ContributionScalarRelationFilter> = z.object({
  is: z.lazy(() => ContributionWhereInputSchema).optional(),
  isNot: z.lazy(() => ContributionWhereInputSchema).optional()
}).strict();

export const ContributionHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionHistoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributionId: z.lazy(() => SortOrderSchema).optional(),
  isOnChain: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionHistoryAvgOrderByAggregateInput> = z.object({
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionHistoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributionId: z.lazy(() => SortOrderSchema).optional(),
  isOnChain: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionHistoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributionId: z.lazy(() => SortOrderSchema).optional(),
  isOnChain: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionHistorySumOrderByAggregateInput> = z.object({
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const UserCreateinvitedByInputSchema: z.ZodType<Prisma.UserCreateinvitedByInput> = z.object({
  set: z.string().array()
}).strict();

export const DaoStarCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DaoStarCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarCreateWithoutUserInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.DaoCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoCreateWithoutCreatorInputSchema).array(),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContributionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionCreateWithoutUserInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoStarUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarCreateWithoutUserInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoCreateWithoutCreatorInputSchema).array(),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionCreateWithoutUserInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => UserRoleSchema).optional()
}).strict();

export const UserUpdateinvitedByInputSchema: z.ZodType<Prisma.UserUpdateinvitedByInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const DaoStarUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DaoStarUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarCreateWithoutUserInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoStarUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DaoStarUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.DaoUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoCreateWithoutCreatorInputSchema).array(),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => DaoUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => DaoUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => DaoUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoScalarWhereInputSchema),z.lazy(() => DaoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContributionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionCreateWithoutUserInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContributionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoStarUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarCreateWithoutUserInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoStarUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => DaoStarUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoCreateWithoutCreatorInputSchema).array(),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => DaoCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => DaoUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoWhereUniqueInputSchema),z.lazy(() => DaoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => DaoUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => DaoUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoScalarWhereInputSchema),z.lazy(() => DaoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionCreateWithoutUserInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContributionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutStarsInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutStarsInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutStarsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutStarsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutStarsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutStarsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutStarsInputSchema),z.lazy(() => UserUncheckedCreateWithoutStarsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStarsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DaoUpdateOneRequiredWithoutStarsNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutStarsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutStarsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutStarsInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutStarsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutStarsInputSchema),z.lazy(() => DaoUpdateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutStarsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutStarsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutStarsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutStarsInputSchema),z.lazy(() => UserUncheckedCreateWithoutStarsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutStarsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutStarsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutStarsInputSchema),z.lazy(() => UserUpdateWithoutStarsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutStarsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutDaosInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDaosInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDaosInputSchema),z.lazy(() => UserUncheckedCreateWithoutDaosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDaosInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const DaoInfoCreateNestedOneWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoCreateNestedOneWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutDaoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoInfoCreateOrConnectWithoutDaoInputSchema).optional(),
  connect: z.lazy(() => DaoInfoWhereUniqueInputSchema).optional()
}).strict();

export const ForumMessageCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateWithoutDaoInputSchema).array(),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ForumMessageCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoStarCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributionCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributionCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateWithoutDaoInputSchema).array(),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ForumMessageCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributionUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumDaoTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoTypeSchema).optional()
}).strict();

export const EnumDaoStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoStatusSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const UserUpdateOneRequiredWithoutDaosNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDaosNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutDaosInputSchema),z.lazy(() => UserUncheckedCreateWithoutDaosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDaosInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutDaosInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutDaosInputSchema),z.lazy(() => UserUpdateWithoutDaosInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDaosInputSchema) ]).optional(),
}).strict();

export const DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoInfoUpdateOneRequiredWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutDaoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoInfoCreateOrConnectWithoutDaoInputSchema).optional(),
  upsert: z.lazy(() => DaoInfoUpsertWithoutDaoInputSchema).optional(),
  connect: z.lazy(() => DaoInfoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoInfoUpdateToOneWithWhereWithoutDaoInputSchema),z.lazy(() => DaoInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutDaoInputSchema) ]).optional(),
}).strict();

export const ForumMessageUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ForumMessageUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateWithoutDaoInputSchema).array(),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ForumMessageUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ForumMessageUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ForumMessageCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ForumMessageUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ForumMessageUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ForumMessageUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ForumMessageUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ForumMessageScalarWhereInputSchema),z.lazy(() => ForumMessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoStarUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoStarUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoStarUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => DaoStarUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ContributionUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributionUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributionUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ContributionUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ForumMessageUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateWithoutDaoInputSchema).array(),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ForumMessageCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ForumMessageUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ForumMessageUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ForumMessageCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ForumMessageWhereUniqueInputSchema),z.lazy(() => ForumMessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ForumMessageUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ForumMessageUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ForumMessageUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ForumMessageUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ForumMessageScalarWhereInputSchema),z.lazy(() => ForumMessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoStarCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoStarUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoStarCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoStarWhereUniqueInputSchema),z.lazy(() => DaoStarWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoStarUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoStarUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => DaoStarUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributionCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributionUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionWhereUniqueInputSchema),z.lazy(() => ContributionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributionUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ContributionUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoInfoCreateNestedOneWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoCreateNestedOneWithoutHoldersInput> = z.object({
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutHoldersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoInfoCreateOrConnectWithoutHoldersInputSchema).optional(),
  connect: z.lazy(() => DaoInfoWhereUniqueInputSchema).optional()
}).strict();

export const DaoInfoUpdateOneRequiredWithoutHoldersNestedInputSchema: z.ZodType<Prisma.DaoInfoUpdateOneRequiredWithoutHoldersNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutHoldersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoInfoCreateOrConnectWithoutHoldersInputSchema).optional(),
  upsert: z.lazy(() => DaoInfoUpsertWithoutHoldersInputSchema).optional(),
  connect: z.lazy(() => DaoInfoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoInfoUpdateToOneWithWhereWithoutHoldersInputSchema),z.lazy(() => DaoInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutHoldersInputSchema) ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutInfoInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutInfoInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateNestedManyWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUncheckedCreateNestedOneWithoutInfoInputSchema: z.ZodType<Prisma.DaoUncheckedCreateNestedOneWithoutInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutInfoInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DaoUpdateOneWithoutInfoNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneWithoutInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutInfoInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutInfoInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutInfoInputSchema),z.lazy(() => DaoUpdateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutInfoInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyWithoutTokenInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoTokenHolderScalarWhereInputSchema),z.lazy(() => DaoTokenHolderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoUncheckedUpdateOneWithoutInfoNestedInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateOneWithoutInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutInfoInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutInfoInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutInfoInputSchema),z.lazy(() => DaoUpdateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutInfoInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoNestedInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoTokenHolderScalarWhereInputSchema),z.lazy(() => DaoTokenHolderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutMessagesInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutMessagesInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const DaoUpdateOneRequiredWithoutMessagesNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedCreateWithoutMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutMessagesInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutMessagesInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutMessagesInputSchema),z.lazy(() => DaoUpdateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutMessagesInputSchema) ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutContributionsInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutContributionsInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContributionsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutContributionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutContributionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContributionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ContributionHistoryCreateNestedManyWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryCreateNestedManyWithoutContributionInput> = z.object({
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema).array(),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionHistoryCreateManyContributionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributionHistoryUncheckedCreateNestedManyWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedCreateNestedManyWithoutContributionInput> = z.object({
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema).array(),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionHistoryCreateManyContributionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUpdateOneRequiredWithoutContributionsNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutContributionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContributionsInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutContributionsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutContributionsInputSchema),z.lazy(() => DaoUpdateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributionsInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneWithoutContributionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutContributionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContributionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutContributionsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutContributionsInputSchema),z.lazy(() => UserUpdateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContributionsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryUpdateManyWithoutContributionNestedInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateManyWithoutContributionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema).array(),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionHistoryUpsertWithWhereUniqueWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpsertWithWhereUniqueWithoutContributionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionHistoryCreateManyContributionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionHistoryUpdateWithWhereUniqueWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpdateWithWhereUniqueWithoutContributionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionHistoryUpdateManyWithWhereWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpdateManyWithWhereWithoutContributionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionHistoryScalarWhereInputSchema),z.lazy(() => ContributionHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionHistoryUncheckedUpdateManyWithoutContributionNestedInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedUpdateManyWithoutContributionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema).array(),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema),z.lazy(() => ContributionHistoryCreateOrConnectWithoutContributionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributionHistoryUpsertWithWhereUniqueWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpsertWithWhereUniqueWithoutContributionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributionHistoryCreateManyContributionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributionHistoryWhereUniqueInputSchema),z.lazy(() => ContributionHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributionHistoryUpdateWithWhereUniqueWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpdateWithWhereUniqueWithoutContributionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributionHistoryUpdateManyWithWhereWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUpdateManyWithWhereWithoutContributionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributionHistoryScalarWhereInputSchema),z.lazy(() => ContributionHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributionCreateNestedOneWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionCreateNestedOneWithoutHistoriesInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContributionCreateOrConnectWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => ContributionWhereUniqueInputSchema).optional()
}).strict();

export const ContributionUpdateOneRequiredWithoutHistoriesNestedInputSchema: z.ZodType<Prisma.ContributionUpdateOneRequiredWithoutHistoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributionCreateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContributionCreateOrConnectWithoutHistoriesInputSchema).optional(),
  upsert: z.lazy(() => ContributionUpsertWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => ContributionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContributionUpdateToOneWithWhereWithoutHistoriesInputSchema),z.lazy(() => ContributionUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutHistoriesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
}).strict();

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional()
}).strict();

export const NestedEnumDaoTypeFilterSchema: z.ZodType<Prisma.NestedEnumDaoTypeFilter> = z.object({
  equals: z.lazy(() => DaoTypeSchema).optional(),
  in: z.lazy(() => DaoTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => NestedEnumDaoTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDaoStatusFilterSchema: z.ZodType<Prisma.NestedEnumDaoStatusFilter> = z.object({
  equals: z.lazy(() => DaoStatusSchema).optional(),
  in: z.lazy(() => DaoStatusSchema).array().optional(),
  notIn: z.lazy(() => DaoStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => NestedEnumDaoStatusFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDaoTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDaoTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoTypeSchema).optional(),
  in: z.lazy(() => DaoTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => NestedEnumDaoTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoTypeFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumDaoStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDaoStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoStatusSchema).optional(),
  in: z.lazy(() => DaoStatusSchema).array().optional(),
  notIn: z.lazy(() => DaoStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => NestedEnumDaoStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoStatusFilterSchema).optional()
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const NestedBigIntFilterSchema: z.ZodType<Prisma.NestedBigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBigIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DaoStarCreateWithoutUserInputSchema: z.ZodType<Prisma.DaoStarCreateWithoutUserInput> = z.object({
  dao: z.lazy(() => DaoCreateNestedOneWithoutStarsInputSchema)
}).strict();

export const DaoStarUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUncheckedCreateWithoutUserInput> = z.object({
  daoId: z.string()
}).strict();

export const DaoStarCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DaoStarCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DaoStarCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.DaoStarCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoStarCreateManyUserInputSchema),z.lazy(() => DaoStarCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoCreateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoCreateWithoutCreatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  info: z.lazy(() => DaoInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const DaoCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.DaoCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoCreateManyCreatorInputSchema),z.lazy(() => DaoCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContributionCreateWithoutUserInputSchema: z.ZodType<Prisma.ContributionCreateWithoutUserInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributionsInputSchema),
  histories: z.lazy(() => ContributionHistoryCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ContributionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContributionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ContributionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributionCreateManyUserInputSchema),z.lazy(() => ContributionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoStarUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DaoStarUpdateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => DaoStarCreateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const DaoStarUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DaoStarUpdateWithoutUserInputSchema),z.lazy(() => DaoStarUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const DaoStarUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => DaoStarScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DaoStarUpdateManyMutationInputSchema),z.lazy(() => DaoStarUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const DaoStarScalarWhereInputSchema: z.ZodType<Prisma.DaoStarScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoStarScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoStarScalarWhereInputSchema),z.lazy(() => DaoStarScalarWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const DaoUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DaoUpdateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const DaoUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DaoUpdateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const DaoUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => DaoScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DaoUpdateManyMutationInputSchema),z.lazy(() => DaoUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const DaoScalarWhereInputSchema: z.ZodType<Prisma.DaoScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoScalarWhereInputSchema),z.lazy(() => DaoScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoScalarWhereInputSchema),z.lazy(() => DaoScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  walletAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  links: z.lazy(() => JsonFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const ContributionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContributionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributionUpdateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ContributionCreateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContributionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContributionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributionUpdateWithoutUserInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ContributionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ContributionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ContributionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributionUpdateManyMutationInputSchema),z.lazy(() => ContributionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ContributionScalarWhereInputSchema: z.ZodType<Prisma.ContributionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionScalarWhereInputSchema),z.lazy(() => ContributionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  githubEmail: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DaoCreateWithoutStarsInputSchema: z.ZodType<Prisma.DaoCreateWithoutStarsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  info: z.lazy(() => DaoInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutStarsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutStarsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutStarsInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutStarsInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutStarsInputSchema) ]),
}).strict();

export const UserCreateWithoutStarsInputSchema: z.ZodType<Prisma.UserCreateWithoutStarsInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  daos: z.lazy(() => DaoCreateNestedManyWithoutCreatorInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutStarsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutStarsInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  daos: z.lazy(() => DaoUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutStarsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutStarsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutStarsInputSchema),z.lazy(() => UserUncheckedCreateWithoutStarsInputSchema) ]),
}).strict();

export const DaoUpsertWithoutStarsInputSchema: z.ZodType<Prisma.DaoUpsertWithoutStarsInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutStarsInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutStarsInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutStarsInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutStarsInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutStarsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutStarsInputSchema) ]),
}).strict();

export const DaoUpdateWithoutStarsInputSchema: z.ZodType<Prisma.DaoUpdateWithoutStarsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  info: z.lazy(() => DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutStarsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutStarsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutStarsInputSchema: z.ZodType<Prisma.UserUpsertWithoutStarsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutStarsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutStarsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutStarsInputSchema),z.lazy(() => UserUncheckedCreateWithoutStarsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutStarsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutStarsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutStarsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutStarsInputSchema) ]),
}).strict();

export const UserUpdateWithoutStarsInputSchema: z.ZodType<Prisma.UserUpdateWithoutStarsInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  daos: z.lazy(() => DaoUpdateManyWithoutCreatorNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutStarsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutStarsInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  daos: z.lazy(() => DaoUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutDaosInputSchema: z.ZodType<Prisma.UserCreateWithoutDaosInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutUserInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutDaosInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDaosInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDaosInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDaosInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDaosInputSchema),z.lazy(() => UserUncheckedCreateWithoutDaosInputSchema) ]),
}).strict();

export const DaoInfoCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoCreateWithoutDaoInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoInfoUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoUncheckedCreateWithoutDaoInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoInfoCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoInfoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ForumMessageCreateWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable()
}).strict();

export const ForumMessageUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUncheckedCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable()
}).strict();

export const ForumMessageCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => ForumMessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ForumMessageCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.ForumMessageCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ForumMessageCreateManyDaoInputSchema),z.lazy(() => ForumMessageCreateManyDaoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoStarCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarCreateWithoutDaoInput> = z.object({
  user: z.lazy(() => UserCreateNestedOneWithoutStarsInputSchema)
}).strict();

export const DaoStarUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUncheckedCreateWithoutDaoInput> = z.object({
  userAddress: z.string()
}).strict();

export const DaoStarCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const DaoStarCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.DaoStarCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoStarCreateManyDaoInputSchema),z.lazy(() => DaoStarCreateManyDaoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContributionCreateWithoutDaoInputSchema: z.ZodType<Prisma.ContributionCreateWithoutDaoInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateWithoutDaoInput> = z.object({
  id: z.string(),
  userAddress: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedCreateNestedManyWithoutContributionInputSchema).optional()
}).strict();

export const ContributionCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.ContributionCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ContributionCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.ContributionCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributionCreateManyDaoInputSchema),z.lazy(() => ContributionCreateManyDaoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutDaosInputSchema: z.ZodType<Prisma.UserUpsertWithoutDaosInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutDaosInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDaosInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutDaosInputSchema),z.lazy(() => UserUncheckedCreateWithoutDaosInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutDaosInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDaosInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutDaosInputSchema),z.lazy(() => UserUncheckedUpdateWithoutDaosInputSchema) ]),
}).strict();

export const UserUpdateWithoutDaosInputSchema: z.ZodType<Prisma.UserUpdateWithoutDaosInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutUserNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutDaosInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDaosInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DaoInfoUpsertWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoUpsertWithoutDaoInput> = z.object({
  update: z.union([ z.lazy(() => DaoInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutDaoInputSchema) ]),
  where: z.lazy(() => DaoInfoWhereInputSchema).optional()
}).strict();

export const DaoInfoUpdateToOneWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoUpdateToOneWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoInfoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const DaoInfoUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoUpdateWithoutDaoInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoInfoUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoInfoUncheckedUpdateWithoutDaoInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const ForumMessageUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ForumMessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ForumMessageUpdateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => ForumMessageCreateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ForumMessageUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ForumMessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ForumMessageUpdateWithoutDaoInputSchema),z.lazy(() => ForumMessageUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const ForumMessageUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => ForumMessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ForumMessageUpdateManyMutationInputSchema),z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoInputSchema) ]),
}).strict();

export const ForumMessageScalarWhereInputSchema: z.ZodType<Prisma.ForumMessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ForumMessageScalarWhereInputSchema),z.lazy(() => ForumMessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ForumMessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ForumMessageScalarWhereInputSchema),z.lazy(() => ForumMessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  deletedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  replyToMessage: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  replyToUser: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  rootMessageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const DaoStarUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DaoStarUpdateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoStarCreateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const DaoStarUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoStarWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DaoStarUpdateWithoutDaoInputSchema),z.lazy(() => DaoStarUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const DaoStarUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoStarScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DaoStarUpdateManyMutationInputSchema),z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoInputSchema) ]),
}).strict();

export const ContributionUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributionUpdateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => ContributionCreateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ContributionUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributionUpdateWithoutDaoInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const ContributionUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributionUpdateManyMutationInputSchema),z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoInputSchema) ]),
}).strict();

export const DaoInfoCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoCreateWithoutHoldersInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutInfoInputSchema).optional()
}).strict();

export const DaoInfoUncheckedCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoUncheckedCreateWithoutHoldersInput> = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingOnUniswap: z.boolean().optional(),
  uniswapV2Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoUncheckedCreateNestedOneWithoutInfoInputSchema).optional()
}).strict();

export const DaoInfoCreateOrConnectWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoCreateOrConnectWithoutHoldersInput> = z.object({
  where: z.lazy(() => DaoInfoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutHoldersInputSchema) ]),
}).strict();

export const DaoInfoUpsertWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoUpsertWithoutHoldersInput> = z.object({
  update: z.union([ z.lazy(() => DaoInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutHoldersInputSchema) ]),
  create: z.union([ z.lazy(() => DaoInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedCreateWithoutHoldersInputSchema) ]),
  where: z.lazy(() => DaoInfoWhereInputSchema).optional()
}).strict();

export const DaoInfoUpdateToOneWithWhereWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoUpdateToOneWithWhereWithoutHoldersInput> = z.object({
  where: z.lazy(() => DaoInfoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoInfoUncheckedUpdateWithoutHoldersInputSchema) ]),
}).strict();

export const DaoInfoUpdateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoUpdateWithoutHoldersInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneWithoutInfoNestedInputSchema).optional()
}).strict();

export const DaoInfoUncheckedUpdateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoInfoUncheckedUpdateWithoutHoldersInput> = z.object({
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingOnUniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV2Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUncheckedUpdateOneWithoutInfoNestedInputSchema).optional()
}).strict();

export const DaoCreateWithoutInfoInputSchema: z.ZodType<Prisma.DaoCreateWithoutInfoInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutInfoInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutInfoInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutInfoInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutInfoInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateWithoutTokenInfoInput> = z.object({
  holderAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateWithoutTokenInfoInput> = z.object({
  holderAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateOrConnectWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyTokenInfoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoUpsertWithoutInfoInputSchema: z.ZodType<Prisma.DaoUpsertWithoutInfoInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutInfoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutInfoInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutInfoInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutInfoInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutInfoInputSchema) ]),
}).strict();

export const DaoUpdateWithoutInfoInputSchema: z.ZodType<Prisma.DaoUpdateWithoutInfoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutInfoInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutInfoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUpsertWithWhereUniqueWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DaoTokenHolderUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedUpdateWithoutTokenInfoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateWithWhereUniqueWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DaoTokenHolderUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedUpdateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyWithWhereWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoTokenHolderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DaoTokenHolderUpdateManyMutationInputSchema),z.lazy(() => DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderScalarWhereInputSchema: z.ZodType<Prisma.DaoTokenHolderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenHolderScalarWhereInputSchema),z.lazy(() => DaoTokenHolderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderScalarWhereInputSchema),z.lazy(() => DaoTokenHolderScalarWhereInputSchema).array() ]).optional(),
  holderAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAmount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoCreateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  info: z.lazy(() => DaoInfoCreateNestedOneWithoutDaoInputSchema),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutMessagesInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutMessagesInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedCreateWithoutMessagesInputSchema) ]),
}).strict();

export const DaoUpsertWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUpsertWithoutMessagesInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedCreateWithoutMessagesInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutMessagesInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutMessagesInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutMessagesInputSchema) ]),
}).strict();

export const DaoUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  info: z.lazy(() => DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoCreateWithoutContributionsInputSchema: z.ZodType<Prisma.DaoCreateWithoutContributionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  info: z.lazy(() => DaoInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutContributionsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutContributionsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutContributionsInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutContributionsInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributionsInputSchema) ]),
}).strict();

export const UserCreateWithoutContributionsInputSchema: z.ZodType<Prisma.UserCreateWithoutContributionsInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutUserInputSchema).optional(),
  daos: z.lazy(() => DaoCreateNestedManyWithoutCreatorInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutContributionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutContributionsInput> = z.object({
  address: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  referralCode: z.string(),
  role: z.lazy(() => UserRoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  invitedBy: z.union([ z.lazy(() => UserCreateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  daos: z.lazy(() => DaoUncheckedCreateNestedManyWithoutCreatorInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutContributionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutContributionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]),
}).strict();

export const ContributionHistoryCreateWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryCreateWithoutContributionInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isOnChain: z.boolean().optional()
}).strict();

export const ContributionHistoryUncheckedCreateWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedCreateWithoutContributionInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isOnChain: z.boolean().optional()
}).strict();

export const ContributionHistoryCreateOrConnectWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryCreateOrConnectWithoutContributionInput> = z.object({
  where: z.lazy(() => ContributionHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema) ]),
}).strict();

export const ContributionHistoryCreateManyContributionInputEnvelopeSchema: z.ZodType<Prisma.ContributionHistoryCreateManyContributionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributionHistoryCreateManyContributionInputSchema),z.lazy(() => ContributionHistoryCreateManyContributionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoUpsertWithoutContributionsInputSchema: z.ZodType<Prisma.DaoUpsertWithoutContributionsInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributionsInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributionsInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutContributionsInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutContributionsInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutContributionsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributionsInputSchema) ]),
}).strict();

export const DaoUpdateWithoutContributionsInputSchema: z.ZodType<Prisma.DaoUpdateWithoutContributionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  info: z.lazy(() => DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutContributionsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutContributionsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutContributionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutContributionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContributionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutContributionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutContributionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContributionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutContributionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutContributionsInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutUserNestedInputSchema).optional(),
  daos: z.lazy(() => DaoUpdateManyWithoutCreatorNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutContributionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutContributionsInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  referralCode: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema),z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  invitedBy: z.union([ z.lazy(() => UserUpdateinvitedByInputSchema),z.string().array() ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  daos: z.lazy(() => DaoUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional()
}).strict();

export const ContributionHistoryUpsertWithWhereUniqueWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUpsertWithWhereUniqueWithoutContributionInput> = z.object({
  where: z.lazy(() => ContributionHistoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributionHistoryUpdateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedUpdateWithoutContributionInputSchema) ]),
  create: z.union([ z.lazy(() => ContributionHistoryCreateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedCreateWithoutContributionInputSchema) ]),
}).strict();

export const ContributionHistoryUpdateWithWhereUniqueWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateWithWhereUniqueWithoutContributionInput> = z.object({
  where: z.lazy(() => ContributionHistoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributionHistoryUpdateWithoutContributionInputSchema),z.lazy(() => ContributionHistoryUncheckedUpdateWithoutContributionInputSchema) ]),
}).strict();

export const ContributionHistoryUpdateManyWithWhereWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateManyWithWhereWithoutContributionInput> = z.object({
  where: z.lazy(() => ContributionHistoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributionHistoryUpdateManyMutationInputSchema),z.lazy(() => ContributionHistoryUncheckedUpdateManyWithoutContributionInputSchema) ]),
}).strict();

export const ContributionHistoryScalarWhereInputSchema: z.ZodType<Prisma.ContributionHistoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionHistoryScalarWhereInputSchema),z.lazy(() => ContributionHistoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionHistoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionHistoryScalarWhereInputSchema),z.lazy(() => ContributionHistoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributionId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isOnChain: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const ContributionCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionCreateWithoutHistoriesInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributionsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional()
}).strict();

export const ContributionUncheckedCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionUncheckedCreateWithoutHistoriesInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ContributionCreateOrConnectWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionCreateOrConnectWithoutHistoriesInput> = z.object({
  where: z.lazy(() => ContributionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributionCreateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutHistoriesInputSchema) ]),
}).strict();

export const ContributionUpsertWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionUpsertWithoutHistoriesInput> = z.object({
  update: z.union([ z.lazy(() => ContributionUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutHistoriesInputSchema) ]),
  create: z.union([ z.lazy(() => ContributionCreateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedCreateWithoutHistoriesInputSchema) ]),
  where: z.lazy(() => ContributionWhereInputSchema).optional()
}).strict();

export const ContributionUpdateToOneWithWhereWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionUpdateToOneWithWhereWithoutHistoriesInput> = z.object({
  where: z.lazy(() => ContributionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContributionUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributionUncheckedUpdateWithoutHistoriesInputSchema) ]),
}).strict();

export const ContributionUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributionsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoStarCreateManyUserInputSchema: z.ZodType<Prisma.DaoStarCreateManyUserInput> = z.object({
  daoId: z.string()
}).strict();

export const DaoCreateManyCreatorInputSchema: z.ZodType<Prisma.DaoCreateManyCreatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  walletAddress: z.string().optional().nullable(),
  tokenAddress: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const ContributionCreateManyUserInputSchema: z.ZodType<Prisma.ContributionCreateManyUserInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DaoStarUpdateWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUpdateWithoutUserInput> = z.object({
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutStarsNestedInputSchema).optional()
}).strict();

export const DaoStarUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateWithoutUserInput> = z.object({
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoStarUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateManyWithoutUserInput> = z.object({
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  info: z.lazy(() => DaoInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contributions: z.lazy(() => ContributionUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  walletAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContributionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ForumMessageCreateManyDaoInputSchema: z.ZodType<Prisma.ForumMessageCreateManyDaoInput> = z.object({
  id: z.string().optional(),
  message: z.string(),
  createdAt: z.coerce.date().optional(),
  createdBy: z.string(),
  deletedAt: z.coerce.date().optional().nullable(),
  replyToMessage: z.string().optional().nullable(),
  replyToUser: z.string().optional().nullable(),
  rootMessageId: z.string().optional().nullable()
}).strict();

export const DaoStarCreateManyDaoInputSchema: z.ZodType<Prisma.DaoStarCreateManyDaoInput> = z.object({
  userAddress: z.string()
}).strict();

export const ContributionCreateManyDaoInputSchema: z.ZodType<Prisma.ContributionCreateManyDaoInput> = z.object({
  id: z.string(),
  userAddress: z.string(),
  isValid: z.boolean().optional(),
  githubEmail: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ForumMessageUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ForumMessageUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUncheckedUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ForumMessageUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.ForumMessageUncheckedUpdateManyWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  deletedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToMessage: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  replyToUser: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rootMessageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DaoStarUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUpdateWithoutDaoInput> = z.object({
  user: z.lazy(() => UserUpdateOneRequiredWithoutStarsNestedInputSchema).optional()
}).strict();

export const DaoStarUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateWithoutDaoInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoStarUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoStarUncheckedUpdateManyWithoutDaoInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributionHistoryUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributionHistoryUncheckedUpdateManyWithoutContributionNestedInputSchema).optional()
}).strict();

export const ContributionUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributionUncheckedUpdateManyWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  githubEmail: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateManyTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyTokenInfoInput> = z.object({
  holderAddress: z.string(),
  tokenAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateWithoutTokenInfoInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateWithoutTokenInfoInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoInput> = z.object({
  holderAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryCreateManyContributionInputSchema: z.ZodType<Prisma.ContributionHistoryCreateManyContributionInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  isOnChain: z.boolean().optional()
}).strict();

export const ContributionHistoryUpdateWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUpdateWithoutContributionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryUncheckedUpdateWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedUpdateWithoutContributionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionHistoryUncheckedUpdateManyWithoutContributionInputSchema: z.ZodType<Prisma.ContributionHistoryUncheckedUpdateManyWithoutContributionInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  isOnChain: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const ApiKeyFindFirstArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindFirstOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyFindManyArgsSchema: z.ZodType<Prisma.ApiKeyFindManyArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ApiKeyScalarFieldEnumSchema,ApiKeyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ApiKeyAggregateArgsSchema: z.ZodType<Prisma.ApiKeyAggregateArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithRelationInputSchema.array(),ApiKeyOrderByWithRelationInputSchema ]).optional(),
  cursor: ApiKeyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyGroupByArgsSchema: z.ZodType<Prisma.ApiKeyGroupByArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  orderBy: z.union([ ApiKeyOrderByWithAggregationInputSchema.array(),ApiKeyOrderByWithAggregationInputSchema ]).optional(),
  by: ApiKeyScalarFieldEnumSchema.array(),
  having: ApiKeyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ApiKeyFindUniqueArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ApiKeyFindUniqueOrThrowArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const DaoStarFindFirstArgsSchema: z.ZodType<Prisma.DaoStarFindFirstArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereInputSchema.optional(),
  orderBy: z.union([ DaoStarOrderByWithRelationInputSchema.array(),DaoStarOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoStarWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoStarScalarFieldEnumSchema,DaoStarScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoStarFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoStarFindFirstOrThrowArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereInputSchema.optional(),
  orderBy: z.union([ DaoStarOrderByWithRelationInputSchema.array(),DaoStarOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoStarWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoStarScalarFieldEnumSchema,DaoStarScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoStarFindManyArgsSchema: z.ZodType<Prisma.DaoStarFindManyArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereInputSchema.optional(),
  orderBy: z.union([ DaoStarOrderByWithRelationInputSchema.array(),DaoStarOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoStarWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoStarScalarFieldEnumSchema,DaoStarScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoStarAggregateArgsSchema: z.ZodType<Prisma.DaoStarAggregateArgs> = z.object({
  where: DaoStarWhereInputSchema.optional(),
  orderBy: z.union([ DaoStarOrderByWithRelationInputSchema.array(),DaoStarOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoStarWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoStarGroupByArgsSchema: z.ZodType<Prisma.DaoStarGroupByArgs> = z.object({
  where: DaoStarWhereInputSchema.optional(),
  orderBy: z.union([ DaoStarOrderByWithAggregationInputSchema.array(),DaoStarOrderByWithAggregationInputSchema ]).optional(),
  by: DaoStarScalarFieldEnumSchema.array(),
  having: DaoStarScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoStarFindUniqueArgsSchema: z.ZodType<Prisma.DaoStarFindUniqueArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereUniqueInputSchema,
}).strict() ;

export const DaoStarFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoStarFindUniqueOrThrowArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereUniqueInputSchema,
}).strict() ;

export const DaoFindFirstArgsSchema: z.ZodType<Prisma.DaoFindFirstArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereInputSchema.optional(),
  orderBy: z.union([ DaoOrderByWithRelationInputSchema.array(),DaoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoScalarFieldEnumSchema,DaoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoFindFirstOrThrowArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereInputSchema.optional(),
  orderBy: z.union([ DaoOrderByWithRelationInputSchema.array(),DaoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoScalarFieldEnumSchema,DaoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoFindManyArgsSchema: z.ZodType<Prisma.DaoFindManyArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereInputSchema.optional(),
  orderBy: z.union([ DaoOrderByWithRelationInputSchema.array(),DaoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoScalarFieldEnumSchema,DaoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoAggregateArgsSchema: z.ZodType<Prisma.DaoAggregateArgs> = z.object({
  where: DaoWhereInputSchema.optional(),
  orderBy: z.union([ DaoOrderByWithRelationInputSchema.array(),DaoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoGroupByArgsSchema: z.ZodType<Prisma.DaoGroupByArgs> = z.object({
  where: DaoWhereInputSchema.optional(),
  orderBy: z.union([ DaoOrderByWithAggregationInputSchema.array(),DaoOrderByWithAggregationInputSchema ]).optional(),
  by: DaoScalarFieldEnumSchema.array(),
  having: DaoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoFindUniqueArgsSchema: z.ZodType<Prisma.DaoFindUniqueArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereUniqueInputSchema,
}).strict() ;

export const DaoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoFindUniqueOrThrowArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenHolderFindFirstArgsSchema: z.ZodType<Prisma.DaoTokenHolderFindFirstArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenHolderOrderByWithRelationInputSchema.array(),DaoTokenHolderOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenHolderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenHolderScalarFieldEnumSchema,DaoTokenHolderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenHolderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoTokenHolderFindFirstOrThrowArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenHolderOrderByWithRelationInputSchema.array(),DaoTokenHolderOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenHolderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenHolderScalarFieldEnumSchema,DaoTokenHolderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenHolderFindManyArgsSchema: z.ZodType<Prisma.DaoTokenHolderFindManyArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenHolderOrderByWithRelationInputSchema.array(),DaoTokenHolderOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenHolderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenHolderScalarFieldEnumSchema,DaoTokenHolderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenHolderAggregateArgsSchema: z.ZodType<Prisma.DaoTokenHolderAggregateArgs> = z.object({
  where: DaoTokenHolderWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenHolderOrderByWithRelationInputSchema.array(),DaoTokenHolderOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenHolderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoTokenHolderGroupByArgsSchema: z.ZodType<Prisma.DaoTokenHolderGroupByArgs> = z.object({
  where: DaoTokenHolderWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenHolderOrderByWithAggregationInputSchema.array(),DaoTokenHolderOrderByWithAggregationInputSchema ]).optional(),
  by: DaoTokenHolderScalarFieldEnumSchema.array(),
  having: DaoTokenHolderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoTokenHolderFindUniqueArgsSchema: z.ZodType<Prisma.DaoTokenHolderFindUniqueArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenHolderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoTokenHolderFindUniqueOrThrowArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereUniqueInputSchema,
}).strict() ;

export const DaoInfoFindFirstArgsSchema: z.ZodType<Prisma.DaoInfoFindFirstArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoInfoOrderByWithRelationInputSchema.array(),DaoInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoInfoScalarFieldEnumSchema,DaoInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoInfoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoInfoFindFirstOrThrowArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoInfoOrderByWithRelationInputSchema.array(),DaoInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoInfoScalarFieldEnumSchema,DaoInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoInfoFindManyArgsSchema: z.ZodType<Prisma.DaoInfoFindManyArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoInfoOrderByWithRelationInputSchema.array(),DaoInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoInfoScalarFieldEnumSchema,DaoInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoInfoAggregateArgsSchema: z.ZodType<Prisma.DaoInfoAggregateArgs> = z.object({
  where: DaoInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoInfoOrderByWithRelationInputSchema.array(),DaoInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoInfoGroupByArgsSchema: z.ZodType<Prisma.DaoInfoGroupByArgs> = z.object({
  where: DaoInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoInfoOrderByWithAggregationInputSchema.array(),DaoInfoOrderByWithAggregationInputSchema ]).optional(),
  by: DaoInfoScalarFieldEnumSchema.array(),
  having: DaoInfoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoInfoFindUniqueArgsSchema: z.ZodType<Prisma.DaoInfoFindUniqueArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoInfoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoInfoFindUniqueOrThrowArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereUniqueInputSchema,
}).strict() ;

export const ForumMessageFindFirstArgsSchema: z.ZodType<Prisma.ForumMessageFindFirstArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereInputSchema.optional(),
  orderBy: z.union([ ForumMessageOrderByWithRelationInputSchema.array(),ForumMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ForumMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ForumMessageScalarFieldEnumSchema,ForumMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ForumMessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ForumMessageFindFirstOrThrowArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereInputSchema.optional(),
  orderBy: z.union([ ForumMessageOrderByWithRelationInputSchema.array(),ForumMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ForumMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ForumMessageScalarFieldEnumSchema,ForumMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ForumMessageFindManyArgsSchema: z.ZodType<Prisma.ForumMessageFindManyArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereInputSchema.optional(),
  orderBy: z.union([ ForumMessageOrderByWithRelationInputSchema.array(),ForumMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ForumMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ForumMessageScalarFieldEnumSchema,ForumMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ForumMessageAggregateArgsSchema: z.ZodType<Prisma.ForumMessageAggregateArgs> = z.object({
  where: ForumMessageWhereInputSchema.optional(),
  orderBy: z.union([ ForumMessageOrderByWithRelationInputSchema.array(),ForumMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ForumMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ForumMessageGroupByArgsSchema: z.ZodType<Prisma.ForumMessageGroupByArgs> = z.object({
  where: ForumMessageWhereInputSchema.optional(),
  orderBy: z.union([ ForumMessageOrderByWithAggregationInputSchema.array(),ForumMessageOrderByWithAggregationInputSchema ]).optional(),
  by: ForumMessageScalarFieldEnumSchema.array(),
  having: ForumMessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ForumMessageFindUniqueArgsSchema: z.ZodType<Prisma.ForumMessageFindUniqueArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereUniqueInputSchema,
}).strict() ;

export const ForumMessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ForumMessageFindUniqueOrThrowArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereUniqueInputSchema,
}).strict() ;

export const ContributionFindFirstArgsSchema: z.ZodType<Prisma.ContributionFindFirstArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereInputSchema.optional(),
  orderBy: z.union([ ContributionOrderByWithRelationInputSchema.array(),ContributionOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionScalarFieldEnumSchema,ContributionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributionFindFirstOrThrowArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereInputSchema.optional(),
  orderBy: z.union([ ContributionOrderByWithRelationInputSchema.array(),ContributionOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionScalarFieldEnumSchema,ContributionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionFindManyArgsSchema: z.ZodType<Prisma.ContributionFindManyArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereInputSchema.optional(),
  orderBy: z.union([ ContributionOrderByWithRelationInputSchema.array(),ContributionOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionScalarFieldEnumSchema,ContributionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionAggregateArgsSchema: z.ZodType<Prisma.ContributionAggregateArgs> = z.object({
  where: ContributionWhereInputSchema.optional(),
  orderBy: z.union([ ContributionOrderByWithRelationInputSchema.array(),ContributionOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionGroupByArgsSchema: z.ZodType<Prisma.ContributionGroupByArgs> = z.object({
  where: ContributionWhereInputSchema.optional(),
  orderBy: z.union([ ContributionOrderByWithAggregationInputSchema.array(),ContributionOrderByWithAggregationInputSchema ]).optional(),
  by: ContributionScalarFieldEnumSchema.array(),
  having: ContributionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionFindUniqueArgsSchema: z.ZodType<Prisma.ContributionFindUniqueArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereUniqueInputSchema,
}).strict() ;

export const ContributionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributionFindUniqueOrThrowArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereUniqueInputSchema,
}).strict() ;

export const ContributionHistoryFindFirstArgsSchema: z.ZodType<Prisma.ContributionHistoryFindFirstArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributionHistoryOrderByWithRelationInputSchema.array(),ContributionHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionHistoryScalarFieldEnumSchema,ContributionHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributionHistoryFindFirstOrThrowArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributionHistoryOrderByWithRelationInputSchema.array(),ContributionHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionHistoryScalarFieldEnumSchema,ContributionHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionHistoryFindManyArgsSchema: z.ZodType<Prisma.ContributionHistoryFindManyArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributionHistoryOrderByWithRelationInputSchema.array(),ContributionHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionHistoryScalarFieldEnumSchema,ContributionHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionHistoryAggregateArgsSchema: z.ZodType<Prisma.ContributionHistoryAggregateArgs> = z.object({
  where: ContributionHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributionHistoryOrderByWithRelationInputSchema.array(),ContributionHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionHistoryGroupByArgsSchema: z.ZodType<Prisma.ContributionHistoryGroupByArgs> = z.object({
  where: ContributionHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributionHistoryOrderByWithAggregationInputSchema.array(),ContributionHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: ContributionHistoryScalarFieldEnumSchema.array(),
  having: ContributionHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionHistoryFindUniqueArgsSchema: z.ZodType<Prisma.ContributionHistoryFindUniqueArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributionHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributionHistoryFindUniqueOrThrowArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyCreateArgsSchema: z.ZodType<Prisma.ApiKeyCreateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  data: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
}).strict() ;

export const ApiKeyUpsertArgsSchema: z.ZodType<Prisma.ApiKeyUpsertArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
  create: z.union([ ApiKeyCreateInputSchema,ApiKeyUncheckedCreateInputSchema ]),
  update: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
}).strict() ;

export const ApiKeyCreateManyArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ApiKeyCreateManyAndReturnArgs> = z.object({
  data: z.union([ ApiKeyCreateManyInputSchema,ApiKeyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ApiKeyDeleteArgsSchema: z.ZodType<Prisma.ApiKeyDeleteArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateArgsSchema: z.ZodType<Prisma.ApiKeyUpdateArgs> = z.object({
  select: ApiKeySelectSchema.optional(),
  data: z.union([ ApiKeyUpdateInputSchema,ApiKeyUncheckedUpdateInputSchema ]),
  where: ApiKeyWhereUniqueInputSchema,
}).strict() ;

export const ApiKeyUpdateManyArgsSchema: z.ZodType<Prisma.ApiKeyUpdateManyArgs> = z.object({
  data: z.union([ ApiKeyUpdateManyMutationInputSchema,ApiKeyUncheckedUpdateManyInputSchema ]),
  where: ApiKeyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ApiKeyUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ApiKeyUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ApiKeyUpdateManyMutationInputSchema,ApiKeyUncheckedUpdateManyInputSchema ]),
  where: ApiKeyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ApiKeyDeleteManyArgsSchema: z.ZodType<Prisma.ApiKeyDeleteManyArgs> = z.object({
  where: ApiKeyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoStarCreateArgsSchema: z.ZodType<Prisma.DaoStarCreateArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  data: z.union([ DaoStarCreateInputSchema,DaoStarUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoStarUpsertArgsSchema: z.ZodType<Prisma.DaoStarUpsertArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereUniqueInputSchema,
  create: z.union([ DaoStarCreateInputSchema,DaoStarUncheckedCreateInputSchema ]),
  update: z.union([ DaoStarUpdateInputSchema,DaoStarUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoStarCreateManyArgsSchema: z.ZodType<Prisma.DaoStarCreateManyArgs> = z.object({
  data: z.union([ DaoStarCreateManyInputSchema,DaoStarCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoStarCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoStarCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoStarCreateManyInputSchema,DaoStarCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoStarDeleteArgsSchema: z.ZodType<Prisma.DaoStarDeleteArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  where: DaoStarWhereUniqueInputSchema,
}).strict() ;

export const DaoStarUpdateArgsSchema: z.ZodType<Prisma.DaoStarUpdateArgs> = z.object({
  select: DaoStarSelectSchema.optional(),
  include: DaoStarIncludeSchema.optional(),
  data: z.union([ DaoStarUpdateInputSchema,DaoStarUncheckedUpdateInputSchema ]),
  where: DaoStarWhereUniqueInputSchema,
}).strict() ;

export const DaoStarUpdateManyArgsSchema: z.ZodType<Prisma.DaoStarUpdateManyArgs> = z.object({
  data: z.union([ DaoStarUpdateManyMutationInputSchema,DaoStarUncheckedUpdateManyInputSchema ]),
  where: DaoStarWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoStarUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoStarUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoStarUpdateManyMutationInputSchema,DaoStarUncheckedUpdateManyInputSchema ]),
  where: DaoStarWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoStarDeleteManyArgsSchema: z.ZodType<Prisma.DaoStarDeleteManyArgs> = z.object({
  where: DaoStarWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoCreateArgsSchema: z.ZodType<Prisma.DaoCreateArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  data: z.union([ DaoCreateInputSchema,DaoUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoUpsertArgsSchema: z.ZodType<Prisma.DaoUpsertArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereUniqueInputSchema,
  create: z.union([ DaoCreateInputSchema,DaoUncheckedCreateInputSchema ]),
  update: z.union([ DaoUpdateInputSchema,DaoUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoCreateManyArgsSchema: z.ZodType<Prisma.DaoCreateManyArgs> = z.object({
  data: z.union([ DaoCreateManyInputSchema,DaoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoCreateManyInputSchema,DaoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoDeleteArgsSchema: z.ZodType<Prisma.DaoDeleteArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  where: DaoWhereUniqueInputSchema,
}).strict() ;

export const DaoUpdateArgsSchema: z.ZodType<Prisma.DaoUpdateArgs> = z.object({
  select: DaoSelectSchema.optional(),
  include: DaoIncludeSchema.optional(),
  data: z.union([ DaoUpdateInputSchema,DaoUncheckedUpdateInputSchema ]),
  where: DaoWhereUniqueInputSchema,
}).strict() ;

export const DaoUpdateManyArgsSchema: z.ZodType<Prisma.DaoUpdateManyArgs> = z.object({
  data: z.union([ DaoUpdateManyMutationInputSchema,DaoUncheckedUpdateManyInputSchema ]),
  where: DaoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoUpdateManyMutationInputSchema,DaoUncheckedUpdateManyInputSchema ]),
  where: DaoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoDeleteManyArgsSchema: z.ZodType<Prisma.DaoDeleteManyArgs> = z.object({
  where: DaoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoTokenHolderCreateArgsSchema: z.ZodType<Prisma.DaoTokenHolderCreateArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  data: z.union([ DaoTokenHolderCreateInputSchema,DaoTokenHolderUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoTokenHolderUpsertArgsSchema: z.ZodType<Prisma.DaoTokenHolderUpsertArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereUniqueInputSchema,
  create: z.union([ DaoTokenHolderCreateInputSchema,DaoTokenHolderUncheckedCreateInputSchema ]),
  update: z.union([ DaoTokenHolderUpdateInputSchema,DaoTokenHolderUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoTokenHolderCreateManyArgsSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyArgs> = z.object({
  data: z.union([ DaoTokenHolderCreateManyInputSchema,DaoTokenHolderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoTokenHolderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoTokenHolderCreateManyInputSchema,DaoTokenHolderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoTokenHolderDeleteArgsSchema: z.ZodType<Prisma.DaoTokenHolderDeleteArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  where: DaoTokenHolderWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenHolderUpdateArgsSchema: z.ZodType<Prisma.DaoTokenHolderUpdateArgs> = z.object({
  select: DaoTokenHolderSelectSchema.optional(),
  include: DaoTokenHolderIncludeSchema.optional(),
  data: z.union([ DaoTokenHolderUpdateInputSchema,DaoTokenHolderUncheckedUpdateInputSchema ]),
  where: DaoTokenHolderWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenHolderUpdateManyArgsSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyArgs> = z.object({
  data: z.union([ DaoTokenHolderUpdateManyMutationInputSchema,DaoTokenHolderUncheckedUpdateManyInputSchema ]),
  where: DaoTokenHolderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoTokenHolderUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoTokenHolderUpdateManyMutationInputSchema,DaoTokenHolderUncheckedUpdateManyInputSchema ]),
  where: DaoTokenHolderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoTokenHolderDeleteManyArgsSchema: z.ZodType<Prisma.DaoTokenHolderDeleteManyArgs> = z.object({
  where: DaoTokenHolderWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoInfoCreateArgsSchema: z.ZodType<Prisma.DaoInfoCreateArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  data: z.union([ DaoInfoCreateInputSchema,DaoInfoUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoInfoUpsertArgsSchema: z.ZodType<Prisma.DaoInfoUpsertArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereUniqueInputSchema,
  create: z.union([ DaoInfoCreateInputSchema,DaoInfoUncheckedCreateInputSchema ]),
  update: z.union([ DaoInfoUpdateInputSchema,DaoInfoUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoInfoCreateManyArgsSchema: z.ZodType<Prisma.DaoInfoCreateManyArgs> = z.object({
  data: z.union([ DaoInfoCreateManyInputSchema,DaoInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoInfoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoInfoCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoInfoCreateManyInputSchema,DaoInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoInfoDeleteArgsSchema: z.ZodType<Prisma.DaoInfoDeleteArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  where: DaoInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoInfoUpdateArgsSchema: z.ZodType<Prisma.DaoInfoUpdateArgs> = z.object({
  select: DaoInfoSelectSchema.optional(),
  include: DaoInfoIncludeSchema.optional(),
  data: z.union([ DaoInfoUpdateInputSchema,DaoInfoUncheckedUpdateInputSchema ]),
  where: DaoInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoInfoUpdateManyArgsSchema: z.ZodType<Prisma.DaoInfoUpdateManyArgs> = z.object({
  data: z.union([ DaoInfoUpdateManyMutationInputSchema,DaoInfoUncheckedUpdateManyInputSchema ]),
  where: DaoInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoInfoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoInfoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoInfoUpdateManyMutationInputSchema,DaoInfoUncheckedUpdateManyInputSchema ]),
  where: DaoInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoInfoDeleteManyArgsSchema: z.ZodType<Prisma.DaoInfoDeleteManyArgs> = z.object({
  where: DaoInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ForumMessageCreateArgsSchema: z.ZodType<Prisma.ForumMessageCreateArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  data: z.union([ ForumMessageCreateInputSchema,ForumMessageUncheckedCreateInputSchema ]),
}).strict() ;

export const ForumMessageUpsertArgsSchema: z.ZodType<Prisma.ForumMessageUpsertArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereUniqueInputSchema,
  create: z.union([ ForumMessageCreateInputSchema,ForumMessageUncheckedCreateInputSchema ]),
  update: z.union([ ForumMessageUpdateInputSchema,ForumMessageUncheckedUpdateInputSchema ]),
}).strict() ;

export const ForumMessageCreateManyArgsSchema: z.ZodType<Prisma.ForumMessageCreateManyArgs> = z.object({
  data: z.union([ ForumMessageCreateManyInputSchema,ForumMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ForumMessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ForumMessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ ForumMessageCreateManyInputSchema,ForumMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ForumMessageDeleteArgsSchema: z.ZodType<Prisma.ForumMessageDeleteArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  where: ForumMessageWhereUniqueInputSchema,
}).strict() ;

export const ForumMessageUpdateArgsSchema: z.ZodType<Prisma.ForumMessageUpdateArgs> = z.object({
  select: ForumMessageSelectSchema.optional(),
  include: ForumMessageIncludeSchema.optional(),
  data: z.union([ ForumMessageUpdateInputSchema,ForumMessageUncheckedUpdateInputSchema ]),
  where: ForumMessageWhereUniqueInputSchema,
}).strict() ;

export const ForumMessageUpdateManyArgsSchema: z.ZodType<Prisma.ForumMessageUpdateManyArgs> = z.object({
  data: z.union([ ForumMessageUpdateManyMutationInputSchema,ForumMessageUncheckedUpdateManyInputSchema ]),
  where: ForumMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ForumMessageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ForumMessageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ForumMessageUpdateManyMutationInputSchema,ForumMessageUncheckedUpdateManyInputSchema ]),
  where: ForumMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ForumMessageDeleteManyArgsSchema: z.ZodType<Prisma.ForumMessageDeleteManyArgs> = z.object({
  where: ForumMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionCreateArgsSchema: z.ZodType<Prisma.ContributionCreateArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  data: z.union([ ContributionCreateInputSchema,ContributionUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributionUpsertArgsSchema: z.ZodType<Prisma.ContributionUpsertArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereUniqueInputSchema,
  create: z.union([ ContributionCreateInputSchema,ContributionUncheckedCreateInputSchema ]),
  update: z.union([ ContributionUpdateInputSchema,ContributionUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributionCreateManyArgsSchema: z.ZodType<Prisma.ContributionCreateManyArgs> = z.object({
  data: z.union([ ContributionCreateManyInputSchema,ContributionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionCreateManyInputSchema,ContributionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionDeleteArgsSchema: z.ZodType<Prisma.ContributionDeleteArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  where: ContributionWhereUniqueInputSchema,
}).strict() ;

export const ContributionUpdateArgsSchema: z.ZodType<Prisma.ContributionUpdateArgs> = z.object({
  select: ContributionSelectSchema.optional(),
  include: ContributionIncludeSchema.optional(),
  data: z.union([ ContributionUpdateInputSchema,ContributionUncheckedUpdateInputSchema ]),
  where: ContributionWhereUniqueInputSchema,
}).strict() ;

export const ContributionUpdateManyArgsSchema: z.ZodType<Prisma.ContributionUpdateManyArgs> = z.object({
  data: z.union([ ContributionUpdateManyMutationInputSchema,ContributionUncheckedUpdateManyInputSchema ]),
  where: ContributionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionUpdateManyMutationInputSchema,ContributionUncheckedUpdateManyInputSchema ]),
  where: ContributionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionDeleteManyArgsSchema: z.ZodType<Prisma.ContributionDeleteManyArgs> = z.object({
  where: ContributionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionHistoryCreateArgsSchema: z.ZodType<Prisma.ContributionHistoryCreateArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  data: z.union([ ContributionHistoryCreateInputSchema,ContributionHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributionHistoryUpsertArgsSchema: z.ZodType<Prisma.ContributionHistoryUpsertArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereUniqueInputSchema,
  create: z.union([ ContributionHistoryCreateInputSchema,ContributionHistoryUncheckedCreateInputSchema ]),
  update: z.union([ ContributionHistoryUpdateInputSchema,ContributionHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributionHistoryCreateManyArgsSchema: z.ZodType<Prisma.ContributionHistoryCreateManyArgs> = z.object({
  data: z.union([ ContributionHistoryCreateManyInputSchema,ContributionHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionHistoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionHistoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionHistoryCreateManyInputSchema,ContributionHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionHistoryDeleteArgsSchema: z.ZodType<Prisma.ContributionHistoryDeleteArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  where: ContributionHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributionHistoryUpdateArgsSchema: z.ZodType<Prisma.ContributionHistoryUpdateArgs> = z.object({
  select: ContributionHistorySelectSchema.optional(),
  include: ContributionHistoryIncludeSchema.optional(),
  data: z.union([ ContributionHistoryUpdateInputSchema,ContributionHistoryUncheckedUpdateInputSchema ]),
  where: ContributionHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributionHistoryUpdateManyArgsSchema: z.ZodType<Prisma.ContributionHistoryUpdateManyArgs> = z.object({
  data: z.union([ ContributionHistoryUpdateManyMutationInputSchema,ContributionHistoryUncheckedUpdateManyInputSchema ]),
  where: ContributionHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionHistoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionHistoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionHistoryUpdateManyMutationInputSchema,ContributionHistoryUncheckedUpdateManyInputSchema ]),
  where: ContributionHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionHistoryDeleteManyArgsSchema: z.ZodType<Prisma.ContributionHistoryDeleteManyArgs> = z.object({
  where: ContributionHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;