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

export const DaoScalarFieldEnumSchema = z.enum(['id','name','url','ticker','type','description','avatar','createdAt','updatedAt','createdBy','tokenId','links','status','platform','marketCapUsd','priceUsd']);

export const DaoContentScalarFieldEnumSchema = z.enum(['id','daoId','sort','title','type','data','createdAt','updatedAt']);

export const DaoTokenHolderScalarFieldEnumSchema = z.enum(['userAddress','tokenId','balance']);

export const DaoTokenInfoScalarFieldEnumSchema = z.enum(['tokenId','tokenAddress','name','ticker','creator','createdAt','marketCap','totalSupply','holderCount','assetTokenAddress','tradingonuniswap','uniswapV3Pair']);

export const AssetTokenScalarFieldEnumSchema = z.enum(['chainId','address','name','symbol','decimals','logoUrl','priceUsd','launchFee','isAllowed','isNative','isValid']);

export const ForumMessageScalarFieldEnumSchema = z.enum(['id','daoId','message','createdAt','createdBy','deletedAt','replyToMessage','replyToUser','rootMessageId']);

export const POCScalarFieldEnumSchema = z.enum(['id','daoId','userAddress','isValid','userPlatformId','userPlatformName','userPlatformUrl','userPlatformAvatar','createdAt','updatedAt','snapshotValue']);

export const POCHistoryScalarFieldEnumSchema = z.enum(['id','tag','value','createdAt','updatedAt','pocId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['USER','ADMIN']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const DaoTypeSchema = z.enum(['CODE','MODEL','DATASET']);

export type DaoTypeType = `${z.infer<typeof DaoTypeSchema>}`

export const DaoStatusSchema = z.enum(['INACTIVE','LAUNCHING','LAUNCHED']);

export type DaoStatusType = `${z.infer<typeof DaoStatusSchema>}`

export const DaoPlatformSchema = z.enum(['GITHUB','GITLAB']);

export type DaoPlatformType = `${z.infer<typeof DaoPlatformSchema>}`

export const DaoContentTypeSchema = z.enum(['LIST_ROW']);

export type DaoContentTypeType = `${z.infer<typeof DaoContentTypeSchema>}`

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
  platform: DaoPlatformSchema,
  id: z.string(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: JsonValueSchema,
  marketCapUsd: z.instanceof(Prisma.Decimal, { message: "Field 'marketCapUsd' must be a Decimal. Location: ['Models', 'Dao']"}),
  priceUsd: z.instanceof(Prisma.Decimal, { message: "Field 'priceUsd' must be a Decimal. Location: ['Models', 'Dao']"}),
})

export type Dao = z.infer<typeof DaoSchema>

/////////////////////////////////////////
// DAO CONTENT SCHEMA
/////////////////////////////////////////

export const DaoContentSchema = z.object({
  type: DaoContentTypeSchema,
  id: z.string(),
  daoId: z.string(),
  sort: z.number().int(),
  title: z.string(),
  data: JsonValueSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type DaoContent = z.infer<typeof DaoContentSchema>

/////////////////////////////////////////
// DAO TOKEN HOLDER SCHEMA
/////////////////////////////////////////

export const DaoTokenHolderSchema = z.object({
  userAddress: z.string(),
  tokenId: z.bigint(),
  balance: z.instanceof(Prisma.Decimal, { message: "Field 'balance' must be a Decimal. Location: ['Models', 'DaoTokenHolder']"}),
})

export type DaoTokenHolder = z.infer<typeof DaoTokenHolderSchema>

/////////////////////////////////////////
// DAO TOKEN INFO SCHEMA
/////////////////////////////////////////

export const DaoTokenInfoSchema = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint(),
  marketCap: z.instanceof(Prisma.Decimal, { message: "Field 'marketCap' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}),
  totalSupply: z.instanceof(Prisma.Decimal, { message: "Field 'totalSupply' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}),
  holderCount: z.number().int(),
  assetTokenAddress: z.string(),
  tradingonuniswap: z.boolean(),
  uniswapV3Pair: z.string().nullable(),
})

export type DaoTokenInfo = z.infer<typeof DaoTokenInfoSchema>

/////////////////////////////////////////
// ASSET TOKEN SCHEMA
/////////////////////////////////////////

export const AssetTokenSchema = z.object({
  chainId: z.number().int(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.instanceof(Prisma.Decimal, { message: "Field 'priceUsd' must be a Decimal. Location: ['Models', 'AssetToken']"}),
  launchFee: z.bigint(),
  isAllowed: z.boolean(),
  isNative: z.boolean(),
  isValid: z.boolean(),
})

export type AssetToken = z.infer<typeof AssetTokenSchema>

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
// POC SCHEMA
/////////////////////////////////////////

export const POCSchema = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string().nullable(),
  isValid: z.boolean(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  snapshotValue: z.instanceof(Prisma.Decimal, { message: "Field 'snapshotValue' must be a Decimal. Location: ['Models', 'POC']"}),
})

export type POC = z.infer<typeof POCSchema>

/////////////////////////////////////////
// POC HISTORY SCHEMA
/////////////////////////////////////////

export const POCHistorySchema = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.instanceof(Prisma.Decimal, { message: "Field 'value' must be a Decimal. Location: ['Models', 'POCHistory']"}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  pocId: z.string(),
})

export type POCHistory = z.infer<typeof POCHistorySchema>

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
  contributions: z.union([z.boolean(),z.lazy(() => POCFindManyArgsSchema)]).optional(),
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
  contributions: z.union([z.boolean(),z.lazy(() => POCFindManyArgsSchema)]).optional(),
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
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoTokenInfoArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => ForumMessageFindManyArgsSchema)]).optional(),
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  pocs: z.union([z.boolean(),z.lazy(() => POCFindManyArgsSchema)]).optional(),
  contents: z.union([z.boolean(),z.lazy(() => DaoContentFindManyArgsSchema)]).optional(),
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
  pocs: z.boolean().optional(),
  contents: z.boolean().optional(),
}).strict();

export const DaoSelectSchema: z.ZodType<Prisma.DaoSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  url: z.boolean().optional(),
  ticker: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  avatar: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  links: z.boolean().optional(),
  status: z.boolean().optional(),
  platform: z.boolean().optional(),
  marketCapUsd: z.boolean().optional(),
  priceUsd: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoTokenInfoArgsSchema)]).optional(),
  messages: z.union([z.boolean(),z.lazy(() => ForumMessageFindManyArgsSchema)]).optional(),
  stars: z.union([z.boolean(),z.lazy(() => DaoStarFindManyArgsSchema)]).optional(),
  pocs: z.union([z.boolean(),z.lazy(() => POCFindManyArgsSchema)]).optional(),
  contents: z.union([z.boolean(),z.lazy(() => DaoContentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// DAO CONTENT
//------------------------------------------------------

export const DaoContentIncludeSchema: z.ZodType<Prisma.DaoContentInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
}).strict()

export const DaoContentArgsSchema: z.ZodType<Prisma.DaoContentDefaultArgs> = z.object({
  select: z.lazy(() => DaoContentSelectSchema).optional(),
  include: z.lazy(() => DaoContentIncludeSchema).optional(),
}).strict();

export const DaoContentSelectSchema: z.ZodType<Prisma.DaoContentSelect> = z.object({
  id: z.boolean().optional(),
  daoId: z.boolean().optional(),
  sort: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  data: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
}).strict()

// DAO TOKEN HOLDER
//------------------------------------------------------

export const DaoTokenHolderIncludeSchema: z.ZodType<Prisma.DaoTokenHolderInclude> = z.object({
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoTokenInfoArgsSchema)]).optional(),
}).strict()

export const DaoTokenHolderArgsSchema: z.ZodType<Prisma.DaoTokenHolderDefaultArgs> = z.object({
  select: z.lazy(() => DaoTokenHolderSelectSchema).optional(),
  include: z.lazy(() => DaoTokenHolderIncludeSchema).optional(),
}).strict();

export const DaoTokenHolderSelectSchema: z.ZodType<Prisma.DaoTokenHolderSelect> = z.object({
  userAddress: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  balance: z.boolean().optional(),
  tokenInfo: z.union([z.boolean(),z.lazy(() => DaoTokenInfoArgsSchema)]).optional(),
}).strict()

// DAO TOKEN INFO
//------------------------------------------------------

export const DaoTokenInfoIncludeSchema: z.ZodType<Prisma.DaoTokenInfoInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  holders: z.union([z.boolean(),z.lazy(() => DaoTokenHolderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoTokenInfoCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DaoTokenInfoArgsSchema: z.ZodType<Prisma.DaoTokenInfoDefaultArgs> = z.object({
  select: z.lazy(() => DaoTokenInfoSelectSchema).optional(),
  include: z.lazy(() => DaoTokenInfoIncludeSchema).optional(),
}).strict();

export const DaoTokenInfoCountOutputTypeArgsSchema: z.ZodType<Prisma.DaoTokenInfoCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DaoTokenInfoCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DaoTokenInfoCountOutputTypeSelectSchema: z.ZodType<Prisma.DaoTokenInfoCountOutputTypeSelect> = z.object({
  holders: z.boolean().optional(),
}).strict();

export const DaoTokenInfoSelectSchema: z.ZodType<Prisma.DaoTokenInfoSelect> = z.object({
  tokenId: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  name: z.boolean().optional(),
  ticker: z.boolean().optional(),
  creator: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  marketCap: z.boolean().optional(),
  totalSupply: z.boolean().optional(),
  holderCount: z.boolean().optional(),
  assetTokenAddress: z.boolean().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  holders: z.union([z.boolean(),z.lazy(() => DaoTokenHolderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoTokenInfoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ASSET TOKEN
//------------------------------------------------------

export const AssetTokenSelectSchema: z.ZodType<Prisma.AssetTokenSelect> = z.object({
  chainId: z.boolean().optional(),
  address: z.boolean().optional(),
  name: z.boolean().optional(),
  symbol: z.boolean().optional(),
  decimals: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  priceUsd: z.boolean().optional(),
  launchFee: z.boolean().optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional(),
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

// POC
//------------------------------------------------------

export const POCIncludeSchema: z.ZodType<Prisma.POCInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => POCHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => POCCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const POCArgsSchema: z.ZodType<Prisma.POCDefaultArgs> = z.object({
  select: z.lazy(() => POCSelectSchema).optional(),
  include: z.lazy(() => POCIncludeSchema).optional(),
}).strict();

export const POCCountOutputTypeArgsSchema: z.ZodType<Prisma.POCCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => POCCountOutputTypeSelectSchema).nullish(),
}).strict();

export const POCCountOutputTypeSelectSchema: z.ZodType<Prisma.POCCountOutputTypeSelect> = z.object({
  histories: z.boolean().optional(),
}).strict();

export const POCSelectSchema: z.ZodType<Prisma.POCSelect> = z.object({
  id: z.boolean().optional(),
  daoId: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.boolean().optional(),
  userPlatformName: z.boolean().optional(),
  userPlatformUrl: z.boolean().optional(),
  userPlatformAvatar: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  snapshotValue: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => POCHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => POCCountOutputTypeArgsSchema)]).optional(),
}).strict()

// POC HISTORY
//------------------------------------------------------

export const POCHistoryIncludeSchema: z.ZodType<Prisma.POCHistoryInclude> = z.object({
  poc: z.union([z.boolean(),z.lazy(() => POCArgsSchema)]).optional(),
}).strict()

export const POCHistoryArgsSchema: z.ZodType<Prisma.POCHistoryDefaultArgs> = z.object({
  select: z.lazy(() => POCHistorySelectSchema).optional(),
  include: z.lazy(() => POCHistoryIncludeSchema).optional(),
}).strict();

export const POCHistorySelectSchema: z.ZodType<Prisma.POCHistorySelect> = z.object({
  id: z.boolean().optional(),
  tag: z.boolean().optional(),
  value: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  pocId: z.boolean().optional(),
  poc: z.union([z.boolean(),z.lazy(() => POCArgsSchema)]).optional(),
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
  contributions: z.lazy(() => POCListRelationFilterSchema).optional()
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
  contributions: z.lazy(() => POCOrderByRelationAggregateInputSchema).optional()
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
  contributions: z.lazy(() => POCListRelationFilterSchema).optional()
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
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  links: z.lazy(() => JsonFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  platform: z.union([ z.lazy(() => EnumDaoPlatformFilterSchema),z.lazy(() => DaoPlatformSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoTokenInfoScalarRelationFilterSchema),z.lazy(() => DaoTokenInfoWhereInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageListRelationFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  pocs: z.lazy(() => POCListRelationFilterSchema).optional(),
  contents: z.lazy(() => DaoContentListRelationFilterSchema).optional()
}).strict();

export const DaoOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoOrderByWithRelationInputSchema).optional(),
  messages: z.lazy(() => ForumMessageOrderByRelationAggregateInputSchema).optional(),
  stars: z.lazy(() => DaoStarOrderByRelationAggregateInputSchema).optional(),
  pocs: z.lazy(() => POCOrderByRelationAggregateInputSchema).optional(),
  contents: z.lazy(() => DaoContentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DaoWhereUniqueInputSchema: z.ZodType<Prisma.DaoWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    ticker: z.string(),
    tokenId: z.bigint()
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    name: z.string(),
  }),
  z.object({
    id: z.string(),
    url: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    url: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    url: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    url: z.string(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
    ticker: z.string(),
  }),
  z.object({
    id: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    name: z.string(),
    url: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    name: z.string(),
    url: z.string(),
    ticker: z.string(),
  }),
  z.object({
    name: z.string(),
    url: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    name: z.string(),
    url: z.string(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    name: z.string(),
    ticker: z.string(),
  }),
  z.object({
    name: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    url: z.string(),
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    url: z.string(),
    ticker: z.string(),
  }),
  z.object({
    url: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    url: z.string(),
  }),
  z.object({
    ticker: z.string(),
    tokenId: z.bigint(),
  }),
  z.object({
    ticker: z.string(),
  }),
  z.object({
    tokenId: z.bigint(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  url: z.string().optional(),
  ticker: z.string().optional(),
  tokenId: z.bigint().optional(),
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
  platform: z.union([ z.lazy(() => EnumDaoPlatformFilterSchema),z.lazy(() => DaoPlatformSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoTokenInfoScalarRelationFilterSchema),z.lazy(() => DaoTokenInfoWhereInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageListRelationFilterSchema).optional(),
  stars: z.lazy(() => DaoStarListRelationFilterSchema).optional(),
  pocs: z.lazy(() => POCListRelationFilterSchema).optional(),
  contents: z.lazy(() => DaoContentListRelationFilterSchema).optional()
}).strict());

export const DaoOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
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
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeWithAggregatesFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  links: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusWithAggregatesFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  platform: z.union([ z.lazy(() => EnumDaoPlatformWithAggregatesFilterSchema),z.lazy(() => DaoPlatformSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoContentWhereInputSchema: z.ZodType<Prisma.DaoContentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoContentWhereInputSchema),z.lazy(() => DaoContentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoContentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoContentWhereInputSchema),z.lazy(() => DaoContentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sort: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoContentTypeFilterSchema),z.lazy(() => DaoContentTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
}).strict();

export const DaoContentOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoContentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  sort: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional()
}).strict();

export const DaoContentWhereUniqueInputSchema: z.ZodType<Prisma.DaoContentWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    daoId_sort: z.lazy(() => DaoContentDaoIdSortCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    daoId_sort: z.lazy(() => DaoContentDaoIdSortCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().optional(),
  daoId_sort: z.lazy(() => DaoContentDaoIdSortCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => DaoContentWhereInputSchema),z.lazy(() => DaoContentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoContentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoContentWhereInputSchema),z.lazy(() => DaoContentWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sort: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoContentTypeFilterSchema),z.lazy(() => DaoContentTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
}).strict());

export const DaoContentOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoContentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  sort: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DaoContentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DaoContentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoContentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoContentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DaoContentSumOrderByAggregateInputSchema).optional()
}).strict();

export const DaoContentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoContentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoContentScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoContentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoContentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoContentScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoContentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  sort: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoContentTypeWithAggregatesFilterSchema),z.lazy(() => DaoContentTypeSchema) ]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DaoTokenHolderWhereInputSchema: z.ZodType<Prisma.DaoTokenHolderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoTokenInfoScalarRelationFilterSchema),z.lazy(() => DaoTokenInfoWhereInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoTokenHolderOrderByWithRelationInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoOrderByWithRelationInputSchema).optional()
}).strict();

export const DaoTokenHolderWhereUniqueInputSchema: z.ZodType<Prisma.DaoTokenHolderWhereUniqueInput> = z.object({
  userAddress_tokenId: z.lazy(() => DaoTokenHolderUserAddressTokenIdCompoundUniqueInputSchema)
})
.and(z.object({
  userAddress_tokenId: z.lazy(() => DaoTokenHolderUserAddressTokenIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenHolderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenHolderWhereInputSchema),z.lazy(() => DaoTokenHolderWhereInputSchema).array() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  tokenInfo: z.union([ z.lazy(() => DaoTokenInfoScalarRelationFilterSchema),z.lazy(() => DaoTokenInfoWhereInputSchema) ]).optional(),
}).strict());

export const DaoTokenHolderOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoTokenHolderOrderByWithAggregationInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
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
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  balance: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoTokenInfoWhereInputSchema: z.ZodType<Prisma.DaoTokenInfoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenInfoWhereInputSchema),z.lazy(() => DaoTokenInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenInfoWhereInputSchema),z.lazy(() => DaoTokenInfoWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradingonuniswap: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  uniswapV3Pair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoNullableScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderListRelationFilterSchema).optional()
}).strict();

export const DaoTokenInfoOrderByWithRelationInputSchema: z.ZodType<Prisma.DaoTokenInfoOrderByWithRelationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingonuniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const DaoTokenInfoWhereUniqueInputSchema: z.ZodType<Prisma.DaoTokenInfoWhereUniqueInput> = z.object({
  tokenId: z.bigint()
})
.and(z.object({
  tokenId: z.bigint().optional(),
  AND: z.union([ z.lazy(() => DaoTokenInfoWhereInputSchema),z.lazy(() => DaoTokenInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenInfoWhereInputSchema),z.lazy(() => DaoTokenInfoWhereInputSchema).array() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradingonuniswap: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  uniswapV3Pair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  dao: z.union([ z.lazy(() => DaoNullableScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderListRelationFilterSchema).optional()
}).strict());

export const DaoTokenInfoOrderByWithAggregationInputSchema: z.ZodType<Prisma.DaoTokenInfoOrderByWithAggregationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingonuniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => DaoTokenInfoCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DaoTokenInfoAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DaoTokenInfoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DaoTokenInfoMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DaoTokenInfoSumOrderByAggregateInputSchema).optional()
}).strict();

export const DaoTokenInfoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DaoTokenInfoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DaoTokenInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoTokenInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoTokenInfoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoTokenInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => DaoTokenInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  creator: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  marketCap: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  totalSupply: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  holderCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tradingonuniswap: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  uniswapV3Pair: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AssetTokenWhereInputSchema: z.ZodType<Prisma.AssetTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  chainId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isNative: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const AssetTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.AssetTokenOrderByWithRelationInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  isNative: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenWhereUniqueInputSchema: z.ZodType<Prisma.AssetTokenWhereUniqueInput> = z.object({
  chainId_address: z.lazy(() => AssetTokenChainIdAddressCompoundUniqueInputSchema)
})
.and(z.object({
  chainId_address: z.lazy(() => AssetTokenChainIdAddressCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  chainId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isNative: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict());

export const AssetTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.AssetTokenOrderByWithAggregationInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  isNative: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AssetTokenCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AssetTokenAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AssetTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AssetTokenMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AssetTokenSumOrderByAggregateInputSchema).optional()
}).strict();

export const AssetTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AssetTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AssetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => AssetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => AssetTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  chainId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isNative: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
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

export const POCWhereInputSchema: z.ZodType<Prisma.POCWhereInput> = z.object({
  AND: z.union([ z.lazy(() => POCWhereInputSchema),z.lazy(() => POCWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCWhereInputSchema),z.lazy(() => POCWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => POCHistoryListRelationFilterSchema).optional()
}).strict();

export const POCOrderByWithRelationInputSchema: z.ZodType<Prisma.POCOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformUrl: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  histories: z.lazy(() => POCHistoryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const POCWhereUniqueInputSchema: z.ZodType<Prisma.POCWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => POCWhereInputSchema),z.lazy(() => POCWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCWhereInputSchema),z.lazy(() => POCWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => POCHistoryListRelationFilterSchema).optional()
}).strict());

export const POCOrderByWithAggregationInputSchema: z.ZodType<Prisma.POCOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformUrl: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => POCCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => POCAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => POCMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => POCMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => POCSumOrderByAggregateInputSchema).optional()
}).strict();

export const POCScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.POCScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => POCScalarWhereWithAggregatesInputSchema),z.lazy(() => POCScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCScalarWhereWithAggregatesInputSchema),z.lazy(() => POCScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPlatformUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const POCHistoryWhereInputSchema: z.ZodType<Prisma.POCHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => POCHistoryWhereInputSchema),z.lazy(() => POCHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCHistoryWhereInputSchema),z.lazy(() => POCHistoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  pocId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  poc: z.union([ z.lazy(() => POCScalarRelationFilterSchema),z.lazy(() => POCWhereInputSchema) ]).optional(),
}).strict();

export const POCHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.POCHistoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  pocId: z.lazy(() => SortOrderSchema).optional(),
  poc: z.lazy(() => POCOrderByWithRelationInputSchema).optional()
}).strict();

export const POCHistoryWhereUniqueInputSchema: z.ZodType<Prisma.POCHistoryWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => POCHistoryWhereInputSchema),z.lazy(() => POCHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCHistoryWhereInputSchema),z.lazy(() => POCHistoryWhereInputSchema).array() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  pocId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  poc: z.union([ z.lazy(() => POCScalarRelationFilterSchema),z.lazy(() => POCWhereInputSchema) ]).optional(),
}).strict());

export const POCHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.POCHistoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  pocId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => POCHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => POCHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => POCHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => POCHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => POCHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const POCHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.POCHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => POCHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => POCHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => POCHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  pocId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
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
  contributions: z.lazy(() => POCCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => POCUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateInputSchema: z.ZodType<Prisma.DaoUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUpdateInputSchema: z.ZodType<Prisma.DaoUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoCreateManyInputSchema: z.ZodType<Prisma.DaoCreateManyInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const DaoUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentCreateInputSchema: z.ZodType<Prisma.DaoContentCreateInput> = z.object({
  id: z.string().optional(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContentsInputSchema)
}).strict();

export const DaoContentUncheckedCreateInputSchema: z.ZodType<Prisma.DaoContentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DaoContentUpdateInputSchema: z.ZodType<Prisma.DaoContentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContentsNestedInputSchema).optional()
}).strict();

export const DaoContentUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoContentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentCreateManyInputSchema: z.ZodType<Prisma.DaoContentCreateManyInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DaoContentUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoContentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoContentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateInput> = z.object({
  userAddress: z.string(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutHoldersInputSchema)
}).strict();

export const DaoTokenHolderUncheckedCreateInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateInput> = z.object({
  userAddress: z.string(),
  tokenId: z.bigint(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutHoldersNestedInputSchema).optional()
}).strict();

export const DaoTokenHolderUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateManyInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyInput> = z.object({
  userAddress: z.string(),
  tokenId: z.bigint(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateManyMutationInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateManyInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenInfoCreateInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutTokenInfoInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedCreateInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedCreateInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoUncheckedCreateNestedOneWithoutTokenInfoInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUpdateInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneWithoutTokenInfoNestedInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedUpdateInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUncheckedUpdateOneWithoutTokenInfoNestedInputSchema).optional(),
  holders: z.lazy(() => DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoCreateManyInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateManyInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable()
}).strict();

export const DaoTokenInfoUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DaoTokenInfoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssetTokenCreateInputSchema: z.ZodType<Prisma.AssetTokenCreateInput> = z.object({
  chainId: z.number().int(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.bigint().optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUncheckedCreateInputSchema: z.ZodType<Prisma.AssetTokenUncheckedCreateInput> = z.object({
  chainId: z.number().int(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.bigint().optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUpdateInputSchema: z.ZodType<Prisma.AssetTokenUpdateInput> = z.object({
  chainId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.AssetTokenUncheckedUpdateInput> = z.object({
  chainId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenCreateManyInputSchema: z.ZodType<Prisma.AssetTokenCreateManyInput> = z.object({
  chainId: z.number().int(),
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.bigint().optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.AssetTokenUpdateManyMutationInput> = z.object({
  chainId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AssetTokenUncheckedUpdateManyInput> = z.object({
  chainId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
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

export const POCCreateInputSchema: z.ZodType<Prisma.POCCreateInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutPocsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => POCHistoryCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCUncheckedCreateInputSchema: z.ZodType<Prisma.POCUncheckedCreateInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => POCHistoryUncheckedCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCUpdateInputSchema: z.ZodType<Prisma.POCUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutPocsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => POCHistoryUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateInputSchema: z.ZodType<Prisma.POCUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => POCHistoryUncheckedUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCCreateManyInputSchema: z.ZodType<Prisma.POCCreateManyInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const POCUpdateManyMutationInputSchema: z.ZodType<Prisma.POCUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCUncheckedUpdateManyInputSchema: z.ZodType<Prisma.POCUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryCreateInputSchema: z.ZodType<Prisma.POCHistoryCreateInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  poc: z.lazy(() => POCCreateNestedOneWithoutHistoriesInputSchema)
}).strict();

export const POCHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.POCHistoryUncheckedCreateInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  pocId: z.string()
}).strict();

export const POCHistoryUpdateInputSchema: z.ZodType<Prisma.POCHistoryUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  poc: z.lazy(() => POCUpdateOneRequiredWithoutHistoriesNestedInputSchema).optional()
}).strict();

export const POCHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.POCHistoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pocId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryCreateManyInputSchema: z.ZodType<Prisma.POCHistoryCreateManyInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  pocId: z.string()
}).strict();

export const POCHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.POCHistoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.POCHistoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  pocId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const POCListRelationFilterSchema: z.ZodType<Prisma.POCListRelationFilter> = z.object({
  every: z.lazy(() => POCWhereInputSchema).optional(),
  some: z.lazy(() => POCWhereInputSchema).optional(),
  none: z.lazy(() => POCWhereInputSchema).optional()
}).strict();

export const DaoStarOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoStarOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCOrderByRelationAggregateInputSchema: z.ZodType<Prisma.POCOrderByRelationAggregateInput> = z.object({
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

export const EnumDaoPlatformFilterSchema: z.ZodType<Prisma.EnumDaoPlatformFilter> = z.object({
  equals: z.lazy(() => DaoPlatformSchema).optional(),
  in: z.lazy(() => DaoPlatformSchema).array().optional(),
  notIn: z.lazy(() => DaoPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => NestedEnumDaoPlatformFilterSchema) ]).optional(),
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

export const DaoTokenInfoScalarRelationFilterSchema: z.ZodType<Prisma.DaoTokenInfoScalarRelationFilter> = z.object({
  is: z.lazy(() => DaoTokenInfoWhereInputSchema).optional(),
  isNot: z.lazy(() => DaoTokenInfoWhereInputSchema).optional()
}).strict();

export const ForumMessageListRelationFilterSchema: z.ZodType<Prisma.ForumMessageListRelationFilter> = z.object({
  every: z.lazy(() => ForumMessageWhereInputSchema).optional(),
  some: z.lazy(() => ForumMessageWhereInputSchema).optional(),
  none: z.lazy(() => ForumMessageWhereInputSchema).optional()
}).strict();

export const DaoContentListRelationFilterSchema: z.ZodType<Prisma.DaoContentListRelationFilter> = z.object({
  every: z.lazy(() => DaoContentWhereInputSchema).optional(),
  some: z.lazy(() => DaoContentWhereInputSchema).optional(),
  none: z.lazy(() => DaoContentWhereInputSchema).optional()
}).strict();

export const ForumMessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ForumMessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoContentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoContentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  links: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  avatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  platform: z.lazy(() => SortOrderSchema).optional(),
  marketCapUsd: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
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

export const EnumDaoPlatformWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDaoPlatformWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoPlatformSchema).optional(),
  in: z.lazy(() => DaoPlatformSchema).array().optional(),
  notIn: z.lazy(() => DaoPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => NestedEnumDaoPlatformWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoPlatformFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoPlatformFilterSchema).optional()
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

export const EnumDaoContentTypeFilterSchema: z.ZodType<Prisma.EnumDaoContentTypeFilter> = z.object({
  equals: z.lazy(() => DaoContentTypeSchema).optional(),
  in: z.lazy(() => DaoContentTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => NestedEnumDaoContentTypeFilterSchema) ]).optional(),
}).strict();

export const DaoContentDaoIdSortCompoundUniqueInputSchema: z.ZodType<Prisma.DaoContentDaoIdSortCompoundUniqueInput> = z.object({
  daoId: z.string(),
  sort: z.number()
}).strict();

export const DaoContentCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoContentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  sort: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoContentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoContentAvgOrderByAggregateInput> = z.object({
  sort: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoContentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoContentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  sort: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoContentMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoContentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  sort: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoContentSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoContentSumOrderByAggregateInput> = z.object({
  sort: z.lazy(() => SortOrderSchema).optional()
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

export const EnumDaoContentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDaoContentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoContentTypeSchema).optional(),
  in: z.lazy(() => DaoContentTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => NestedEnumDaoContentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoContentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoContentTypeFilterSchema).optional()
}).strict();

export const DaoTokenHolderUserAddressTokenIdCompoundUniqueInputSchema: z.ZodType<Prisma.DaoTokenHolderUserAddressTokenIdCompoundUniqueInput> = z.object({
  userAddress: z.string(),
  tokenId: z.bigint()
}).strict();

export const DaoTokenHolderCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderCountOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderMaxOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderMinOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenHolderSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenHolderSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
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

export const DaoTokenInfoCountOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoCountOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingonuniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingonuniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  tradingonuniswap: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const AssetTokenChainIdAddressCompoundUniqueInputSchema: z.ZodType<Prisma.AssetTokenChainIdAddressCompoundUniqueInput> = z.object({
  chainId: z.number(),
  address: z.string()
}).strict();

export const AssetTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenCountOrderByAggregateInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  isNative: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenAvgOrderByAggregateInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenMaxOrderByAggregateInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  isNative: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenMinOrderByAggregateInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  isNative: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenSumOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenSumOrderByAggregateInput> = z.object({
  chainId: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
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

export const POCHistoryListRelationFilterSchema: z.ZodType<Prisma.POCHistoryListRelationFilter> = z.object({
  every: z.lazy(() => POCHistoryWhereInputSchema).optional(),
  some: z.lazy(() => POCHistoryWhereInputSchema).optional(),
  none: z.lazy(() => POCHistoryWhereInputSchema).optional()
}).strict();

export const POCHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.POCHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCCountOrderByAggregateInputSchema: z.ZodType<Prisma.POCCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformUrl: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCAvgOrderByAggregateInputSchema: z.ZodType<Prisma.POCAvgOrderByAggregateInput> = z.object({
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCMaxOrderByAggregateInputSchema: z.ZodType<Prisma.POCMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformUrl: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCMinOrderByAggregateInputSchema: z.ZodType<Prisma.POCMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformUrl: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCSumOrderByAggregateInputSchema: z.ZodType<Prisma.POCSumOrderByAggregateInput> = z.object({
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCScalarRelationFilterSchema: z.ZodType<Prisma.POCScalarRelationFilter> = z.object({
  is: z.lazy(() => POCWhereInputSchema).optional(),
  isNot: z.lazy(() => POCWhereInputSchema).optional()
}).strict();

export const POCHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.POCHistoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  pocId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.POCHistoryAvgOrderByAggregateInput> = z.object({
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.POCHistoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  pocId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.POCHistoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  pocId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const POCHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.POCHistorySumOrderByAggregateInput> = z.object({
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

export const POCCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.POCCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCCreateWithoutUserInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutUserInputSchema),z.lazy(() => POCCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
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

export const POCUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.POCUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCCreateWithoutUserInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutUserInputSchema),z.lazy(() => POCCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
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

export const POCUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.POCUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCCreateWithoutUserInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutUserInputSchema),z.lazy(() => POCCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => POCUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => POCUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => POCUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
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

export const POCUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.POCUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCCreateWithoutUserInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutUserInputSchema),z.lazy(() => POCCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => POCUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => POCUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => POCUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
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

export const DaoTokenInfoCreateNestedOneWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateNestedOneWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutDaoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoTokenInfoCreateOrConnectWithoutDaoInputSchema).optional(),
  connect: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema).optional()
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

export const POCCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.POCCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCCreateWithoutDaoInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema),z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoContentCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoContentCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
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

export const POCUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.POCUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCCreateWithoutDaoInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema),z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoContentCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumDaoTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoTypeSchema).optional()
}).strict();

export const EnumDaoStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoStatusSchema).optional()
}).strict();

export const EnumDaoPlatformFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoPlatformFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoPlatformSchema).optional()
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

export const DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutDaoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoTokenInfoCreateOrConnectWithoutDaoInputSchema).optional(),
  upsert: z.lazy(() => DaoTokenInfoUpsertWithoutDaoInputSchema).optional(),
  connect: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoTokenInfoUpdateToOneWithWhereWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutDaoInputSchema) ]).optional(),
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

export const POCUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.POCUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCCreateWithoutDaoInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema),z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => POCUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => POCUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => POCUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoContentUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoContentUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoContentUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoContentUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoContentCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoContentUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoContentUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoContentUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => DaoContentUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoContentScalarWhereInputSchema),z.lazy(() => DaoContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
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

export const POCUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.POCUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCCreateWithoutDaoInputSchema).array(),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema),z.lazy(() => POCCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => POCUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCWhereUniqueInputSchema),z.lazy(() => POCWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => POCUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => POCUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.DaoContentUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentCreateWithoutDaoInputSchema).array(),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema),z.lazy(() => DaoContentCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => DaoContentUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoContentUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoContentCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => DaoContentWhereUniqueInputSchema),z.lazy(() => DaoContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => DaoContentUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => DaoContentUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => DaoContentUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => DaoContentUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => DaoContentScalarWhereInputSchema),z.lazy(() => DaoContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutContentsInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutContentsInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumDaoContentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDaoContentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => DaoContentTypeSchema).optional()
}).strict();

export const DaoUpdateOneRequiredWithoutContentsNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutContentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContentsInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutContentsInputSchema),z.lazy(() => DaoUpdateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContentsInputSchema) ]).optional(),
}).strict();

export const DaoTokenInfoCreateNestedOneWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateNestedOneWithoutHoldersInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoTokenInfoCreateOrConnectWithoutHoldersInputSchema).optional(),
  connect: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema).optional()
}).strict();

export const DaoTokenInfoUpdateOneRequiredWithoutHoldersNestedInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateOneRequiredWithoutHoldersNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoTokenInfoCreateOrConnectWithoutHoldersInputSchema).optional(),
  upsert: z.lazy(() => DaoTokenInfoUpsertWithoutHoldersInputSchema).optional(),
  connect: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoTokenInfoUpdateToOneWithWhereWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutHoldersInputSchema) ]).optional(),
}).strict();

export const DaoCreateNestedOneWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutTokenInfoInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateNestedManyWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUncheckedCreateNestedOneWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUncheckedCreateNestedOneWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutTokenInfoInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInput> = z.object({
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema).array(),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),z.lazy(() => DaoTokenHolderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DaoUpdateOneWithoutTokenInfoNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneWithoutTokenInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutTokenInfoInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutTokenInfoInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutTokenInfoInputSchema),z.lazy(() => DaoUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutTokenInfoInputSchema) ]).optional(),
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

export const DaoUncheckedUpdateOneWithoutTokenInfoNestedInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateOneWithoutTokenInfoNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutTokenInfoInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutTokenInfoInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutTokenInfoInputSchema),z.lazy(() => DaoUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutTokenInfoInputSchema) ]).optional(),
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

export const DaoCreateNestedOneWithoutPocsInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutPocsInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutPocsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutPocsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutContributionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutContributionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContributionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const POCHistoryCreateNestedManyWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryCreateNestedManyWithoutPocInput> = z.object({
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryCreateWithoutPocInputSchema).array(),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema),z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCHistoryCreateManyPocInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const POCHistoryUncheckedCreateNestedManyWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUncheckedCreateNestedManyWithoutPocInput> = z.object({
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryCreateWithoutPocInputSchema).array(),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema),z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCHistoryCreateManyPocInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUpdateOneRequiredWithoutPocsNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutPocsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutPocsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutPocsInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutPocsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutPocsInputSchema),z.lazy(() => DaoUpdateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutPocsInputSchema) ]).optional(),
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

export const POCHistoryUpdateManyWithoutPocNestedInputSchema: z.ZodType<Prisma.POCHistoryUpdateManyWithoutPocNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryCreateWithoutPocInputSchema).array(),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema),z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCHistoryUpsertWithWhereUniqueWithoutPocInputSchema),z.lazy(() => POCHistoryUpsertWithWhereUniqueWithoutPocInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCHistoryCreateManyPocInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCHistoryUpdateWithWhereUniqueWithoutPocInputSchema),z.lazy(() => POCHistoryUpdateWithWhereUniqueWithoutPocInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCHistoryUpdateManyWithWhereWithoutPocInputSchema),z.lazy(() => POCHistoryUpdateManyWithWhereWithoutPocInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCHistoryScalarWhereInputSchema),z.lazy(() => POCHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const POCHistoryUncheckedUpdateManyWithoutPocNestedInputSchema: z.ZodType<Prisma.POCHistoryUncheckedUpdateManyWithoutPocNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryCreateWithoutPocInputSchema).array(),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema),z.lazy(() => POCHistoryCreateOrConnectWithoutPocInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => POCHistoryUpsertWithWhereUniqueWithoutPocInputSchema),z.lazy(() => POCHistoryUpsertWithWhereUniqueWithoutPocInputSchema).array() ]).optional(),
  createMany: z.lazy(() => POCHistoryCreateManyPocInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => POCHistoryWhereUniqueInputSchema),z.lazy(() => POCHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => POCHistoryUpdateWithWhereUniqueWithoutPocInputSchema),z.lazy(() => POCHistoryUpdateWithWhereUniqueWithoutPocInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => POCHistoryUpdateManyWithWhereWithoutPocInputSchema),z.lazy(() => POCHistoryUpdateManyWithWhereWithoutPocInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => POCHistoryScalarWhereInputSchema),z.lazy(() => POCHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const POCCreateNestedOneWithoutHistoriesInputSchema: z.ZodType<Prisma.POCCreateNestedOneWithoutHistoriesInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => POCCreateOrConnectWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => POCWhereUniqueInputSchema).optional()
}).strict();

export const POCUpdateOneRequiredWithoutHistoriesNestedInputSchema: z.ZodType<Prisma.POCUpdateOneRequiredWithoutHistoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => POCCreateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => POCCreateOrConnectWithoutHistoriesInputSchema).optional(),
  upsert: z.lazy(() => POCUpsertWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => POCWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => POCUpdateToOneWithWhereWithoutHistoriesInputSchema),z.lazy(() => POCUpdateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedUpdateWithoutHistoriesInputSchema) ]).optional(),
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

export const NestedEnumDaoStatusFilterSchema: z.ZodType<Prisma.NestedEnumDaoStatusFilter> = z.object({
  equals: z.lazy(() => DaoStatusSchema).optional(),
  in: z.lazy(() => DaoStatusSchema).array().optional(),
  notIn: z.lazy(() => DaoStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => NestedEnumDaoStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumDaoPlatformFilterSchema: z.ZodType<Prisma.NestedEnumDaoPlatformFilter> = z.object({
  equals: z.lazy(() => DaoPlatformSchema).optional(),
  in: z.lazy(() => DaoPlatformSchema).array().optional(),
  notIn: z.lazy(() => DaoPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => NestedEnumDaoPlatformFilterSchema) ]).optional(),
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

export const NestedEnumDaoPlatformWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDaoPlatformWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoPlatformSchema).optional(),
  in: z.lazy(() => DaoPlatformSchema).array().optional(),
  notIn: z.lazy(() => DaoPlatformSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => NestedEnumDaoPlatformWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoPlatformFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoPlatformFilterSchema).optional()
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

export const NestedEnumDaoContentTypeFilterSchema: z.ZodType<Prisma.NestedEnumDaoContentTypeFilter> = z.object({
  equals: z.lazy(() => DaoContentTypeSchema).optional(),
  in: z.lazy(() => DaoContentTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => NestedEnumDaoContentTypeFilterSchema) ]).optional(),
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

export const NestedEnumDaoContentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDaoContentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => DaoContentTypeSchema).optional(),
  in: z.lazy(() => DaoContentTypeSchema).array().optional(),
  notIn: z.lazy(() => DaoContentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => NestedEnumDaoContentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDaoContentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDaoContentTypeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
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
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutCreatorInputSchema),z.lazy(() => DaoUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const DaoCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.DaoCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoCreateManyCreatorInputSchema),z.lazy(() => DaoCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const POCCreateWithoutUserInputSchema: z.ZodType<Prisma.POCCreateWithoutUserInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutPocsInputSchema),
  histories: z.lazy(() => POCHistoryCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.POCUncheckedCreateWithoutUserInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => POCHistoryUncheckedCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.POCCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const POCCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.POCCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => POCCreateManyUserInputSchema),z.lazy(() => POCCreateManyUserInputSchema).array() ]),
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
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ticker: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoTypeFilterSchema),z.lazy(() => DaoTypeSchema) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  links: z.lazy(() => JsonFilterSchema).optional(),
  status: z.union([ z.lazy(() => EnumDaoStatusFilterSchema),z.lazy(() => DaoStatusSchema) ]).optional(),
  platform: z.union([ z.lazy(() => EnumDaoPlatformFilterSchema),z.lazy(() => DaoPlatformSchema) ]).optional(),
  marketCapUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const POCUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.POCUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => POCUpdateWithoutUserInputSchema),z.lazy(() => POCUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => POCCreateWithoutUserInputSchema),z.lazy(() => POCUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const POCUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.POCUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => POCUpdateWithoutUserInputSchema),z.lazy(() => POCUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const POCUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.POCUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => POCScalarWhereInputSchema),
  data: z.union([ z.lazy(() => POCUpdateManyMutationInputSchema),z.lazy(() => POCUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const POCScalarWhereInputSchema: z.ZodType<Prisma.POCScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCScalarWhereInputSchema),z.lazy(() => POCScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoCreateWithoutStarsInputSchema: z.ZodType<Prisma.DaoCreateWithoutStarsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutStarsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutStarsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
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
  contributions: z.lazy(() => POCCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutStarsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutStarsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
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
  contributions: z.lazy(() => POCUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => POCCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutDaosInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDaosInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutDaosInputSchema),z.lazy(() => UserUncheckedCreateWithoutDaosInputSchema) ]),
}).strict();

export const DaoTokenInfoCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateWithoutDaoInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedCreateWithoutDaoInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUncheckedCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutDaoInputSchema) ]),
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

export const POCCreateWithoutDaoInputSchema: z.ZodType<Prisma.POCCreateWithoutDaoInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => POCHistoryCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.POCUncheckedCreateWithoutDaoInput> = z.object({
  id: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => POCHistoryUncheckedCreateNestedManyWithoutPocInputSchema).optional()
}).strict();

export const POCCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.POCCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const POCCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.POCCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => POCCreateManyDaoInputSchema),z.lazy(() => POCCreateManyDaoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoContentCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DaoContentUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUncheckedCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const DaoContentCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoContentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const DaoContentCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.DaoContentCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoContentCreateManyDaoInputSchema),z.lazy(() => DaoContentCreateManyDaoInputSchema).array() ]),
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
  contributions: z.lazy(() => POCUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => POCUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUpsertWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUpsertWithoutDaoInput> = z.object({
  update: z.union([ z.lazy(() => DaoTokenInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutDaoInputSchema) ]),
  where: z.lazy(() => DaoTokenInfoWhereInputSchema).optional()
}).strict();

export const DaoTokenInfoUpdateToOneWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateToOneWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoTokenInfoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoTokenInfoUpdateWithoutDaoInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const DaoTokenInfoUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateWithoutDaoInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateWithoutDaoInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const POCUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.POCUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => POCUpdateWithoutDaoInputSchema),z.lazy(() => POCUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => POCCreateWithoutDaoInputSchema),z.lazy(() => POCUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const POCUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.POCUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => POCUpdateWithoutDaoInputSchema),z.lazy(() => POCUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const POCUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.POCUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => POCScalarWhereInputSchema),
  data: z.union([ z.lazy(() => POCUpdateManyMutationInputSchema),z.lazy(() => POCUncheckedUpdateManyWithoutDaoInputSchema) ]),
}).strict();

export const DaoContentUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoContentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => DaoContentUpdateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoContentCreateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const DaoContentUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoContentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => DaoContentUpdateWithoutDaoInputSchema),z.lazy(() => DaoContentUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const DaoContentUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => DaoContentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => DaoContentUpdateManyMutationInputSchema),z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoInputSchema) ]),
}).strict();

export const DaoContentScalarWhereInputSchema: z.ZodType<Prisma.DaoContentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DaoContentScalarWhereInputSchema),z.lazy(() => DaoContentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DaoContentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DaoContentScalarWhereInputSchema),z.lazy(() => DaoContentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sort: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumDaoContentTypeFilterSchema),z.lazy(() => DaoContentTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const DaoCreateWithoutContentsInputSchema: z.ZodType<Prisma.DaoCreateWithoutContentsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutContentsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutContentsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutContentsInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutContentsInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContentsInputSchema) ]),
}).strict();

export const DaoUpsertWithoutContentsInputSchema: z.ZodType<Prisma.DaoUpsertWithoutContentsInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContentsInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContentsInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutContentsInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutContentsInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutContentsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContentsInputSchema) ]),
}).strict();

export const DaoUpdateWithoutContentsInputSchema: z.ZodType<Prisma.DaoUpdateWithoutContentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutContentsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutContentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateWithoutHoldersInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedCreateWithoutHoldersInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  createdAt: z.bigint().optional(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional(),
  tradingonuniswap: z.boolean().optional(),
  uniswapV3Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoUncheckedCreateNestedOneWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoCreateOrConnectWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateOrConnectWithoutHoldersInput> = z.object({
  where: z.lazy(() => DaoTokenInfoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema) ]),
}).strict();

export const DaoTokenInfoUpsertWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUpsertWithoutHoldersInput> = z.object({
  update: z.union([ z.lazy(() => DaoTokenInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutHoldersInputSchema) ]),
  create: z.union([ z.lazy(() => DaoTokenInfoCreateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema) ]),
  where: z.lazy(() => DaoTokenInfoWhereInputSchema).optional()
}).strict();

export const DaoTokenInfoUpdateToOneWithWhereWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateToOneWithWhereWithoutHoldersInput> = z.object({
  where: z.lazy(() => DaoTokenInfoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoTokenInfoUpdateWithoutHoldersInputSchema),z.lazy(() => DaoTokenInfoUncheckedUpdateWithoutHoldersInputSchema) ]),
}).strict();

export const DaoTokenInfoUpdateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateWithoutHoldersInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedUpdateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateWithoutHoldersInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradingonuniswap: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUncheckedUpdateOneWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoCreateWithoutTokenInfoInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutTokenInfoInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateWithoutTokenInfoInput> = z.object({
  userAddress: z.string(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedCreateWithoutTokenInfoInput> = z.object({
  userAddress: z.string(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderCreateOrConnectWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateOrConnectWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoTokenHolderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoTokenHolderCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoTokenHolderUncheckedCreateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoTokenHolderCreateManyTokenInfoInputEnvelopeSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyTokenInfoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputSchema),z.lazy(() => DaoTokenHolderCreateManyTokenInfoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoUpsertWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUpsertWithoutTokenInfoInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutTokenInfoInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedCreateWithoutTokenInfoInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutTokenInfoInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutTokenInfoInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutTokenInfoInputSchema) ]),
}).strict();

export const DaoUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUpdateWithoutTokenInfoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutTokenInfoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
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
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const DaoCreateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutMessagesInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
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
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutMessagesInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoCreateWithoutPocsInputSchema: z.ZodType<Prisma.DaoCreateWithoutPocsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutDaosInputSchema),
  tokenInfo: z.lazy(() => DaoTokenInfoCreateNestedOneWithoutDaoInputSchema),
  messages: z.lazy(() => ForumMessageCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoUncheckedCreateWithoutPocsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutPocsInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  createdBy: z.string(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  messages: z.lazy(() => ForumMessageUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
}).strict();

export const DaoCreateOrConnectWithoutPocsInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutPocsInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutPocsInputSchema) ]),
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

export const POCHistoryCreateWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryCreateWithoutPocInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const POCHistoryUncheckedCreateWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUncheckedCreateWithoutPocInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const POCHistoryCreateOrConnectWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryCreateOrConnectWithoutPocInput> = z.object({
  where: z.lazy(() => POCHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema) ]),
}).strict();

export const POCHistoryCreateManyPocInputEnvelopeSchema: z.ZodType<Prisma.POCHistoryCreateManyPocInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => POCHistoryCreateManyPocInputSchema),z.lazy(() => POCHistoryCreateManyPocInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoUpsertWithoutPocsInputSchema: z.ZodType<Prisma.DaoUpsertWithoutPocsInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutPocsInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutPocsInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutPocsInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutPocsInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutPocsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutPocsInputSchema) ]),
}).strict();

export const DaoUpdateWithoutPocsInputSchema: z.ZodType<Prisma.DaoUpdateWithoutPocsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutDaosNestedInputSchema).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutPocsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutPocsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
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

export const POCHistoryUpsertWithWhereUniqueWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUpsertWithWhereUniqueWithoutPocInput> = z.object({
  where: z.lazy(() => POCHistoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => POCHistoryUpdateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedUpdateWithoutPocInputSchema) ]),
  create: z.union([ z.lazy(() => POCHistoryCreateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedCreateWithoutPocInputSchema) ]),
}).strict();

export const POCHistoryUpdateWithWhereUniqueWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUpdateWithWhereUniqueWithoutPocInput> = z.object({
  where: z.lazy(() => POCHistoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => POCHistoryUpdateWithoutPocInputSchema),z.lazy(() => POCHistoryUncheckedUpdateWithoutPocInputSchema) ]),
}).strict();

export const POCHistoryUpdateManyWithWhereWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUpdateManyWithWhereWithoutPocInput> = z.object({
  where: z.lazy(() => POCHistoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => POCHistoryUpdateManyMutationInputSchema),z.lazy(() => POCHistoryUncheckedUpdateManyWithoutPocInputSchema) ]),
}).strict();

export const POCHistoryScalarWhereInputSchema: z.ZodType<Prisma.POCHistoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => POCHistoryScalarWhereInputSchema),z.lazy(() => POCHistoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => POCHistoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => POCHistoryScalarWhereInputSchema),z.lazy(() => POCHistoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  pocId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const POCCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.POCCreateWithoutHistoriesInput> = z.object({
  id: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutPocsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional()
}).strict();

export const POCUncheckedCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.POCUncheckedCreateWithoutHistoriesInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const POCCreateOrConnectWithoutHistoriesInputSchema: z.ZodType<Prisma.POCCreateOrConnectWithoutHistoriesInput> = z.object({
  where: z.lazy(() => POCWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => POCCreateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedCreateWithoutHistoriesInputSchema) ]),
}).strict();

export const POCUpsertWithoutHistoriesInputSchema: z.ZodType<Prisma.POCUpsertWithoutHistoriesInput> = z.object({
  update: z.union([ z.lazy(() => POCUpdateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedUpdateWithoutHistoriesInputSchema) ]),
  create: z.union([ z.lazy(() => POCCreateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedCreateWithoutHistoriesInputSchema) ]),
  where: z.lazy(() => POCWhereInputSchema).optional()
}).strict();

export const POCUpdateToOneWithWhereWithoutHistoriesInputSchema: z.ZodType<Prisma.POCUpdateToOneWithWhereWithoutHistoriesInput> = z.object({
  where: z.lazy(() => POCWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => POCUpdateWithoutHistoriesInputSchema),z.lazy(() => POCUncheckedUpdateWithoutHistoriesInputSchema) ]),
}).strict();

export const POCUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.POCUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutPocsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.POCUncheckedUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoStarCreateManyUserInputSchema: z.ZodType<Prisma.DaoStarCreateManyUserInput> = z.object({
  daoId: z.string()
}).strict();

export const DaoCreateManyCreatorInputSchema: z.ZodType<Prisma.DaoCreateManyCreatorInput> = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  ticker: z.string(),
  type: z.lazy(() => DaoTypeSchema),
  description: z.string(),
  avatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tokenId: z.bigint(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.lazy(() => DaoStatusSchema).optional(),
  platform: z.lazy(() => DaoPlatformSchema).optional(),
  marketCapUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const POCCreateManyUserInputSchema: z.ZodType<Prisma.POCCreateManyUserInput> = z.object({
  id: z.string(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
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
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  tokenInfo: z.lazy(() => DaoTokenInfoUpdateOneRequiredWithoutDaoNestedInputSchema).optional(),
  messages: z.lazy(() => ForumMessageUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  messages: z.lazy(() => ForumMessageUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  stars: z.lazy(() => DaoStarUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  pocs: z.lazy(() => POCUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoTypeSchema),z.lazy(() => EnumDaoTypeFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  links: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.lazy(() => DaoStatusSchema),z.lazy(() => EnumDaoStatusFieldUpdateOperationsInputSchema) ]).optional(),
  platform: z.union([ z.lazy(() => DaoPlatformSchema),z.lazy(() => EnumDaoPlatformFieldUpdateOperationsInputSchema) ]).optional(),
  marketCapUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCUpdateWithoutUserInputSchema: z.ZodType<Prisma.POCUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutPocsNestedInputSchema).optional(),
  histories: z.lazy(() => POCHistoryUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.POCUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => POCHistoryUncheckedUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.POCUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
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

export const POCCreateManyDaoInputSchema: z.ZodType<Prisma.POCCreateManyDaoInput> = z.object({
  id: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformUrl: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const DaoContentCreateManyDaoInputSchema: z.ZodType<Prisma.DaoContentCreateManyDaoInput> = z.object({
  id: z.string().optional(),
  sort: z.number().int(),
  title: z.string(),
  type: z.lazy(() => DaoContentTypeSchema).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
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

export const POCUpdateWithoutDaoInputSchema: z.ZodType<Prisma.POCUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => POCHistoryUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.POCUncheckedUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => POCHistoryUncheckedUpdateManyWithoutPocNestedInputSchema).optional()
}).strict();

export const POCUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.POCUncheckedUpdateManyWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUncheckedUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoContentUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.DaoContentUncheckedUpdateManyWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sort: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => DaoContentTypeSchema),z.lazy(() => EnumDaoContentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderCreateManyTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderCreateManyTokenInfoInput> = z.object({
  userAddress: z.string(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const DaoTokenHolderUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUpdateWithoutTokenInfoInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateWithoutTokenInfoInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoInputSchema: z.ZodType<Prisma.DaoTokenHolderUncheckedUpdateManyWithoutTokenInfoInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryCreateManyPocInputSchema: z.ZodType<Prisma.POCHistoryCreateManyPocInput> = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const POCHistoryUpdateWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUpdateWithoutPocInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryUncheckedUpdateWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUncheckedUpdateWithoutPocInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const POCHistoryUncheckedUpdateManyWithoutPocInputSchema: z.ZodType<Prisma.POCHistoryUncheckedUpdateManyWithoutPocInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const DaoContentFindFirstArgsSchema: z.ZodType<Prisma.DaoContentFindFirstArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereInputSchema.optional(),
  orderBy: z.union([ DaoContentOrderByWithRelationInputSchema.array(),DaoContentOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoContentScalarFieldEnumSchema,DaoContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoContentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoContentFindFirstOrThrowArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereInputSchema.optional(),
  orderBy: z.union([ DaoContentOrderByWithRelationInputSchema.array(),DaoContentOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoContentScalarFieldEnumSchema,DaoContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoContentFindManyArgsSchema: z.ZodType<Prisma.DaoContentFindManyArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereInputSchema.optional(),
  orderBy: z.union([ DaoContentOrderByWithRelationInputSchema.array(),DaoContentOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoContentScalarFieldEnumSchema,DaoContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoContentAggregateArgsSchema: z.ZodType<Prisma.DaoContentAggregateArgs> = z.object({
  where: DaoContentWhereInputSchema.optional(),
  orderBy: z.union([ DaoContentOrderByWithRelationInputSchema.array(),DaoContentOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoContentGroupByArgsSchema: z.ZodType<Prisma.DaoContentGroupByArgs> = z.object({
  where: DaoContentWhereInputSchema.optional(),
  orderBy: z.union([ DaoContentOrderByWithAggregationInputSchema.array(),DaoContentOrderByWithAggregationInputSchema ]).optional(),
  by: DaoContentScalarFieldEnumSchema.array(),
  having: DaoContentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoContentFindUniqueArgsSchema: z.ZodType<Prisma.DaoContentFindUniqueArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereUniqueInputSchema,
}).strict() ;

export const DaoContentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoContentFindUniqueOrThrowArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereUniqueInputSchema,
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

export const DaoTokenInfoFindFirstArgsSchema: z.ZodType<Prisma.DaoTokenInfoFindFirstArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenInfoOrderByWithRelationInputSchema.array(),DaoTokenInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenInfoScalarFieldEnumSchema,DaoTokenInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenInfoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DaoTokenInfoFindFirstOrThrowArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenInfoOrderByWithRelationInputSchema.array(),DaoTokenInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenInfoScalarFieldEnumSchema,DaoTokenInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenInfoFindManyArgsSchema: z.ZodType<Prisma.DaoTokenInfoFindManyArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenInfoOrderByWithRelationInputSchema.array(),DaoTokenInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DaoTokenInfoScalarFieldEnumSchema,DaoTokenInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DaoTokenInfoAggregateArgsSchema: z.ZodType<Prisma.DaoTokenInfoAggregateArgs> = z.object({
  where: DaoTokenInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenInfoOrderByWithRelationInputSchema.array(),DaoTokenInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: DaoTokenInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoTokenInfoGroupByArgsSchema: z.ZodType<Prisma.DaoTokenInfoGroupByArgs> = z.object({
  where: DaoTokenInfoWhereInputSchema.optional(),
  orderBy: z.union([ DaoTokenInfoOrderByWithAggregationInputSchema.array(),DaoTokenInfoOrderByWithAggregationInputSchema ]).optional(),
  by: DaoTokenInfoScalarFieldEnumSchema.array(),
  having: DaoTokenInfoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DaoTokenInfoFindUniqueArgsSchema: z.ZodType<Prisma.DaoTokenInfoFindUniqueArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenInfoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DaoTokenInfoFindUniqueOrThrowArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereUniqueInputSchema,
}).strict() ;

export const AssetTokenFindFirstArgsSchema: z.ZodType<Prisma.AssetTokenFindFirstArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereInputSchema.optional(),
  orderBy: z.union([ AssetTokenOrderByWithRelationInputSchema.array(),AssetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetTokenScalarFieldEnumSchema,AssetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssetTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AssetTokenFindFirstOrThrowArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereInputSchema.optional(),
  orderBy: z.union([ AssetTokenOrderByWithRelationInputSchema.array(),AssetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetTokenScalarFieldEnumSchema,AssetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssetTokenFindManyArgsSchema: z.ZodType<Prisma.AssetTokenFindManyArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereInputSchema.optional(),
  orderBy: z.union([ AssetTokenOrderByWithRelationInputSchema.array(),AssetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AssetTokenScalarFieldEnumSchema,AssetTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AssetTokenAggregateArgsSchema: z.ZodType<Prisma.AssetTokenAggregateArgs> = z.object({
  where: AssetTokenWhereInputSchema.optional(),
  orderBy: z.union([ AssetTokenOrderByWithRelationInputSchema.array(),AssetTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AssetTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssetTokenGroupByArgsSchema: z.ZodType<Prisma.AssetTokenGroupByArgs> = z.object({
  where: AssetTokenWhereInputSchema.optional(),
  orderBy: z.union([ AssetTokenOrderByWithAggregationInputSchema.array(),AssetTokenOrderByWithAggregationInputSchema ]).optional(),
  by: AssetTokenScalarFieldEnumSchema.array(),
  having: AssetTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AssetTokenFindUniqueArgsSchema: z.ZodType<Prisma.AssetTokenFindUniqueArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereUniqueInputSchema,
}).strict() ;

export const AssetTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AssetTokenFindUniqueOrThrowArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereUniqueInputSchema,
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

export const POCFindFirstArgsSchema: z.ZodType<Prisma.POCFindFirstArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereInputSchema.optional(),
  orderBy: z.union([ POCOrderByWithRelationInputSchema.array(),POCOrderByWithRelationInputSchema ]).optional(),
  cursor: POCWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCScalarFieldEnumSchema,POCScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCFindFirstOrThrowArgsSchema: z.ZodType<Prisma.POCFindFirstOrThrowArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereInputSchema.optional(),
  orderBy: z.union([ POCOrderByWithRelationInputSchema.array(),POCOrderByWithRelationInputSchema ]).optional(),
  cursor: POCWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCScalarFieldEnumSchema,POCScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCFindManyArgsSchema: z.ZodType<Prisma.POCFindManyArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereInputSchema.optional(),
  orderBy: z.union([ POCOrderByWithRelationInputSchema.array(),POCOrderByWithRelationInputSchema ]).optional(),
  cursor: POCWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCScalarFieldEnumSchema,POCScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCAggregateArgsSchema: z.ZodType<Prisma.POCAggregateArgs> = z.object({
  where: POCWhereInputSchema.optional(),
  orderBy: z.union([ POCOrderByWithRelationInputSchema.array(),POCOrderByWithRelationInputSchema ]).optional(),
  cursor: POCWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const POCGroupByArgsSchema: z.ZodType<Prisma.POCGroupByArgs> = z.object({
  where: POCWhereInputSchema.optional(),
  orderBy: z.union([ POCOrderByWithAggregationInputSchema.array(),POCOrderByWithAggregationInputSchema ]).optional(),
  by: POCScalarFieldEnumSchema.array(),
  having: POCScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const POCFindUniqueArgsSchema: z.ZodType<Prisma.POCFindUniqueArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereUniqueInputSchema,
}).strict() ;

export const POCFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.POCFindUniqueOrThrowArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereUniqueInputSchema,
}).strict() ;

export const POCHistoryFindFirstArgsSchema: z.ZodType<Prisma.POCHistoryFindFirstArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereInputSchema.optional(),
  orderBy: z.union([ POCHistoryOrderByWithRelationInputSchema.array(),POCHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: POCHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCHistoryScalarFieldEnumSchema,POCHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.POCHistoryFindFirstOrThrowArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereInputSchema.optional(),
  orderBy: z.union([ POCHistoryOrderByWithRelationInputSchema.array(),POCHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: POCHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCHistoryScalarFieldEnumSchema,POCHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCHistoryFindManyArgsSchema: z.ZodType<Prisma.POCHistoryFindManyArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereInputSchema.optional(),
  orderBy: z.union([ POCHistoryOrderByWithRelationInputSchema.array(),POCHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: POCHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ POCHistoryScalarFieldEnumSchema,POCHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const POCHistoryAggregateArgsSchema: z.ZodType<Prisma.POCHistoryAggregateArgs> = z.object({
  where: POCHistoryWhereInputSchema.optional(),
  orderBy: z.union([ POCHistoryOrderByWithRelationInputSchema.array(),POCHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: POCHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const POCHistoryGroupByArgsSchema: z.ZodType<Prisma.POCHistoryGroupByArgs> = z.object({
  where: POCHistoryWhereInputSchema.optional(),
  orderBy: z.union([ POCHistoryOrderByWithAggregationInputSchema.array(),POCHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: POCHistoryScalarFieldEnumSchema.array(),
  having: POCHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const POCHistoryFindUniqueArgsSchema: z.ZodType<Prisma.POCHistoryFindUniqueArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereUniqueInputSchema,
}).strict() ;

export const POCHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.POCHistoryFindUniqueOrThrowArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereUniqueInputSchema,
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

export const DaoContentCreateArgsSchema: z.ZodType<Prisma.DaoContentCreateArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  data: z.union([ DaoContentCreateInputSchema,DaoContentUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoContentUpsertArgsSchema: z.ZodType<Prisma.DaoContentUpsertArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereUniqueInputSchema,
  create: z.union([ DaoContentCreateInputSchema,DaoContentUncheckedCreateInputSchema ]),
  update: z.union([ DaoContentUpdateInputSchema,DaoContentUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoContentCreateManyArgsSchema: z.ZodType<Prisma.DaoContentCreateManyArgs> = z.object({
  data: z.union([ DaoContentCreateManyInputSchema,DaoContentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoContentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoContentCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoContentCreateManyInputSchema,DaoContentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoContentDeleteArgsSchema: z.ZodType<Prisma.DaoContentDeleteArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  where: DaoContentWhereUniqueInputSchema,
}).strict() ;

export const DaoContentUpdateArgsSchema: z.ZodType<Prisma.DaoContentUpdateArgs> = z.object({
  select: DaoContentSelectSchema.optional(),
  include: DaoContentIncludeSchema.optional(),
  data: z.union([ DaoContentUpdateInputSchema,DaoContentUncheckedUpdateInputSchema ]),
  where: DaoContentWhereUniqueInputSchema,
}).strict() ;

export const DaoContentUpdateManyArgsSchema: z.ZodType<Prisma.DaoContentUpdateManyArgs> = z.object({
  data: z.union([ DaoContentUpdateManyMutationInputSchema,DaoContentUncheckedUpdateManyInputSchema ]),
  where: DaoContentWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoContentUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoContentUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoContentUpdateManyMutationInputSchema,DaoContentUncheckedUpdateManyInputSchema ]),
  where: DaoContentWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoContentDeleteManyArgsSchema: z.ZodType<Prisma.DaoContentDeleteManyArgs> = z.object({
  where: DaoContentWhereInputSchema.optional(),
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

export const DaoTokenInfoCreateArgsSchema: z.ZodType<Prisma.DaoTokenInfoCreateArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  data: z.union([ DaoTokenInfoCreateInputSchema,DaoTokenInfoUncheckedCreateInputSchema ]),
}).strict() ;

export const DaoTokenInfoUpsertArgsSchema: z.ZodType<Prisma.DaoTokenInfoUpsertArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereUniqueInputSchema,
  create: z.union([ DaoTokenInfoCreateInputSchema,DaoTokenInfoUncheckedCreateInputSchema ]),
  update: z.union([ DaoTokenInfoUpdateInputSchema,DaoTokenInfoUncheckedUpdateInputSchema ]),
}).strict() ;

export const DaoTokenInfoCreateManyArgsSchema: z.ZodType<Prisma.DaoTokenInfoCreateManyArgs> = z.object({
  data: z.union([ DaoTokenInfoCreateManyInputSchema,DaoTokenInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoTokenInfoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoTokenInfoCreateManyAndReturnArgs> = z.object({
  data: z.union([ DaoTokenInfoCreateManyInputSchema,DaoTokenInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DaoTokenInfoDeleteArgsSchema: z.ZodType<Prisma.DaoTokenInfoDeleteArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  where: DaoTokenInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenInfoUpdateArgsSchema: z.ZodType<Prisma.DaoTokenInfoUpdateArgs> = z.object({
  select: DaoTokenInfoSelectSchema.optional(),
  include: DaoTokenInfoIncludeSchema.optional(),
  data: z.union([ DaoTokenInfoUpdateInputSchema,DaoTokenInfoUncheckedUpdateInputSchema ]),
  where: DaoTokenInfoWhereUniqueInputSchema,
}).strict() ;

export const DaoTokenInfoUpdateManyArgsSchema: z.ZodType<Prisma.DaoTokenInfoUpdateManyArgs> = z.object({
  data: z.union([ DaoTokenInfoUpdateManyMutationInputSchema,DaoTokenInfoUncheckedUpdateManyInputSchema ]),
  where: DaoTokenInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoTokenInfoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DaoTokenInfoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DaoTokenInfoUpdateManyMutationInputSchema,DaoTokenInfoUncheckedUpdateManyInputSchema ]),
  where: DaoTokenInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const DaoTokenInfoDeleteManyArgsSchema: z.ZodType<Prisma.DaoTokenInfoDeleteManyArgs> = z.object({
  where: DaoTokenInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AssetTokenCreateArgsSchema: z.ZodType<Prisma.AssetTokenCreateArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  data: z.union([ AssetTokenCreateInputSchema,AssetTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const AssetTokenUpsertArgsSchema: z.ZodType<Prisma.AssetTokenUpsertArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereUniqueInputSchema,
  create: z.union([ AssetTokenCreateInputSchema,AssetTokenUncheckedCreateInputSchema ]),
  update: z.union([ AssetTokenUpdateInputSchema,AssetTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const AssetTokenCreateManyArgsSchema: z.ZodType<Prisma.AssetTokenCreateManyArgs> = z.object({
  data: z.union([ AssetTokenCreateManyInputSchema,AssetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AssetTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AssetTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ AssetTokenCreateManyInputSchema,AssetTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AssetTokenDeleteArgsSchema: z.ZodType<Prisma.AssetTokenDeleteArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  where: AssetTokenWhereUniqueInputSchema,
}).strict() ;

export const AssetTokenUpdateArgsSchema: z.ZodType<Prisma.AssetTokenUpdateArgs> = z.object({
  select: AssetTokenSelectSchema.optional(),
  data: z.union([ AssetTokenUpdateInputSchema,AssetTokenUncheckedUpdateInputSchema ]),
  where: AssetTokenWhereUniqueInputSchema,
}).strict() ;

export const AssetTokenUpdateManyArgsSchema: z.ZodType<Prisma.AssetTokenUpdateManyArgs> = z.object({
  data: z.union([ AssetTokenUpdateManyMutationInputSchema,AssetTokenUncheckedUpdateManyInputSchema ]),
  where: AssetTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AssetTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AssetTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AssetTokenUpdateManyMutationInputSchema,AssetTokenUncheckedUpdateManyInputSchema ]),
  where: AssetTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AssetTokenDeleteManyArgsSchema: z.ZodType<Prisma.AssetTokenDeleteManyArgs> = z.object({
  where: AssetTokenWhereInputSchema.optional(),
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

export const POCCreateArgsSchema: z.ZodType<Prisma.POCCreateArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  data: z.union([ POCCreateInputSchema,POCUncheckedCreateInputSchema ]),
}).strict() ;

export const POCUpsertArgsSchema: z.ZodType<Prisma.POCUpsertArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereUniqueInputSchema,
  create: z.union([ POCCreateInputSchema,POCUncheckedCreateInputSchema ]),
  update: z.union([ POCUpdateInputSchema,POCUncheckedUpdateInputSchema ]),
}).strict() ;

export const POCCreateManyArgsSchema: z.ZodType<Prisma.POCCreateManyArgs> = z.object({
  data: z.union([ POCCreateManyInputSchema,POCCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const POCCreateManyAndReturnArgsSchema: z.ZodType<Prisma.POCCreateManyAndReturnArgs> = z.object({
  data: z.union([ POCCreateManyInputSchema,POCCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const POCDeleteArgsSchema: z.ZodType<Prisma.POCDeleteArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  where: POCWhereUniqueInputSchema,
}).strict() ;

export const POCUpdateArgsSchema: z.ZodType<Prisma.POCUpdateArgs> = z.object({
  select: POCSelectSchema.optional(),
  include: POCIncludeSchema.optional(),
  data: z.union([ POCUpdateInputSchema,POCUncheckedUpdateInputSchema ]),
  where: POCWhereUniqueInputSchema,
}).strict() ;

export const POCUpdateManyArgsSchema: z.ZodType<Prisma.POCUpdateManyArgs> = z.object({
  data: z.union([ POCUpdateManyMutationInputSchema,POCUncheckedUpdateManyInputSchema ]),
  where: POCWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const POCUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.POCUpdateManyAndReturnArgs> = z.object({
  data: z.union([ POCUpdateManyMutationInputSchema,POCUncheckedUpdateManyInputSchema ]),
  where: POCWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const POCDeleteManyArgsSchema: z.ZodType<Prisma.POCDeleteManyArgs> = z.object({
  where: POCWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const POCHistoryCreateArgsSchema: z.ZodType<Prisma.POCHistoryCreateArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  data: z.union([ POCHistoryCreateInputSchema,POCHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const POCHistoryUpsertArgsSchema: z.ZodType<Prisma.POCHistoryUpsertArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereUniqueInputSchema,
  create: z.union([ POCHistoryCreateInputSchema,POCHistoryUncheckedCreateInputSchema ]),
  update: z.union([ POCHistoryUpdateInputSchema,POCHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const POCHistoryCreateManyArgsSchema: z.ZodType<Prisma.POCHistoryCreateManyArgs> = z.object({
  data: z.union([ POCHistoryCreateManyInputSchema,POCHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const POCHistoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.POCHistoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ POCHistoryCreateManyInputSchema,POCHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const POCHistoryDeleteArgsSchema: z.ZodType<Prisma.POCHistoryDeleteArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  where: POCHistoryWhereUniqueInputSchema,
}).strict() ;

export const POCHistoryUpdateArgsSchema: z.ZodType<Prisma.POCHistoryUpdateArgs> = z.object({
  select: POCHistorySelectSchema.optional(),
  include: POCHistoryIncludeSchema.optional(),
  data: z.union([ POCHistoryUpdateInputSchema,POCHistoryUncheckedUpdateInputSchema ]),
  where: POCHistoryWhereUniqueInputSchema,
}).strict() ;

export const POCHistoryUpdateManyArgsSchema: z.ZodType<Prisma.POCHistoryUpdateManyArgs> = z.object({
  data: z.union([ POCHistoryUpdateManyMutationInputSchema,POCHistoryUncheckedUpdateManyInputSchema ]),
  where: POCHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const POCHistoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.POCHistoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ POCHistoryUpdateManyMutationInputSchema,POCHistoryUncheckedUpdateManyInputSchema ]),
  where: POCHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const POCHistoryDeleteManyArgsSchema: z.ZodType<Prisma.POCHistoryDeleteManyArgs> = z.object({
  where: POCHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;