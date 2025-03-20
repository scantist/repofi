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

export const DaoTokenInfoScalarFieldEnumSchema = z.enum(['tokenId','tokenAddress','name','ticker','creator','isGraduated','createdAt','updatedAt','liquidity','price','marketCap','totalSupply','raisedAssetAmount','salesRatio','reservedRatio','unlockRatio','holderCount','assetTokenAddress','graduatedAt','uniswapV3Pair']);

export const AssetTokenScalarFieldEnumSchema = z.enum(['address','name','symbol','decimals','logoUrl','priceUsd','launchFee','isAllowed','isNative','isValid']);

export const ForumMessageScalarFieldEnumSchema = z.enum(['id','daoId','message','createdAt','createdBy','deletedAt','replyToMessage','replyToUser','rootMessageId']);

export const ContributorScalarFieldEnumSchema = z.enum(['id','daoId','userAddress','isValid','userPlatformId','userPlatformName','userPlatformAvatar','createdAt','updatedAt','snapshotValue']);

export const ContributorHistoryScalarFieldEnumSchema = z.enum(['id','tag','value','createdAt','updatedAt','contributorId']);

export const EvtTxnLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','address','topic0','topic1','topic2','topic3','data']);

export const EvtTokenLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenId','assetAddress','initPrice','userAddress']);

export const EvtGraduatedLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenId','tokenAddress','uniswapPool']);

export const EvtTokenLockLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenAddress','unlockRatio','lockPeriod','lockStart']);

export const EvtTradeLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenId','userAddress','assetAddress','tradeType','amountIn','amountOut','price']);

export const EvtAssetLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','assetAddress','decimals','isAllowed','launchFee']);

export const EvtAssetFeeLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','assetAddress','oldLaunchFee','newLaunchFee']);

export const EvtContributionStartLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenId','cycleId']);

export const EvtContributionUpdateLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenId','cycleId','contributor','contributorId','score']);

export const EvtClaimLogScalarFieldEnumSchema = z.enum(['blockNumber','txnIndex','logIndex','blockTime','txnHash','tokenAddress','userAddress','amount','claimType']);

export const KLine5mScalarFieldEnumSchema = z.enum(['tokenId','openTs','closeTs','open','high','low','close','volume','amount','txnNum']);

export const KLine1mScalarFieldEnumSchema = z.enum(['tokenId','openTs','closeTs','open','high','low','close','volume','amount','txnNum']);

export const ContributionInfoScalarFieldEnumSchema = z.enum(['tokenId','cycleId','startTs']);

export const ContributionDetailScalarFieldEnumSchema = z.enum(['tokenId','cycleId','contributor','contributorId','score','updateTs']);

export const UserClaimHistoryScalarFieldEnumSchema = z.enum(['userAddress','tokenAddress','claimType','claimAmount','claimTime']);

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
  isGraduated: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  liquidity: z.instanceof(Prisma.Decimal, { message: "Field 'liquidity' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  price: z.instanceof(Prisma.Decimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  marketCap: z.instanceof(Prisma.Decimal, { message: "Field 'marketCap' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  totalSupply: z.instanceof(Prisma.Decimal, { message: "Field 'totalSupply' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  raisedAssetAmount: z.instanceof(Prisma.Decimal, { message: "Field 'raisedAssetAmount' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  salesRatio: z.instanceof(Prisma.Decimal, { message: "Field 'salesRatio' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  reservedRatio: z.instanceof(Prisma.Decimal, { message: "Field 'reservedRatio' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  unlockRatio: z.instanceof(Prisma.Decimal, { message: "Field 'unlockRatio' must be a Decimal. Location: ['Models', 'DaoTokenInfo']"}).nullable(),
  holderCount: z.number().int(),
  assetTokenAddress: z.string().nullable(),
  graduatedAt: z.coerce.date().nullable(),
  uniswapV3Pair: z.string().nullable(),
})

export type DaoTokenInfo = z.infer<typeof DaoTokenInfoSchema>

/////////////////////////////////////////
// ASSET TOKEN SCHEMA
/////////////////////////////////////////

export const AssetTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.instanceof(Prisma.Decimal, { message: "Field 'priceUsd' must be a Decimal. Location: ['Models', 'AssetToken']"}),
  launchFee: z.instanceof(Prisma.Decimal, { message: "Field 'launchFee' must be a Decimal. Location: ['Models', 'AssetToken']"}),
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
// CONTRIBUTOR SCHEMA
/////////////////////////////////////////

export const ContributorSchema = z.object({
  id: z.string(),
  daoId: z.string(),
  userAddress: z.string().nullable(),
  isValid: z.boolean(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  snapshotValue: z.instanceof(Prisma.Decimal, { message: "Field 'snapshotValue' must be a Decimal. Location: ['Models', 'Contributor']"}),
})

export type Contributor = z.infer<typeof ContributorSchema>

/////////////////////////////////////////
// CONTRIBUTOR HISTORY SCHEMA
/////////////////////////////////////////

export const ContributorHistorySchema = z.object({
  id: z.string(),
  tag: z.string(),
  value: z.instanceof(Prisma.Decimal, { message: "Field 'value' must be a Decimal. Location: ['Models', 'ContributorHistory']"}),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contributorId: z.string(),
})

export type ContributorHistory = z.infer<typeof ContributorHistorySchema>

/////////////////////////////////////////
// EVT TXN LOG SCHEMA
/////////////////////////////////////////

export const EvtTxnLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  address: z.string(),
  topic0: z.string(),
  topic1: z.string().nullable(),
  topic2: z.string().nullable(),
  topic3: z.string().nullable(),
  data: z.string().nullable(),
})

export type EvtTxnLog = z.infer<typeof EvtTxnLogSchema>

/////////////////////////////////////////
// EVT TOKEN LOG SCHEMA
/////////////////////////////////////////

export const EvtTokenLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  assetAddress: z.string(),
  initPrice: z.instanceof(Prisma.Decimal, { message: "Field 'initPrice' must be a Decimal. Location: ['Models', 'EvtTokenLog']"}),
  userAddress: z.string(),
})

export type EvtTokenLog = z.infer<typeof EvtTokenLogSchema>

/////////////////////////////////////////
// EVT GRADUATED LOG SCHEMA
/////////////////////////////////////////

export const EvtGraduatedLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  tokenAddress: z.string(),
  uniswapPool: z.string(),
})

export type EvtGraduatedLog = z.infer<typeof EvtGraduatedLogSchema>

/////////////////////////////////////////
// EVT TOKEN LOCK LOG SCHEMA
/////////////////////////////////////////

export const EvtTokenLockLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  unlockRatio: z.instanceof(Prisma.Decimal, { message: "Field 'unlockRatio' must be a Decimal. Location: ['Models', 'EvtTokenLockLog']"}),
  lockPeriod: z.bigint(),
  lockStart: z.bigint(),
})

export type EvtTokenLockLog = z.infer<typeof EvtTokenLockLogSchema>

/////////////////////////////////////////
// EVT TRADE LOG SCHEMA
/////////////////////////////////////////

export const EvtTradeLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  userAddress: z.string(),
  assetAddress: z.string(),
  tradeType: z.number().int(),
  amountIn: z.instanceof(Prisma.Decimal, { message: "Field 'amountIn' must be a Decimal. Location: ['Models', 'EvtTradeLog']"}),
  amountOut: z.instanceof(Prisma.Decimal, { message: "Field 'amountOut' must be a Decimal. Location: ['Models', 'EvtTradeLog']"}),
  price: z.instanceof(Prisma.Decimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'EvtTradeLog']"}),
})

export type EvtTradeLog = z.infer<typeof EvtTradeLogSchema>

/////////////////////////////////////////
// EVT ASSET LOG SCHEMA
/////////////////////////////////////////

export const EvtAssetLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  decimals: z.number().int(),
  isAllowed: z.boolean(),
  launchFee: z.instanceof(Prisma.Decimal, { message: "Field 'launchFee' must be a Decimal. Location: ['Models', 'EvtAssetLog']"}).nullable(),
})

export type EvtAssetLog = z.infer<typeof EvtAssetLogSchema>

/////////////////////////////////////////
// EVT ASSET FEE LOG SCHEMA
/////////////////////////////////////////

export const EvtAssetFeeLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  oldLaunchFee: z.instanceof(Prisma.Decimal, { message: "Field 'oldLaunchFee' must be a Decimal. Location: ['Models', 'EvtAssetFeeLog']"}),
  newLaunchFee: z.instanceof(Prisma.Decimal, { message: "Field 'newLaunchFee' must be a Decimal. Location: ['Models', 'EvtAssetFeeLog']"}),
})

export type EvtAssetFeeLog = z.infer<typeof EvtAssetFeeLogSchema>

/////////////////////////////////////////
// EVT CONTRIBUTION START LOG SCHEMA
/////////////////////////////////////////

export const EvtContributionStartLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint(),
})

export type EvtContributionStartLog = z.infer<typeof EvtContributionStartLogSchema>

/////////////////////////////////////////
// EVT CONTRIBUTION UPDATE LOG SCHEMA
/////////////////////////////////////////

export const EvtContributionUpdateLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.instanceof(Prisma.Decimal, { message: "Field 'score' must be a Decimal. Location: ['Models', 'EvtContributionUpdateLog']"}),
})

export type EvtContributionUpdateLog = z.infer<typeof EvtContributionUpdateLogSchema>

/////////////////////////////////////////
// EVT CLAIM LOG SCHEMA
/////////////////////////////////////////

export const EvtClaimLogSchema = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  userAddress: z.string(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'EvtClaimLog']"}),
  claimType: z.number().int(),
})

export type EvtClaimLog = z.infer<typeof EvtClaimLogSchema>

/////////////////////////////////////////
// K LINE 5 M SCHEMA
/////////////////////////////////////////

export const KLine5mSchema = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.instanceof(Prisma.Decimal, { message: "Field 'open' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  high: z.instanceof(Prisma.Decimal, { message: "Field 'high' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  low: z.instanceof(Prisma.Decimal, { message: "Field 'low' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  close: z.instanceof(Prisma.Decimal, { message: "Field 'close' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  volume: z.instanceof(Prisma.Decimal, { message: "Field 'volume' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'KLine5m']"}),
  txnNum: z.bigint(),
})

export type KLine5m = z.infer<typeof KLine5mSchema>

/////////////////////////////////////////
// K LINE 1 M SCHEMA
/////////////////////////////////////////

export const KLine1mSchema = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.instanceof(Prisma.Decimal, { message: "Field 'open' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  high: z.instanceof(Prisma.Decimal, { message: "Field 'high' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  low: z.instanceof(Prisma.Decimal, { message: "Field 'low' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  close: z.instanceof(Prisma.Decimal, { message: "Field 'close' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  volume: z.instanceof(Prisma.Decimal, { message: "Field 'volume' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'KLine1m']"}),
  txnNum: z.bigint(),
})

export type KLine1m = z.infer<typeof KLine1mSchema>

/////////////////////////////////////////
// CONTRIBUTION INFO SCHEMA
/////////////////////////////////////////

export const ContributionInfoSchema = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  startTs: z.bigint(),
})

export type ContributionInfo = z.infer<typeof ContributionInfoSchema>

/////////////////////////////////////////
// CONTRIBUTION DETAIL SCHEMA
/////////////////////////////////////////

export const ContributionDetailSchema = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.instanceof(Prisma.Decimal, { message: "Field 'score' must be a Decimal. Location: ['Models', 'ContributionDetail']"}),
  updateTs: z.bigint(),
})

export type ContributionDetail = z.infer<typeof ContributionDetailSchema>

/////////////////////////////////////////
// USER CLAIM HISTORY SCHEMA
/////////////////////////////////////////

export const UserClaimHistorySchema = z.object({
  userAddress: z.string(),
  tokenAddress: z.string(),
  claimType: z.number().int(),
  claimAmount: z.instanceof(Prisma.Decimal, { message: "Field 'claimAmount' must be a Decimal. Location: ['Models', 'UserClaimHistory']"}),
  claimTime: z.bigint(),
})

export type UserClaimHistory = z.infer<typeof UserClaimHistorySchema>

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
  contributions: z.union([z.boolean(),z.lazy(() => ContributorFindManyArgsSchema)]).optional(),
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
  contributions: z.union([z.boolean(),z.lazy(() => ContributorFindManyArgsSchema)]).optional(),
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
  contributors: z.union([z.boolean(),z.lazy(() => ContributorFindManyArgsSchema)]).optional(),
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
  contributors: z.boolean().optional(),
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
  contributors: z.union([z.boolean(),z.lazy(() => ContributorFindManyArgsSchema)]).optional(),
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
  isGraduated: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  liquidity: z.boolean().optional(),
  price: z.boolean().optional(),
  marketCap: z.boolean().optional(),
  totalSupply: z.boolean().optional(),
  raisedAssetAmount: z.boolean().optional(),
  salesRatio: z.boolean().optional(),
  reservedRatio: z.boolean().optional(),
  unlockRatio: z.boolean().optional(),
  holderCount: z.boolean().optional(),
  assetTokenAddress: z.boolean().optional(),
  graduatedAt: z.boolean().optional(),
  uniswapV3Pair: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  holders: z.union([z.boolean(),z.lazy(() => DaoTokenHolderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DaoTokenInfoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ASSET TOKEN
//------------------------------------------------------

export const AssetTokenSelectSchema: z.ZodType<Prisma.AssetTokenSelect> = z.object({
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

// CONTRIBUTOR
//------------------------------------------------------

export const ContributorIncludeSchema: z.ZodType<Prisma.ContributorInclude> = z.object({
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => ContributorHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContributorCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ContributorArgsSchema: z.ZodType<Prisma.ContributorDefaultArgs> = z.object({
  select: z.lazy(() => ContributorSelectSchema).optional(),
  include: z.lazy(() => ContributorIncludeSchema).optional(),
}).strict();

export const ContributorCountOutputTypeArgsSchema: z.ZodType<Prisma.ContributorCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ContributorCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ContributorCountOutputTypeSelectSchema: z.ZodType<Prisma.ContributorCountOutputTypeSelect> = z.object({
  histories: z.boolean().optional(),
}).strict();

export const ContributorSelectSchema: z.ZodType<Prisma.ContributorSelect> = z.object({
  id: z.boolean().optional(),
  daoId: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.boolean().optional(),
  userPlatformName: z.boolean().optional(),
  userPlatformAvatar: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  snapshotValue: z.boolean().optional(),
  dao: z.union([z.boolean(),z.lazy(() => DaoArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  histories: z.union([z.boolean(),z.lazy(() => ContributorHistoryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContributorCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTRIBUTOR HISTORY
//------------------------------------------------------

export const ContributorHistoryIncludeSchema: z.ZodType<Prisma.ContributorHistoryInclude> = z.object({
  contributor: z.union([z.boolean(),z.lazy(() => ContributorArgsSchema)]).optional(),
}).strict()

export const ContributorHistoryArgsSchema: z.ZodType<Prisma.ContributorHistoryDefaultArgs> = z.object({
  select: z.lazy(() => ContributorHistorySelectSchema).optional(),
  include: z.lazy(() => ContributorHistoryIncludeSchema).optional(),
}).strict();

export const ContributorHistorySelectSchema: z.ZodType<Prisma.ContributorHistorySelect> = z.object({
  id: z.boolean().optional(),
  tag: z.boolean().optional(),
  value: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  contributorId: z.boolean().optional(),
  contributor: z.union([z.boolean(),z.lazy(() => ContributorArgsSchema)]).optional(),
}).strict()

// EVT TXN LOG
//------------------------------------------------------

export const EvtTxnLogSelectSchema: z.ZodType<Prisma.EvtTxnLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  address: z.boolean().optional(),
  topic0: z.boolean().optional(),
  topic1: z.boolean().optional(),
  topic2: z.boolean().optional(),
  topic3: z.boolean().optional(),
  data: z.boolean().optional(),
}).strict()

// EVT TOKEN LOG
//------------------------------------------------------

export const EvtTokenLogSelectSchema: z.ZodType<Prisma.EvtTokenLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  assetAddress: z.boolean().optional(),
  initPrice: z.boolean().optional(),
  userAddress: z.boolean().optional(),
}).strict()

// EVT GRADUATED LOG
//------------------------------------------------------

export const EvtGraduatedLogSelectSchema: z.ZodType<Prisma.EvtGraduatedLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  uniswapPool: z.boolean().optional(),
}).strict()

// EVT TOKEN LOCK LOG
//------------------------------------------------------

export const EvtTokenLockLogSelectSchema: z.ZodType<Prisma.EvtTokenLockLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  unlockRatio: z.boolean().optional(),
  lockPeriod: z.boolean().optional(),
  lockStart: z.boolean().optional(),
}).strict()

// EVT TRADE LOG
//------------------------------------------------------

export const EvtTradeLogSelectSchema: z.ZodType<Prisma.EvtTradeLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  assetAddress: z.boolean().optional(),
  tradeType: z.boolean().optional(),
  amountIn: z.boolean().optional(),
  amountOut: z.boolean().optional(),
  price: z.boolean().optional(),
}).strict()

// EVT ASSET LOG
//------------------------------------------------------

export const EvtAssetLogSelectSchema: z.ZodType<Prisma.EvtAssetLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  assetAddress: z.boolean().optional(),
  decimals: z.boolean().optional(),
  isAllowed: z.boolean().optional(),
  launchFee: z.boolean().optional(),
}).strict()

// EVT ASSET FEE LOG
//------------------------------------------------------

export const EvtAssetFeeLogSelectSchema: z.ZodType<Prisma.EvtAssetFeeLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  assetAddress: z.boolean().optional(),
  oldLaunchFee: z.boolean().optional(),
  newLaunchFee: z.boolean().optional(),
}).strict()

// EVT CONTRIBUTION START LOG
//------------------------------------------------------

export const EvtContributionStartLogSelectSchema: z.ZodType<Prisma.EvtContributionStartLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  cycleId: z.boolean().optional(),
}).strict()

// EVT CONTRIBUTION UPDATE LOG
//------------------------------------------------------

export const EvtContributionUpdateLogSelectSchema: z.ZodType<Prisma.EvtContributionUpdateLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenId: z.boolean().optional(),
  cycleId: z.boolean().optional(),
  contributor: z.boolean().optional(),
  contributorId: z.boolean().optional(),
  score: z.boolean().optional(),
}).strict()

// EVT CLAIM LOG
//------------------------------------------------------

export const EvtClaimLogSelectSchema: z.ZodType<Prisma.EvtClaimLogSelect> = z.object({
  blockNumber: z.boolean().optional(),
  txnIndex: z.boolean().optional(),
  logIndex: z.boolean().optional(),
  blockTime: z.boolean().optional(),
  txnHash: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  userAddress: z.boolean().optional(),
  amount: z.boolean().optional(),
  claimType: z.boolean().optional(),
}).strict()

// K LINE 5 M
//------------------------------------------------------

export const KLine5mSelectSchema: z.ZodType<Prisma.KLine5mSelect> = z.object({
  tokenId: z.boolean().optional(),
  openTs: z.boolean().optional(),
  closeTs: z.boolean().optional(),
  open: z.boolean().optional(),
  high: z.boolean().optional(),
  low: z.boolean().optional(),
  close: z.boolean().optional(),
  volume: z.boolean().optional(),
  amount: z.boolean().optional(),
  txnNum: z.boolean().optional(),
}).strict()

// K LINE 1 M
//------------------------------------------------------

export const KLine1mSelectSchema: z.ZodType<Prisma.KLine1mSelect> = z.object({
  tokenId: z.boolean().optional(),
  openTs: z.boolean().optional(),
  closeTs: z.boolean().optional(),
  open: z.boolean().optional(),
  high: z.boolean().optional(),
  low: z.boolean().optional(),
  close: z.boolean().optional(),
  volume: z.boolean().optional(),
  amount: z.boolean().optional(),
  txnNum: z.boolean().optional(),
}).strict()

// CONTRIBUTION INFO
//------------------------------------------------------

export const ContributionInfoSelectSchema: z.ZodType<Prisma.ContributionInfoSelect> = z.object({
  tokenId: z.boolean().optional(),
  cycleId: z.boolean().optional(),
  startTs: z.boolean().optional(),
}).strict()

// CONTRIBUTION DETAIL
//------------------------------------------------------

export const ContributionDetailSelectSchema: z.ZodType<Prisma.ContributionDetailSelect> = z.object({
  tokenId: z.boolean().optional(),
  cycleId: z.boolean().optional(),
  contributor: z.boolean().optional(),
  contributorId: z.boolean().optional(),
  score: z.boolean().optional(),
  updateTs: z.boolean().optional(),
}).strict()

// USER CLAIM HISTORY
//------------------------------------------------------

export const UserClaimHistorySelectSchema: z.ZodType<Prisma.UserClaimHistorySelect> = z.object({
  userAddress: z.boolean().optional(),
  tokenAddress: z.boolean().optional(),
  claimType: z.boolean().optional(),
  claimAmount: z.boolean().optional(),
  claimTime: z.boolean().optional(),
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
  contributions: z.lazy(() => ContributorListRelationFilterSchema).optional()
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
  contributions: z.lazy(() => ContributorOrderByRelationAggregateInputSchema).optional()
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
  contributions: z.lazy(() => ContributorListRelationFilterSchema).optional()
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
  contributors: z.lazy(() => ContributorListRelationFilterSchema).optional(),
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
  contributors: z.lazy(() => ContributorOrderByRelationAggregateInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorListRelationFilterSchema).optional(),
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
  isGraduated: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  liquidity: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  price: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  marketCap: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  totalSupply: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  salesRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  reservedRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  unlockRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  graduatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
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
  isGraduated: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  marketCap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalSupply: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  raisedAssetAmount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  salesRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  reservedRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  unlockRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  graduatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  isGraduated: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  liquidity: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  price: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  marketCap: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  totalSupply: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  salesRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  reservedRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  unlockRatio: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  holderCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  graduatedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
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
  isGraduated: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  marketCap: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  totalSupply: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  raisedAssetAmount: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  salesRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  reservedRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  unlockRatio: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  graduatedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
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
  isGraduated: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  liquidity: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  price: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  marketCap: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  totalSupply: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  salesRatio: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  reservedRatio: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  unlockRatio: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
  holderCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  assetTokenAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  graduatedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  uniswapV3Pair: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AssetTokenWhereInputSchema: z.ZodType<Prisma.AssetTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isNative: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const AssetTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.AssetTokenOrderByWithRelationInput> = z.object({
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
  address: z.string()
})
.and(z.object({
  address: z.string().optional(),
  AND: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AssetTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AssetTokenWhereInputSchema),z.lazy(() => AssetTokenWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isNative: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict());

export const AssetTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.AssetTokenOrderByWithAggregationInput> = z.object({
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
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  priceUsd: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
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

export const ContributorWhereInputSchema: z.ZodType<Prisma.ContributorWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorWhereInputSchema),z.lazy(() => ContributorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorWhereInputSchema),z.lazy(() => ContributorWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => ContributorHistoryListRelationFilterSchema).optional()
}).strict();

export const ContributorOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributorOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional(),
  dao: z.lazy(() => DaoOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ContributorWhereUniqueInputSchema: z.ZodType<Prisma.ContributorWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContributorWhereInputSchema),z.lazy(() => ContributorWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorWhereInputSchema),z.lazy(() => ContributorWhereInputSchema).array() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  dao: z.union([ z.lazy(() => DaoScalarRelationFilterSchema),z.lazy(() => DaoWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  histories: z.lazy(() => ContributorHistoryListRelationFilterSchema).optional()
}).strict());

export const ContributorOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributorOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributorCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContributorAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributorMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributorMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContributorSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContributorScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributorScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributorScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userPlatformAvatar: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  snapshotValue: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const ContributorHistoryWhereInputSchema: z.ZodType<Prisma.ContributorHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorHistoryWhereInputSchema),z.lazy(() => ContributorHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorHistoryWhereInputSchema),z.lazy(() => ContributorHistoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributor: z.union([ z.lazy(() => ContributorScalarRelationFilterSchema),z.lazy(() => ContributorWhereInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributorHistoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => ContributorOrderByWithRelationInputSchema).optional()
}).strict();

export const ContributorHistoryWhereUniqueInputSchema: z.ZodType<Prisma.ContributorHistoryWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContributorHistoryWhereInputSchema),z.lazy(() => ContributorHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorHistoryWhereInputSchema),z.lazy(() => ContributorHistoryWhereInputSchema).array() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributor: z.union([ z.lazy(() => ContributorScalarRelationFilterSchema),z.lazy(() => ContributorWhereInputSchema) ]).optional(),
}).strict());

export const ContributorHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributorHistoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributorHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContributorHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributorHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributorHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContributorHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const ContributorHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributorHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributorHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributorHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EvtTxnLogWhereInputSchema: z.ZodType<Prisma.EvtTxnLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTxnLogWhereInputSchema),z.lazy(() => EvtTxnLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTxnLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTxnLogWhereInputSchema),z.lazy(() => EvtTxnLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  topic0: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  topic1: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic2: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic3: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  data: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const EvtTxnLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtTxnLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  topic0: z.lazy(() => SortOrderSchema).optional(),
  topic1: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic2: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic3: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const EvtTxnLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtTxnLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTxnLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTxnLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtTxnLogWhereInputSchema),z.lazy(() => EvtTxnLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTxnLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTxnLogWhereInputSchema),z.lazy(() => EvtTxnLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  topic0: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  topic1: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic2: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  topic3: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  data: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict());

export const EvtTxnLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtTxnLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  topic0: z.lazy(() => SortOrderSchema).optional(),
  topic1: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic2: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  topic3: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EvtTxnLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtTxnLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtTxnLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtTxnLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtTxnLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtTxnLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtTxnLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTxnLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTxnLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTxnLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTxnLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTxnLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  topic0: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  topic1: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  topic2: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  topic3: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  data: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const EvtTokenLogWhereInputSchema: z.ZodType<Prisma.EvtTokenLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTokenLogWhereInputSchema),z.lazy(() => EvtTokenLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLogWhereInputSchema),z.lazy(() => EvtTokenLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  initPrice: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const EvtTokenLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtTokenLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtTokenLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTokenLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTokenLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtTokenLogWhereInputSchema),z.lazy(() => EvtTokenLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLogWhereInputSchema),z.lazy(() => EvtTokenLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  initPrice: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const EvtTokenLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtTokenLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtTokenLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtTokenLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtTokenLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtTokenLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtTokenLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtTokenLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtTokenLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTokenLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTokenLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTokenLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  initPrice: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EvtGraduatedLogWhereInputSchema: z.ZodType<Prisma.EvtGraduatedLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtGraduatedLogWhereInputSchema),z.lazy(() => EvtGraduatedLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtGraduatedLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtGraduatedLogWhereInputSchema),z.lazy(() => EvtGraduatedLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uniswapPool: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const EvtGraduatedLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtGraduatedLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  uniswapPool: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtGraduatedLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtGraduatedLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtGraduatedLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtGraduatedLogWhereInputSchema),z.lazy(() => EvtGraduatedLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtGraduatedLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtGraduatedLogWhereInputSchema),z.lazy(() => EvtGraduatedLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uniswapPool: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const EvtGraduatedLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtGraduatedLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  uniswapPool: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtGraduatedLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtGraduatedLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtGraduatedLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtGraduatedLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtGraduatedLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtGraduatedLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtGraduatedLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtGraduatedLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtGraduatedLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtGraduatedLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtGraduatedLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtGraduatedLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uniswapPool: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const EvtTokenLockLogWhereInputSchema: z.ZodType<Prisma.EvtTokenLockLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTokenLockLogWhereInputSchema),z.lazy(() => EvtTokenLockLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLockLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLockLogWhereInputSchema),z.lazy(() => EvtTokenLockLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  unlockRatio: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lockPeriod: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  lockStart: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const EvtTokenLockLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtTokenLockLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtTokenLockLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTokenLockLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTokenLockLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtTokenLockLogWhereInputSchema),z.lazy(() => EvtTokenLockLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLockLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLockLogWhereInputSchema),z.lazy(() => EvtTokenLockLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  unlockRatio: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lockPeriod: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  lockStart: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const EvtTokenLockLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtTokenLockLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtTokenLockLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtTokenLockLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtTokenLockLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtTokenLockLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtTokenLockLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtTokenLockLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtTokenLockLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTokenLockLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTokenLockLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTokenLockLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTokenLockLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTokenLockLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  unlockRatio: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lockPeriod: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  lockStart: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const EvtTradeLogWhereInputSchema: z.ZodType<Prisma.EvtTradeLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTradeLogWhereInputSchema),z.lazy(() => EvtTradeLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTradeLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTradeLogWhereInputSchema),z.lazy(() => EvtTradeLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradeType: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amountIn: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amountOut: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtTradeLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtTradeLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtTradeLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTradeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtTradeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtTradeLogWhereInputSchema),z.lazy(() => EvtTradeLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTradeLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTradeLogWhereInputSchema),z.lazy(() => EvtTradeLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tradeType: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  amountIn: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amountOut: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict());

export const EvtTradeLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtTradeLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtTradeLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtTradeLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtTradeLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtTradeLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtTradeLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtTradeLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtTradeLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtTradeLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTradeLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtTradeLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtTradeLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtTradeLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tradeType: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amountIn: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amountOut: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtAssetLogWhereInputSchema: z.ZodType<Prisma.EvtAssetLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtAssetLogWhereInputSchema),z.lazy(() => EvtAssetLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetLogWhereInputSchema),z.lazy(() => EvtAssetLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
}).strict();

export const EvtAssetLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtAssetLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
}).strict();

export const EvtAssetLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtAssetLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtAssetLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtAssetLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtAssetLogWhereInputSchema),z.lazy(() => EvtAssetLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetLogWhereInputSchema),z.lazy(() => EvtAssetLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalNullableFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
}).strict());

export const EvtAssetLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtAssetLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EvtAssetLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtAssetLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtAssetLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtAssetLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtAssetLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtAssetLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtAssetLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtAssetLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtAssetLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtAssetLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  decimals: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  isAllowed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  launchFee: z.union([ z.lazy(() => DecimalNullableWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional().nullable(),
}).strict();

export const EvtAssetFeeLogWhereInputSchema: z.ZodType<Prisma.EvtAssetFeeLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtAssetFeeLogWhereInputSchema),z.lazy(() => EvtAssetFeeLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetFeeLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetFeeLogWhereInputSchema),z.lazy(() => EvtAssetFeeLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  oldLaunchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  newLaunchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtAssetFeeLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtAssetFeeLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtAssetFeeLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtAssetFeeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtAssetFeeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtAssetFeeLogWhereInputSchema),z.lazy(() => EvtAssetFeeLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetFeeLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetFeeLogWhereInputSchema),z.lazy(() => EvtAssetFeeLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  oldLaunchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  newLaunchFee: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict());

export const EvtAssetFeeLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtAssetFeeLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtAssetFeeLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtAssetFeeLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtAssetFeeLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtAssetFeeLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtAssetFeeLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtAssetFeeLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtAssetFeeLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtAssetFeeLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtAssetFeeLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtAssetFeeLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtAssetFeeLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtAssetFeeLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  assetAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  oldLaunchFee: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  newLaunchFee: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtContributionStartLogWhereInputSchema: z.ZodType<Prisma.EvtContributionStartLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtContributionStartLogWhereInputSchema),z.lazy(() => EvtContributionStartLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionStartLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionStartLogWhereInputSchema),z.lazy(() => EvtContributionStartLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const EvtContributionStartLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtContributionStartLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtContributionStartLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtContributionStartLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtContributionStartLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtContributionStartLogWhereInputSchema),z.lazy(() => EvtContributionStartLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionStartLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionStartLogWhereInputSchema),z.lazy(() => EvtContributionStartLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const EvtContributionStartLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtContributionStartLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtContributionStartLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtContributionStartLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtContributionStartLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtContributionStartLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtContributionStartLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtContributionStartLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtContributionStartLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtContributionStartLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtContributionStartLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionStartLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionStartLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtContributionStartLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const EvtContributionUpdateLogWhereInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtContributionUpdateLogWhereInputSchema),z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionUpdateLogWhereInputSchema),z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtContributionUpdateLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtContributionUpdateLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtContributionUpdateLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtContributionUpdateLogWhereInputSchema),z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionUpdateLogWhereInputSchema),z.lazy(() => EvtContributionUpdateLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict());

export const EvtContributionUpdateLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtContributionUpdateLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtContributionUpdateLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtContributionUpdateLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtContributionUpdateLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtContributionUpdateLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const EvtClaimLogWhereInputSchema: z.ZodType<Prisma.EvtClaimLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => EvtClaimLogWhereInputSchema),z.lazy(() => EvtClaimLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtClaimLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtClaimLogWhereInputSchema),z.lazy(() => EvtClaimLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimType: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const EvtClaimLogOrderByWithRelationInputSchema: z.ZodType<Prisma.EvtClaimLogOrderByWithRelationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogWhereUniqueInputSchema: z.ZodType<Prisma.EvtClaimLogWhereUniqueInput> = z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtClaimLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema)
})
.and(z.object({
  blockNumber_txnIndex_logIndex: z.lazy(() => EvtClaimLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => EvtClaimLogWhereInputSchema),z.lazy(() => EvtClaimLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtClaimLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtClaimLogWhereInputSchema),z.lazy(() => EvtClaimLogWhereInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimType: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
}).strict());

export const EvtClaimLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.EvtClaimLogOrderByWithAggregationInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => EvtClaimLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EvtClaimLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EvtClaimLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EvtClaimLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EvtClaimLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const EvtClaimLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EvtClaimLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => EvtClaimLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtClaimLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EvtClaimLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EvtClaimLogScalarWhereWithAggregatesInputSchema),z.lazy(() => EvtClaimLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  blockNumber: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  logIndex: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  blockTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  txnHash: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimType: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const KLine5mWhereInputSchema: z.ZodType<Prisma.KLine5mWhereInput> = z.object({
  AND: z.union([ z.lazy(() => KLine5mWhereInputSchema),z.lazy(() => KLine5mWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine5mWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine5mWhereInputSchema),z.lazy(() => KLine5mWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const KLine5mOrderByWithRelationInputSchema: z.ZodType<Prisma.KLine5mOrderByWithRelationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mWhereUniqueInputSchema: z.ZodType<Prisma.KLine5mWhereUniqueInput> = z.object({
  tokenId_openTs: z.lazy(() => KLine5mTokenIdOpenTsCompoundUniqueInputSchema)
})
.and(z.object({
  tokenId_openTs: z.lazy(() => KLine5mTokenIdOpenTsCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => KLine5mWhereInputSchema),z.lazy(() => KLine5mWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine5mWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine5mWhereInputSchema),z.lazy(() => KLine5mWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const KLine5mOrderByWithAggregationInputSchema: z.ZodType<Prisma.KLine5mOrderByWithAggregationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => KLine5mCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => KLine5mAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => KLine5mMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => KLine5mMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => KLine5mSumOrderByAggregateInputSchema).optional()
}).strict();

export const KLine5mScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.KLine5mScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => KLine5mScalarWhereWithAggregatesInputSchema),z.lazy(() => KLine5mScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine5mScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine5mScalarWhereWithAggregatesInputSchema),z.lazy(() => KLine5mScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const KLine1mWhereInputSchema: z.ZodType<Prisma.KLine1mWhereInput> = z.object({
  AND: z.union([ z.lazy(() => KLine1mWhereInputSchema),z.lazy(() => KLine1mWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine1mWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine1mWhereInputSchema),z.lazy(() => KLine1mWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const KLine1mOrderByWithRelationInputSchema: z.ZodType<Prisma.KLine1mOrderByWithRelationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mWhereUniqueInputSchema: z.ZodType<Prisma.KLine1mWhereUniqueInput> = z.object({
  tokenId_openTs: z.lazy(() => KLine1mTokenIdOpenTsCompoundUniqueInputSchema)
})
.and(z.object({
  tokenId_openTs: z.lazy(() => KLine1mTokenIdOpenTsCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => KLine1mWhereInputSchema),z.lazy(() => KLine1mWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine1mWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine1mWhereInputSchema),z.lazy(() => KLine1mWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const KLine1mOrderByWithAggregationInputSchema: z.ZodType<Prisma.KLine1mOrderByWithAggregationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => KLine1mCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => KLine1mAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => KLine1mMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => KLine1mMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => KLine1mSumOrderByAggregateInputSchema).optional()
}).strict();

export const KLine1mScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.KLine1mScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => KLine1mScalarWhereWithAggregatesInputSchema),z.lazy(() => KLine1mScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => KLine1mScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KLine1mScalarWhereWithAggregatesInputSchema),z.lazy(() => KLine1mScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  openTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  closeTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  open: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  high: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  low: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  close: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  volume: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  txnNum: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const ContributionInfoWhereInputSchema: z.ZodType<Prisma.ContributionInfoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionInfoWhereInputSchema),z.lazy(() => ContributionInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionInfoWhereInputSchema),z.lazy(() => ContributionInfoWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  startTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const ContributionInfoOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributionInfoOrderByWithRelationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoWhereUniqueInputSchema: z.ZodType<Prisma.ContributionInfoWhereUniqueInput> = z.object({
  tokenId_cycleId: z.lazy(() => ContributionInfoTokenIdCycleIdCompoundUniqueInputSchema)
})
.and(z.object({
  tokenId_cycleId: z.lazy(() => ContributionInfoTokenIdCycleIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ContributionInfoWhereInputSchema),z.lazy(() => ContributionInfoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionInfoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionInfoWhereInputSchema),z.lazy(() => ContributionInfoWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  startTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const ContributionInfoOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributionInfoOrderByWithAggregationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributionInfoCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContributionInfoAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributionInfoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributionInfoMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContributionInfoSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContributionInfoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributionInfoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionInfoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionInfoScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionInfoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  startTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const ContributionDetailWhereInputSchema: z.ZodType<Prisma.ContributionDetailWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionDetailWhereInputSchema),z.lazy(() => ContributionDetailWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionDetailWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionDetailWhereInputSchema),z.lazy(() => ContributionDetailWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  updateTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const ContributionDetailOrderByWithRelationInputSchema: z.ZodType<Prisma.ContributionDetailOrderByWithRelationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailWhereUniqueInputSchema: z.ZodType<Prisma.ContributionDetailWhereUniqueInput> = z.object({
  tokenId_cycleId_contributor: z.lazy(() => ContributionDetailTokenIdCycleIdContributorCompoundUniqueInputSchema)
})
.and(z.object({
  tokenId_cycleId_contributor: z.lazy(() => ContributionDetailTokenIdCycleIdContributorCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ContributionDetailWhereInputSchema),z.lazy(() => ContributionDetailWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionDetailWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionDetailWhereInputSchema),z.lazy(() => ContributionDetailWhereInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  updateTs: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const ContributionDetailOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContributionDetailOrderByWithAggregationInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContributionDetailCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContributionDetailAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContributionDetailMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContributionDetailMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContributionDetailSumOrderByAggregateInputSchema).optional()
}).strict();

export const ContributionDetailScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContributionDetailScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContributionDetailScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionDetailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributionDetailScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributionDetailScalarWhereWithAggregatesInputSchema),z.lazy(() => ContributionDetailScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  tokenId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  cycleId: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
  contributor: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  updateTs: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const UserClaimHistoryWhereInputSchema: z.ZodType<Prisma.UserClaimHistoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserClaimHistoryWhereInputSchema),z.lazy(() => UserClaimHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserClaimHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserClaimHistoryWhereInputSchema),z.lazy(() => UserClaimHistoryWhereInputSchema).array() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  claimType: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  claimAmount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const UserClaimHistoryOrderByWithRelationInputSchema: z.ZodType<Prisma.UserClaimHistoryOrderByWithRelationInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistoryWhereUniqueInputSchema: z.ZodType<Prisma.UserClaimHistoryWhereUniqueInput> = z.object({
  userAddress_tokenAddress: z.lazy(() => UserClaimHistoryUserAddressTokenAddressCompoundUniqueInputSchema)
})
.and(z.object({
  userAddress_tokenAddress: z.lazy(() => UserClaimHistoryUserAddressTokenAddressCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserClaimHistoryWhereInputSchema),z.lazy(() => UserClaimHistoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserClaimHistoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserClaimHistoryWhereInputSchema),z.lazy(() => UserClaimHistoryWhereInputSchema).array() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  claimType: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  claimAmount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimTime: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict());

export const UserClaimHistoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserClaimHistoryOrderByWithAggregationInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserClaimHistoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserClaimHistoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserClaimHistoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserClaimHistoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserClaimHistorySumOrderByAggregateInputSchema).optional()
}).strict();

export const UserClaimHistoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserClaimHistoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserClaimHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => UserClaimHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserClaimHistoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserClaimHistoryScalarWhereWithAggregatesInputSchema),z.lazy(() => UserClaimHistoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tokenAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  claimType: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  claimAmount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  claimTime: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
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
  contributions: z.lazy(() => ContributorCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
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
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
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
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
  uniswapV3Pair: z.string().optional().nullable()
}).strict();

export const DaoTokenInfoUpdateManyMutationInputSchema: z.ZodType<Prisma.DaoTokenInfoUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const DaoTokenInfoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AssetTokenCreateInputSchema: z.ZodType<Prisma.AssetTokenCreateInput> = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUncheckedCreateInputSchema: z.ZodType<Prisma.AssetTokenUncheckedCreateInput> = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUpdateInputSchema: z.ZodType<Prisma.AssetTokenUpdateInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.AssetTokenUncheckedUpdateInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenCreateManyInputSchema: z.ZodType<Prisma.AssetTokenCreateManyInput> = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  logoUrl: z.string(),
  priceUsd: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  isAllowed: z.boolean().optional(),
  isNative: z.boolean().optional(),
  isValid: z.boolean().optional()
}).strict();

export const AssetTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.AssetTokenUpdateManyMutationInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isNative: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AssetTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AssetTokenUncheckedUpdateManyInput> = z.object({
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  priceUsd: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContributorCreateInputSchema: z.ZodType<Prisma.ContributorCreateInput> = z.object({
  id: z.string().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributorsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorUncheckedCreateInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorUpdateInputSchema: z.ZodType<Prisma.ContributorUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributorsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorCreateManyInputSchema: z.ZodType<Prisma.ContributorCreateManyInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const ContributorUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributorUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryCreateInputSchema: z.ZodType<Prisma.ContributorHistoryCreateInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  contributor: z.lazy(() => ContributorCreateNestedOneWithoutHistoriesInputSchema)
}).strict();

export const ContributorHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  contributorId: z.string()
}).strict();

export const ContributorHistoryUpdateInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.lazy(() => ContributorUpdateOneRequiredWithoutHistoriesNestedInputSchema).optional()
}).strict();

export const ContributorHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryCreateManyInputSchema: z.ZodType<Prisma.ContributorHistoryCreateManyInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  contributorId: z.string()
}).strict();

export const ContributorHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTxnLogCreateInputSchema: z.ZodType<Prisma.EvtTxnLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  address: z.string(),
  topic0: z.string(),
  topic1: z.string().optional().nullable(),
  topic2: z.string().optional().nullable(),
  topic3: z.string().optional().nullable(),
  data: z.string().optional().nullable()
}).strict();

export const EvtTxnLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtTxnLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  address: z.string(),
  topic0: z.string(),
  topic1: z.string().optional().nullable(),
  topic2: z.string().optional().nullable(),
  topic3: z.string().optional().nullable(),
  data: z.string().optional().nullable()
}).strict();

export const EvtTxnLogUpdateInputSchema: z.ZodType<Prisma.EvtTxnLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic0: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic1: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic2: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic3: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtTxnLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtTxnLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic0: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic1: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic2: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic3: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtTxnLogCreateManyInputSchema: z.ZodType<Prisma.EvtTxnLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  address: z.string(),
  topic0: z.string(),
  topic1: z.string().optional().nullable(),
  topic2: z.string().optional().nullable(),
  topic3: z.string().optional().nullable(),
  data: z.string().optional().nullable()
}).strict();

export const EvtTxnLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtTxnLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic0: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic1: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic2: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic3: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtTxnLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtTxnLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic0: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic1: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic2: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  topic3: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  data: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtTokenLogCreateInputSchema: z.ZodType<Prisma.EvtTokenLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  assetAddress: z.string(),
  initPrice: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userAddress: z.string()
}).strict();

export const EvtTokenLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtTokenLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  assetAddress: z.string(),
  initPrice: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userAddress: z.string()
}).strict();

export const EvtTokenLogUpdateInputSchema: z.ZodType<Prisma.EvtTokenLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  initPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtTokenLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  initPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLogCreateManyInputSchema: z.ZodType<Prisma.EvtTokenLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  assetAddress: z.string(),
  initPrice: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userAddress: z.string()
}).strict();

export const EvtTokenLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtTokenLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  initPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtTokenLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  initPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtGraduatedLogCreateInputSchema: z.ZodType<Prisma.EvtGraduatedLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  tokenAddress: z.string(),
  uniswapPool: z.string()
}).strict();

export const EvtGraduatedLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtGraduatedLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  tokenAddress: z.string(),
  uniswapPool: z.string()
}).strict();

export const EvtGraduatedLogUpdateInputSchema: z.ZodType<Prisma.EvtGraduatedLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapPool: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtGraduatedLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtGraduatedLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapPool: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtGraduatedLogCreateManyInputSchema: z.ZodType<Prisma.EvtGraduatedLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  tokenAddress: z.string(),
  uniswapPool: z.string()
}).strict();

export const EvtGraduatedLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtGraduatedLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapPool: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtGraduatedLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtGraduatedLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uniswapPool: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLockLogCreateInputSchema: z.ZodType<Prisma.EvtTokenLockLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lockPeriod: z.bigint(),
  lockStart: z.bigint()
}).strict();

export const EvtTokenLockLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtTokenLockLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lockPeriod: z.bigint(),
  lockStart: z.bigint()
}).strict();

export const EvtTokenLockLogUpdateInputSchema: z.ZodType<Prisma.EvtTokenLockLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lockPeriod: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  lockStart: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLockLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtTokenLockLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lockPeriod: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  lockStart: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLockLogCreateManyInputSchema: z.ZodType<Prisma.EvtTokenLockLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lockPeriod: z.bigint(),
  lockStart: z.bigint()
}).strict();

export const EvtTokenLockLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtTokenLockLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lockPeriod: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  lockStart: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTokenLockLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtTokenLockLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lockPeriod: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  lockStart: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTradeLogCreateInputSchema: z.ZodType<Prisma.EvtTradeLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  userAddress: z.string(),
  assetAddress: z.string(),
  tradeType: z.number().int(),
  amountIn: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amountOut: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtTradeLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtTradeLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  userAddress: z.string(),
  assetAddress: z.string(),
  tradeType: z.number().int(),
  amountIn: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amountOut: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtTradeLogUpdateInputSchema: z.ZodType<Prisma.EvtTradeLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradeType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amountIn: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amountOut: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTradeLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtTradeLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradeType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amountIn: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amountOut: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTradeLogCreateManyInputSchema: z.ZodType<Prisma.EvtTradeLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  userAddress: z.string(),
  assetAddress: z.string(),
  tradeType: z.number().int(),
  amountIn: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amountOut: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtTradeLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtTradeLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradeType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amountIn: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amountOut: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtTradeLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtTradeLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tradeType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amountIn: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amountOut: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtAssetLogCreateInputSchema: z.ZodType<Prisma.EvtAssetLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  decimals: z.number().int(),
  isAllowed: z.boolean().optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable()
}).strict();

export const EvtAssetLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtAssetLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  decimals: z.number().int(),
  isAllowed: z.boolean().optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable()
}).strict();

export const EvtAssetLogUpdateInputSchema: z.ZodType<Prisma.EvtAssetLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtAssetLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtAssetLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtAssetLogCreateManyInputSchema: z.ZodType<Prisma.EvtAssetLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  decimals: z.number().int(),
  isAllowed: z.boolean().optional(),
  launchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable()
}).strict();

export const EvtAssetLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtAssetLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtAssetLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtAssetLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  decimals: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  isAllowed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  launchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const EvtAssetFeeLogCreateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  oldLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  newLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtAssetFeeLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  oldLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  newLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtAssetFeeLogUpdateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  oldLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  newLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtAssetFeeLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  oldLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  newLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtAssetFeeLogCreateManyInputSchema: z.ZodType<Prisma.EvtAssetFeeLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  assetAddress: z.string(),
  oldLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  newLaunchFee: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtAssetFeeLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtAssetFeeLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  oldLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  newLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtAssetFeeLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtAssetFeeLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assetAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  oldLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  newLaunchFee: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionStartLogCreateInputSchema: z.ZodType<Prisma.EvtContributionStartLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint()
}).strict();

export const EvtContributionStartLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtContributionStartLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint()
}).strict();

export const EvtContributionStartLogUpdateInputSchema: z.ZodType<Prisma.EvtContributionStartLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionStartLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtContributionStartLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionStartLogCreateManyInputSchema: z.ZodType<Prisma.EvtContributionStartLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint()
}).strict();

export const EvtContributionStartLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtContributionStartLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionStartLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtContributionStartLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionUpdateLogCreateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtContributionUpdateLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtContributionUpdateLogUpdateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionUpdateLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionUpdateLogCreateManyInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const EvtContributionUpdateLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtContributionUpdateLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtClaimLogCreateInputSchema: z.ZodType<Prisma.EvtClaimLogCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  userAddress: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimType: z.number().int()
}).strict();

export const EvtClaimLogUncheckedCreateInputSchema: z.ZodType<Prisma.EvtClaimLogUncheckedCreateInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  userAddress: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimType: z.number().int()
}).strict();

export const EvtClaimLogUpdateInputSchema: z.ZodType<Prisma.EvtClaimLogUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtClaimLogUncheckedUpdateInputSchema: z.ZodType<Prisma.EvtClaimLogUncheckedUpdateInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtClaimLogCreateManyInputSchema: z.ZodType<Prisma.EvtClaimLogCreateManyInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint(),
  blockTime: z.bigint(),
  txnHash: z.string(),
  tokenAddress: z.string(),
  userAddress: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimType: z.number().int()
}).strict();

export const EvtClaimLogUpdateManyMutationInputSchema: z.ZodType<Prisma.EvtClaimLogUpdateManyMutationInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const EvtClaimLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EvtClaimLogUncheckedUpdateManyInput> = z.object({
  blockNumber: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  logIndex: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  blockTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  txnHash: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine5mCreateInputSchema: z.ZodType<Prisma.KLine5mCreateInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine5mUncheckedCreateInputSchema: z.ZodType<Prisma.KLine5mUncheckedCreateInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine5mUpdateInputSchema: z.ZodType<Prisma.KLine5mUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine5mUncheckedUpdateInputSchema: z.ZodType<Prisma.KLine5mUncheckedUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine5mCreateManyInputSchema: z.ZodType<Prisma.KLine5mCreateManyInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine5mUpdateManyMutationInputSchema: z.ZodType<Prisma.KLine5mUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine5mUncheckedUpdateManyInputSchema: z.ZodType<Prisma.KLine5mUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine1mCreateInputSchema: z.ZodType<Prisma.KLine1mCreateInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine1mUncheckedCreateInputSchema: z.ZodType<Prisma.KLine1mUncheckedCreateInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine1mUpdateInputSchema: z.ZodType<Prisma.KLine1mUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine1mUncheckedUpdateInputSchema: z.ZodType<Prisma.KLine1mUncheckedUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine1mCreateManyInputSchema: z.ZodType<Prisma.KLine1mCreateManyInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint(),
  closeTs: z.bigint(),
  open: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  high: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  low: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  close: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  volume: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  amount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  txnNum: z.bigint()
}).strict();

export const KLine1mUpdateManyMutationInputSchema: z.ZodType<Prisma.KLine1mUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KLine1mUncheckedUpdateManyInputSchema: z.ZodType<Prisma.KLine1mUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  openTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  closeTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  open: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  high: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  low: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  close: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  volume: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  txnNum: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionInfoCreateInputSchema: z.ZodType<Prisma.ContributionInfoCreateInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  startTs: z.bigint()
}).strict();

export const ContributionInfoUncheckedCreateInputSchema: z.ZodType<Prisma.ContributionInfoUncheckedCreateInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  startTs: z.bigint()
}).strict();

export const ContributionInfoUpdateInputSchema: z.ZodType<Prisma.ContributionInfoUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  startTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionInfoUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributionInfoUncheckedUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  startTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionInfoCreateManyInputSchema: z.ZodType<Prisma.ContributionInfoCreateManyInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  startTs: z.bigint()
}).strict();

export const ContributionInfoUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributionInfoUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  startTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionInfoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributionInfoUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  startTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionDetailCreateInputSchema: z.ZodType<Prisma.ContributionDetailCreateInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  updateTs: z.bigint()
}).strict();

export const ContributionDetailUncheckedCreateInputSchema: z.ZodType<Prisma.ContributionDetailUncheckedCreateInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  updateTs: z.bigint()
}).strict();

export const ContributionDetailUpdateInputSchema: z.ZodType<Prisma.ContributionDetailUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  updateTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionDetailUncheckedUpdateInputSchema: z.ZodType<Prisma.ContributionDetailUncheckedUpdateInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  updateTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionDetailCreateManyInputSchema: z.ZodType<Prisma.ContributionDetailCreateManyInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string(),
  contributorId: z.string(),
  score: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  updateTs: z.bigint()
}).strict();

export const ContributionDetailUpdateManyMutationInputSchema: z.ZodType<Prisma.ContributionDetailUpdateManyMutationInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  updateTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributionDetailUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContributionDetailUncheckedUpdateManyInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  cycleId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  contributor: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contributorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  updateTs: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserClaimHistoryCreateInputSchema: z.ZodType<Prisma.UserClaimHistoryCreateInput> = z.object({
  userAddress: z.string(),
  tokenAddress: z.string(),
  claimType: z.number().int(),
  claimAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimTime: z.bigint()
}).strict();

export const UserClaimHistoryUncheckedCreateInputSchema: z.ZodType<Prisma.UserClaimHistoryUncheckedCreateInput> = z.object({
  userAddress: z.string(),
  tokenAddress: z.string(),
  claimType: z.number().int(),
  claimAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimTime: z.bigint()
}).strict();

export const UserClaimHistoryUpdateInputSchema: z.ZodType<Prisma.UserClaimHistoryUpdateInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  claimAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserClaimHistoryUncheckedUpdateInputSchema: z.ZodType<Prisma.UserClaimHistoryUncheckedUpdateInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  claimAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserClaimHistoryCreateManyInputSchema: z.ZodType<Prisma.UserClaimHistoryCreateManyInput> = z.object({
  userAddress: z.string(),
  tokenAddress: z.string(),
  claimType: z.number().int(),
  claimAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  claimTime: z.bigint()
}).strict();

export const UserClaimHistoryUpdateManyMutationInputSchema: z.ZodType<Prisma.UserClaimHistoryUpdateManyMutationInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  claimAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserClaimHistoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserClaimHistoryUncheckedUpdateManyInput> = z.object({
  userAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  claimType: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  claimAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  claimTime: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContributorListRelationFilterSchema: z.ZodType<Prisma.ContributorListRelationFilter> = z.object({
  every: z.lazy(() => ContributorWhereInputSchema).optional(),
  some: z.lazy(() => ContributorWhereInputSchema).optional(),
  none: z.lazy(() => ContributorWhereInputSchema).optional()
}).strict();

export const DaoStarOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoStarOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.DaoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContributorOrderByRelationAggregateInput> = z.object({
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

export const DecimalNullableFilterSchema: z.ZodType<Prisma.DecimalNullableFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableFilterSchema) ]).optional().nullable(),
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
  isGraduated: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  raisedAssetAmount: z.lazy(() => SortOrderSchema).optional(),
  salesRatio: z.lazy(() => SortOrderSchema).optional(),
  reservedRatio: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  graduatedAt: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  raisedAssetAmount: z.lazy(() => SortOrderSchema).optional(),
  salesRatio: z.lazy(() => SortOrderSchema).optional(),
  reservedRatio: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  isGraduated: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  raisedAssetAmount: z.lazy(() => SortOrderSchema).optional(),
  salesRatio: z.lazy(() => SortOrderSchema).optional(),
  reservedRatio: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  graduatedAt: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoMinOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  ticker: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => SortOrderSchema).optional(),
  isGraduated: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  raisedAssetAmount: z.lazy(() => SortOrderSchema).optional(),
  salesRatio: z.lazy(() => SortOrderSchema).optional(),
  reservedRatio: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional(),
  assetTokenAddress: z.lazy(() => SortOrderSchema).optional(),
  graduatedAt: z.lazy(() => SortOrderSchema).optional(),
  uniswapV3Pair: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DaoTokenInfoSumOrderByAggregateInputSchema: z.ZodType<Prisma.DaoTokenInfoSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  liquidity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  marketCap: z.lazy(() => SortOrderSchema).optional(),
  totalSupply: z.lazy(() => SortOrderSchema).optional(),
  raisedAssetAmount: z.lazy(() => SortOrderSchema).optional(),
  salesRatio: z.lazy(() => SortOrderSchema).optional(),
  reservedRatio: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  holderCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DecimalNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalNullableWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalNullableFilterSchema).optional()
}).strict();

export const AssetTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenCountOrderByAggregateInput> = z.object({
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
  decimals: z.lazy(() => SortOrderSchema).optional(),
  priceUsd: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AssetTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AssetTokenMaxOrderByAggregateInput> = z.object({
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

export const ContributorHistoryListRelationFilterSchema: z.ZodType<Prisma.ContributorHistoryListRelationFilter> = z.object({
  every: z.lazy(() => ContributorHistoryWhereInputSchema).optional(),
  some: z.lazy(() => ContributorHistoryWhereInputSchema).optional(),
  none: z.lazy(() => ContributorHistoryWhereInputSchema).optional()
}).strict();

export const ContributorHistoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContributorHistoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorAvgOrderByAggregateInput> = z.object({
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  daoId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  isValid: z.lazy(() => SortOrderSchema).optional(),
  userPlatformId: z.lazy(() => SortOrderSchema).optional(),
  userPlatformName: z.lazy(() => SortOrderSchema).optional(),
  userPlatformAvatar: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorSumOrderByAggregateInput> = z.object({
  snapshotValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorScalarRelationFilterSchema: z.ZodType<Prisma.ContributorScalarRelationFilter> = z.object({
  is: z.lazy(() => ContributorWhereInputSchema).optional(),
  isNot: z.lazy(() => ContributorWhereInputSchema).optional()
}).strict();

export const ContributorHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorHistoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorHistoryAvgOrderByAggregateInput> = z.object({
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorHistoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorHistoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  tag: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributorHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.ContributorHistorySumOrderByAggregateInput> = z.object({
  value: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTxnLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtTxnLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtTxnLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTxnLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  topic0: z.lazy(() => SortOrderSchema).optional(),
  topic1: z.lazy(() => SortOrderSchema).optional(),
  topic2: z.lazy(() => SortOrderSchema).optional(),
  topic3: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTxnLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTxnLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTxnLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTxnLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  topic0: z.lazy(() => SortOrderSchema).optional(),
  topic1: z.lazy(() => SortOrderSchema).optional(),
  topic2: z.lazy(() => SortOrderSchema).optional(),
  topic3: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTxnLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTxnLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  topic0: z.lazy(() => SortOrderSchema).optional(),
  topic1: z.lazy(() => SortOrderSchema).optional(),
  topic2: z.lazy(() => SortOrderSchema).optional(),
  topic3: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTxnLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTxnLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtTokenLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtTokenLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  initPrice: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtGraduatedLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtGraduatedLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtGraduatedLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  uniswapPool: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtGraduatedLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtGraduatedLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  uniswapPool: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtGraduatedLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  uniswapPool: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtGraduatedLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtGraduatedLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtTokenLockLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtTokenLockLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLockLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLockLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLockLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLockLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTokenLockLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTokenLockLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  unlockRatio: z.lazy(() => SortOrderSchema).optional(),
  lockPeriod: z.lazy(() => SortOrderSchema).optional(),
  lockStart: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtTradeLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtTradeLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTradeLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTradeLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTradeLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTradeLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtTradeLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtTradeLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  tradeType: z.lazy(() => SortOrderSchema).optional(),
  amountIn: z.lazy(() => SortOrderSchema).optional(),
  amountOut: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtAssetLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtAssetLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  isAllowed: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  decimals: z.lazy(() => SortOrderSchema).optional(),
  launchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtAssetFeeLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtAssetFeeLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  assetAddress: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtAssetFeeLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtAssetFeeLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  oldLaunchFee: z.lazy(() => SortOrderSchema).optional(),
  newLaunchFee: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtContributionStartLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtContributionStartLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionStartLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionStartLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionStartLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionStartLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionStartLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionStartLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtContributionUpdateLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtContributionUpdateLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtContributionUpdateLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogBlockNumberTxnIndexLogIndexCompoundUniqueInputSchema: z.ZodType<Prisma.EvtClaimLogBlockNumberTxnIndexLogIndexCompoundUniqueInput> = z.object({
  blockNumber: z.bigint(),
  txnIndex: z.bigint(),
  logIndex: z.bigint()
}).strict();

export const EvtClaimLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.EvtClaimLogCountOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EvtClaimLogAvgOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EvtClaimLogMaxOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.EvtClaimLogMinOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  txnHash: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EvtClaimLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.EvtClaimLogSumOrderByAggregateInput> = z.object({
  blockNumber: z.lazy(() => SortOrderSchema).optional(),
  txnIndex: z.lazy(() => SortOrderSchema).optional(),
  logIndex: z.lazy(() => SortOrderSchema).optional(),
  blockTime: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mTokenIdOpenTsCompoundUniqueInputSchema: z.ZodType<Prisma.KLine5mTokenIdOpenTsCompoundUniqueInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint()
}).strict();

export const KLine5mCountOrderByAggregateInputSchema: z.ZodType<Prisma.KLine5mCountOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mAvgOrderByAggregateInputSchema: z.ZodType<Prisma.KLine5mAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mMaxOrderByAggregateInputSchema: z.ZodType<Prisma.KLine5mMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mMinOrderByAggregateInputSchema: z.ZodType<Prisma.KLine5mMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine5mSumOrderByAggregateInputSchema: z.ZodType<Prisma.KLine5mSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mTokenIdOpenTsCompoundUniqueInputSchema: z.ZodType<Prisma.KLine1mTokenIdOpenTsCompoundUniqueInput> = z.object({
  tokenId: z.bigint(),
  openTs: z.bigint()
}).strict();

export const KLine1mCountOrderByAggregateInputSchema: z.ZodType<Prisma.KLine1mCountOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mAvgOrderByAggregateInputSchema: z.ZodType<Prisma.KLine1mAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mMaxOrderByAggregateInputSchema: z.ZodType<Prisma.KLine1mMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mMinOrderByAggregateInputSchema: z.ZodType<Prisma.KLine1mMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KLine1mSumOrderByAggregateInputSchema: z.ZodType<Prisma.KLine1mSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  openTs: z.lazy(() => SortOrderSchema).optional(),
  closeTs: z.lazy(() => SortOrderSchema).optional(),
  open: z.lazy(() => SortOrderSchema).optional(),
  high: z.lazy(() => SortOrderSchema).optional(),
  low: z.lazy(() => SortOrderSchema).optional(),
  close: z.lazy(() => SortOrderSchema).optional(),
  volume: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  txnNum: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoTokenIdCycleIdCompoundUniqueInputSchema: z.ZodType<Prisma.ContributionInfoTokenIdCycleIdCompoundUniqueInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint()
}).strict();

export const ContributionInfoCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionInfoCountOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionInfoAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionInfoMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionInfoMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionInfoSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionInfoSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  startTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailTokenIdCycleIdContributorCompoundUniqueInputSchema: z.ZodType<Prisma.ContributionDetailTokenIdCycleIdContributorCompoundUniqueInput> = z.object({
  tokenId: z.bigint(),
  cycleId: z.bigint(),
  contributor: z.string()
}).strict();

export const ContributionDetailCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionDetailCountOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionDetailAvgOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionDetailMaxOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionDetailMinOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  contributor: z.lazy(() => SortOrderSchema).optional(),
  contributorId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContributionDetailSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContributionDetailSumOrderByAggregateInput> = z.object({
  tokenId: z.lazy(() => SortOrderSchema).optional(),
  cycleId: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  updateTs: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistoryUserAddressTokenAddressCompoundUniqueInputSchema: z.ZodType<Prisma.UserClaimHistoryUserAddressTokenAddressCompoundUniqueInput> = z.object({
  userAddress: z.string(),
  tokenAddress: z.string()
}).strict();

export const UserClaimHistoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserClaimHistoryCountOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserClaimHistoryAvgOrderByAggregateInput> = z.object({
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserClaimHistoryMaxOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserClaimHistoryMinOrderByAggregateInput> = z.object({
  userAddress: z.lazy(() => SortOrderSchema).optional(),
  tokenAddress: z.lazy(() => SortOrderSchema).optional(),
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserClaimHistorySumOrderByAggregateInputSchema: z.ZodType<Prisma.UserClaimHistorySumOrderByAggregateInput> = z.object({
  claimType: z.lazy(() => SortOrderSchema).optional(),
  claimAmount: z.lazy(() => SortOrderSchema).optional(),
  claimTime: z.lazy(() => SortOrderSchema).optional()
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

export const ContributorCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContributorCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorCreateWithoutUserInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
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

export const ContributorUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorCreateWithoutUserInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
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

export const ContributorUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContributorUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorCreateWithoutUserInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributorUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributorUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContributorUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
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

export const ContributorUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorCreateWithoutUserInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributorUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContributorUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContributorUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
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

export const ContributorCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributorCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
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

export const ContributorUncheckedCreateNestedManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateNestedManyWithoutDaoInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyDaoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
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

export const ContributorUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ContributorUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributorUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributorUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ContributorUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
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

export const ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateManyWithoutDaoNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorCreateWithoutDaoInputSchema).array(),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema),z.lazy(() => ContributorCreateOrConnectWithoutDaoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorUpsertWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributorUpsertWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorCreateManyDaoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorWhereUniqueInputSchema),z.lazy(() => ContributorWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorUpdateWithWhereUniqueWithoutDaoInputSchema),z.lazy(() => ContributorUpdateWithWhereUniqueWithoutDaoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorUpdateManyWithWhereWithoutDaoInputSchema),z.lazy(() => ContributorUpdateManyWithWhereWithoutDaoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
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

export const NullableDecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  increment: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
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

export const DaoCreateNestedOneWithoutContributorsInputSchema: z.ZodType<Prisma.DaoCreateNestedOneWithoutContributorsInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContributorsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutContributionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutContributionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContributionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContributionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContributionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ContributorHistoryCreateNestedManyWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryCreateNestedManyWithoutContributorInput> = z.object({
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema).array(),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorHistoryCreateManyContributorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContributorHistoryUncheckedCreateNestedManyWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedCreateNestedManyWithoutContributorInput> = z.object({
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema).array(),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorHistoryCreateManyContributorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DaoUpdateOneRequiredWithoutContributorsNestedInputSchema: z.ZodType<Prisma.DaoUpdateOneRequiredWithoutContributorsNestedInput> = z.object({
  create: z.union([ z.lazy(() => DaoCreateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributorsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DaoCreateOrConnectWithoutContributorsInputSchema).optional(),
  upsert: z.lazy(() => DaoUpsertWithoutContributorsInputSchema).optional(),
  connect: z.lazy(() => DaoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DaoUpdateToOneWithWhereWithoutContributorsInputSchema),z.lazy(() => DaoUpdateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributorsInputSchema) ]).optional(),
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

export const ContributorHistoryUpdateManyWithoutContributorNestedInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateManyWithoutContributorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema).array(),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorHistoryUpsertWithWhereUniqueWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpsertWithWhereUniqueWithoutContributorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorHistoryCreateManyContributorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorHistoryUpdateWithWhereUniqueWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpdateWithWhereUniqueWithoutContributorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorHistoryUpdateManyWithWhereWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpdateManyWithWhereWithoutContributorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorHistoryScalarWhereInputSchema),z.lazy(() => ContributorHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributorHistoryUncheckedUpdateManyWithoutContributorNestedInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedUpdateManyWithoutContributorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema).array(),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema),z.lazy(() => ContributorHistoryCreateOrConnectWithoutContributorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContributorHistoryUpsertWithWhereUniqueWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpsertWithWhereUniqueWithoutContributorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContributorHistoryCreateManyContributorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContributorHistoryWhereUniqueInputSchema),z.lazy(() => ContributorHistoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContributorHistoryUpdateWithWhereUniqueWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpdateWithWhereUniqueWithoutContributorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContributorHistoryUpdateManyWithWhereWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUpdateManyWithWhereWithoutContributorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContributorHistoryScalarWhereInputSchema),z.lazy(() => ContributorHistoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContributorCreateNestedOneWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorCreateNestedOneWithoutHistoriesInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContributorCreateOrConnectWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => ContributorWhereUniqueInputSchema).optional()
}).strict();

export const ContributorUpdateOneRequiredWithoutHistoriesNestedInputSchema: z.ZodType<Prisma.ContributorUpdateOneRequiredWithoutHistoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContributorCreateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutHistoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContributorCreateOrConnectWithoutHistoriesInputSchema).optional(),
  upsert: z.lazy(() => ContributorUpsertWithoutHistoriesInputSchema).optional(),
  connect: z.lazy(() => ContributorWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContributorUpdateToOneWithWhereWithoutHistoriesInputSchema),z.lazy(() => ContributorUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutHistoriesInputSchema) ]).optional(),
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

export const NestedDecimalNullableFilterSchema: z.ZodType<Prisma.NestedDecimalNullableFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDecimalNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalNullableWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional().nullable(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalNullableFilterSchema).optional()
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
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

export const ContributorCreateWithoutUserInputSchema: z.ZodType<Prisma.ContributorCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributorsInputSchema),
  histories: z.lazy(() => ContributorHistoryCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ContributorCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContributorCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ContributorCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributorCreateManyUserInputSchema),z.lazy(() => ContributorCreateManyUserInputSchema).array() ]),
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

export const ContributorUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContributorUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributorUpdateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ContributorCreateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContributorUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContributorUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributorUpdateWithoutUserInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ContributorUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ContributorUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ContributorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributorUpdateManyMutationInputSchema),z.lazy(() => ContributorUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ContributorScalarWhereInputSchema: z.ZodType<Prisma.ContributorScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorScalarWhereInputSchema),z.lazy(() => ContributorScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  daoId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isValid: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  userPlatformId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userPlatformName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributions: z.lazy(() => ContributorCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributions: z.lazy(() => ContributorUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => ContributorCreateNestedManyWithoutUserInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutUserInputSchema).optional()
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
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
  uniswapV3Pair: z.string().optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderCreateNestedManyWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedCreateWithoutDaoInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
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

export const ContributorCreateWithoutDaoInputSchema: z.ZodType<Prisma.ContributorCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorUncheckedCreateWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateWithoutDaoInput> = z.object({
  id: z.string().optional(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedCreateNestedManyWithoutContributorInputSchema).optional()
}).strict();

export const ContributorCreateOrConnectWithoutDaoInputSchema: z.ZodType<Prisma.ContributorCreateOrConnectWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ContributorCreateManyDaoInputEnvelopeSchema: z.ZodType<Prisma.ContributorCreateManyDaoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributorCreateManyDaoInputSchema),z.lazy(() => ContributorCreateManyDaoInputSchema).array() ]),
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
  contributions: z.lazy(() => ContributorUpdateManyWithoutUserNestedInputSchema).optional()
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
  contributions: z.lazy(() => ContributorUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
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
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holders: z.lazy(() => DaoTokenHolderUpdateManyWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateWithoutDaoInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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

export const ContributorUpsertWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUpsertWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributorUpdateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutDaoInputSchema) ]),
  create: z.union([ z.lazy(() => ContributorCreateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutDaoInputSchema) ]),
}).strict();

export const ContributorUpdateWithWhereUniqueWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUpdateWithWhereUniqueWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributorUpdateWithoutDaoInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutDaoInputSchema) ]),
}).strict();

export const ContributorUpdateManyWithWhereWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUpdateManyWithWhereWithoutDaoInput> = z.object({
  where: z.lazy(() => ContributorScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributorUpdateManyMutationInputSchema),z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoInputSchema) ]),
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional()
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional()
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional()
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoCreateWithoutHoldersInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
  uniswapV3Pair: z.string().optional().nullable(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutTokenInfoInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedCreateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedCreateWithoutHoldersInput> = z.object({
  tokenId: z.bigint(),
  tokenAddress: z.string().optional().nullable(),
  name: z.string(),
  ticker: z.string(),
  creator: z.string(),
  isGraduated: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  liquidity: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  price: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  marketCap: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  totalSupply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  raisedAssetAmount: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  salesRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  reservedRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  unlockRatio: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional().nullable(),
  holderCount: z.number().int().optional(),
  assetTokenAddress: z.string().optional().nullable(),
  graduatedAt: z.coerce.date().optional().nullable(),
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
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  uniswapV3Pair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dao: z.lazy(() => DaoUpdateOneWithoutTokenInfoNestedInputSchema).optional()
}).strict();

export const DaoTokenInfoUncheckedUpdateWithoutHoldersInputSchema: z.ZodType<Prisma.DaoTokenInfoUncheckedUpdateWithoutHoldersInput> = z.object({
  tokenId: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  tokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ticker: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isGraduated: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  liquidity: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  marketCap: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  totalSupply: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  raisedAssetAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  salesRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  reservedRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  unlockRatio: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NullableDecimalFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  holderCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  assetTokenAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  graduatedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedCreateNestedManyWithoutDaoInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
  contents: z.lazy(() => DaoContentUncheckedUpdateManyWithoutDaoNestedInputSchema).optional()
}).strict();

export const DaoCreateWithoutContributorsInputSchema: z.ZodType<Prisma.DaoCreateWithoutContributorsInput> = z.object({
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

export const DaoUncheckedCreateWithoutContributorsInputSchema: z.ZodType<Prisma.DaoUncheckedCreateWithoutContributorsInput> = z.object({
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

export const DaoCreateOrConnectWithoutContributorsInputSchema: z.ZodType<Prisma.DaoCreateOrConnectWithoutContributorsInput> = z.object({
  where: z.lazy(() => DaoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DaoCreateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributorsInputSchema) ]),
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

export const ContributorHistoryCreateWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryCreateWithoutContributorInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ContributorHistoryUncheckedCreateWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedCreateWithoutContributorInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ContributorHistoryCreateOrConnectWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryCreateOrConnectWithoutContributorInput> = z.object({
  where: z.lazy(() => ContributorHistoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema) ]),
}).strict();

export const ContributorHistoryCreateManyContributorInputEnvelopeSchema: z.ZodType<Prisma.ContributorHistoryCreateManyContributorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContributorHistoryCreateManyContributorInputSchema),z.lazy(() => ContributorHistoryCreateManyContributorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const DaoUpsertWithoutContributorsInputSchema: z.ZodType<Prisma.DaoUpsertWithoutContributorsInput> = z.object({
  update: z.union([ z.lazy(() => DaoUpdateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributorsInputSchema) ]),
  create: z.union([ z.lazy(() => DaoCreateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedCreateWithoutContributorsInputSchema) ]),
  where: z.lazy(() => DaoWhereInputSchema).optional()
}).strict();

export const DaoUpdateToOneWithWhereWithoutContributorsInputSchema: z.ZodType<Prisma.DaoUpdateToOneWithWhereWithoutContributorsInput> = z.object({
  where: z.lazy(() => DaoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DaoUpdateWithoutContributorsInputSchema),z.lazy(() => DaoUncheckedUpdateWithoutContributorsInputSchema) ]),
}).strict();

export const DaoUpdateWithoutContributorsInputSchema: z.ZodType<Prisma.DaoUpdateWithoutContributorsInput> = z.object({
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

export const DaoUncheckedUpdateWithoutContributorsInputSchema: z.ZodType<Prisma.DaoUncheckedUpdateWithoutContributorsInput> = z.object({
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

export const ContributorHistoryUpsertWithWhereUniqueWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUpsertWithWhereUniqueWithoutContributorInput> = z.object({
  where: z.lazy(() => ContributorHistoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContributorHistoryUpdateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedUpdateWithoutContributorInputSchema) ]),
  create: z.union([ z.lazy(() => ContributorHistoryCreateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedCreateWithoutContributorInputSchema) ]),
}).strict();

export const ContributorHistoryUpdateWithWhereUniqueWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateWithWhereUniqueWithoutContributorInput> = z.object({
  where: z.lazy(() => ContributorHistoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContributorHistoryUpdateWithoutContributorInputSchema),z.lazy(() => ContributorHistoryUncheckedUpdateWithoutContributorInputSchema) ]),
}).strict();

export const ContributorHistoryUpdateManyWithWhereWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateManyWithWhereWithoutContributorInput> = z.object({
  where: z.lazy(() => ContributorHistoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContributorHistoryUpdateManyMutationInputSchema),z.lazy(() => ContributorHistoryUncheckedUpdateManyWithoutContributorInputSchema) ]),
}).strict();

export const ContributorHistoryScalarWhereInputSchema: z.ZodType<Prisma.ContributorHistoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContributorHistoryScalarWhereInputSchema),z.lazy(() => ContributorHistoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContributorHistoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContributorHistoryScalarWhereInputSchema),z.lazy(() => ContributorHistoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tag: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contributorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ContributorCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorCreateWithoutHistoriesInput> = z.object({
  id: z.string().optional(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  dao: z.lazy(() => DaoCreateNestedOneWithoutContributorsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutContributionsInputSchema).optional()
}).strict();

export const ContributorUncheckedCreateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorUncheckedCreateWithoutHistoriesInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
  userPlatformAvatar: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  snapshotValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const ContributorCreateOrConnectWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorCreateOrConnectWithoutHistoriesInput> = z.object({
  where: z.lazy(() => ContributorWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContributorCreateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutHistoriesInputSchema) ]),
}).strict();

export const ContributorUpsertWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorUpsertWithoutHistoriesInput> = z.object({
  update: z.union([ z.lazy(() => ContributorUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutHistoriesInputSchema) ]),
  create: z.union([ z.lazy(() => ContributorCreateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedCreateWithoutHistoriesInputSchema) ]),
  where: z.lazy(() => ContributorWhereInputSchema).optional()
}).strict();

export const ContributorUpdateToOneWithWhereWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorUpdateToOneWithWhereWithoutHistoriesInput> = z.object({
  where: z.lazy(() => ContributorWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContributorUpdateWithoutHistoriesInputSchema),z.lazy(() => ContributorUncheckedUpdateWithoutHistoriesInputSchema) ]),
}).strict();

export const ContributorUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributorsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateWithoutHistoriesInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateWithoutHistoriesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContributorCreateManyUserInputSchema: z.ZodType<Prisma.ContributorCreateManyUserInput> = z.object({
  id: z.string().optional(),
  daoId: z.string(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
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
  contributors: z.lazy(() => ContributorUpdateManyWithoutDaoNestedInputSchema).optional(),
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
  contributors: z.lazy(() => ContributorUncheckedUpdateManyWithoutDaoNestedInputSchema).optional(),
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

export const ContributorUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContributorUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  dao: z.lazy(() => DaoUpdateOneRequiredWithoutContributorsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  daoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContributorCreateManyDaoInputSchema: z.ZodType<Prisma.ContributorCreateManyDaoInput> = z.object({
  id: z.string().optional(),
  userAddress: z.string().optional().nullable(),
  isValid: z.boolean().optional(),
  userPlatformId: z.string(),
  userPlatformName: z.string(),
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

export const ContributorUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutContributionsNestedInputSchema).optional(),
  histories: z.lazy(() => ContributorHistoryUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformAvatar: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  snapshotValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  histories: z.lazy(() => ContributorHistoryUncheckedUpdateManyWithoutContributorNestedInputSchema).optional()
}).strict();

export const ContributorUncheckedUpdateManyWithoutDaoInputSchema: z.ZodType<Prisma.ContributorUncheckedUpdateManyWithoutDaoInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isValid: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userPlatformName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ContributorHistoryCreateManyContributorInputSchema: z.ZodType<Prisma.ContributorHistoryCreateManyContributorInput> = z.object({
  id: z.string().optional(),
  tag: z.string(),
  value: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ContributorHistoryUpdateWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUpdateWithoutContributorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryUncheckedUpdateWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedUpdateWithoutContributorInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tag: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContributorHistoryUncheckedUpdateManyWithoutContributorInputSchema: z.ZodType<Prisma.ContributorHistoryUncheckedUpdateManyWithoutContributorInput> = z.object({
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

export const ContributorFindFirstArgsSchema: z.ZodType<Prisma.ContributorFindFirstArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereInputSchema.optional(),
  orderBy: z.union([ ContributorOrderByWithRelationInputSchema.array(),ContributorOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorScalarFieldEnumSchema,ContributorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributorFindFirstOrThrowArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereInputSchema.optional(),
  orderBy: z.union([ ContributorOrderByWithRelationInputSchema.array(),ContributorOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorScalarFieldEnumSchema,ContributorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorFindManyArgsSchema: z.ZodType<Prisma.ContributorFindManyArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereInputSchema.optional(),
  orderBy: z.union([ ContributorOrderByWithRelationInputSchema.array(),ContributorOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorScalarFieldEnumSchema,ContributorScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorAggregateArgsSchema: z.ZodType<Prisma.ContributorAggregateArgs> = z.object({
  where: ContributorWhereInputSchema.optional(),
  orderBy: z.union([ ContributorOrderByWithRelationInputSchema.array(),ContributorOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributorGroupByArgsSchema: z.ZodType<Prisma.ContributorGroupByArgs> = z.object({
  where: ContributorWhereInputSchema.optional(),
  orderBy: z.union([ ContributorOrderByWithAggregationInputSchema.array(),ContributorOrderByWithAggregationInputSchema ]).optional(),
  by: ContributorScalarFieldEnumSchema.array(),
  having: ContributorScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributorFindUniqueArgsSchema: z.ZodType<Prisma.ContributorFindUniqueArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereUniqueInputSchema,
}).strict() ;

export const ContributorFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributorFindUniqueOrThrowArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereUniqueInputSchema,
}).strict() ;

export const ContributorHistoryFindFirstArgsSchema: z.ZodType<Prisma.ContributorHistoryFindFirstArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributorHistoryOrderByWithRelationInputSchema.array(),ContributorHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorHistoryScalarFieldEnumSchema,ContributorHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributorHistoryFindFirstOrThrowArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributorHistoryOrderByWithRelationInputSchema.array(),ContributorHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorHistoryScalarFieldEnumSchema,ContributorHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorHistoryFindManyArgsSchema: z.ZodType<Prisma.ContributorHistoryFindManyArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributorHistoryOrderByWithRelationInputSchema.array(),ContributorHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributorHistoryScalarFieldEnumSchema,ContributorHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributorHistoryAggregateArgsSchema: z.ZodType<Prisma.ContributorHistoryAggregateArgs> = z.object({
  where: ContributorHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributorHistoryOrderByWithRelationInputSchema.array(),ContributorHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributorHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributorHistoryGroupByArgsSchema: z.ZodType<Prisma.ContributorHistoryGroupByArgs> = z.object({
  where: ContributorHistoryWhereInputSchema.optional(),
  orderBy: z.union([ ContributorHistoryOrderByWithAggregationInputSchema.array(),ContributorHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: ContributorHistoryScalarFieldEnumSchema.array(),
  having: ContributorHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributorHistoryFindUniqueArgsSchema: z.ZodType<Prisma.ContributorHistoryFindUniqueArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributorHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributorHistoryFindUniqueOrThrowArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereUniqueInputSchema,
}).strict() ;

export const EvtTxnLogFindFirstArgsSchema: z.ZodType<Prisma.EvtTxnLogFindFirstArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTxnLogOrderByWithRelationInputSchema.array(),EvtTxnLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTxnLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTxnLogScalarFieldEnumSchema,EvtTxnLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTxnLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtTxnLogFindFirstOrThrowArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTxnLogOrderByWithRelationInputSchema.array(),EvtTxnLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTxnLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTxnLogScalarFieldEnumSchema,EvtTxnLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTxnLogFindManyArgsSchema: z.ZodType<Prisma.EvtTxnLogFindManyArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTxnLogOrderByWithRelationInputSchema.array(),EvtTxnLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTxnLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTxnLogScalarFieldEnumSchema,EvtTxnLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTxnLogAggregateArgsSchema: z.ZodType<Prisma.EvtTxnLogAggregateArgs> = z.object({
  where: EvtTxnLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTxnLogOrderByWithRelationInputSchema.array(),EvtTxnLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTxnLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTxnLogGroupByArgsSchema: z.ZodType<Prisma.EvtTxnLogGroupByArgs> = z.object({
  where: EvtTxnLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTxnLogOrderByWithAggregationInputSchema.array(),EvtTxnLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtTxnLogScalarFieldEnumSchema.array(),
  having: EvtTxnLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTxnLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtTxnLogFindUniqueArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTxnLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtTxnLogFindUniqueOrThrowArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLogFindFirstArgsSchema: z.ZodType<Prisma.EvtTokenLogFindFirstArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLogOrderByWithRelationInputSchema.array(),EvtTokenLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLogScalarFieldEnumSchema,EvtTokenLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtTokenLogFindFirstOrThrowArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLogOrderByWithRelationInputSchema.array(),EvtTokenLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLogScalarFieldEnumSchema,EvtTokenLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLogFindManyArgsSchema: z.ZodType<Prisma.EvtTokenLogFindManyArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLogOrderByWithRelationInputSchema.array(),EvtTokenLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLogScalarFieldEnumSchema,EvtTokenLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLogAggregateArgsSchema: z.ZodType<Prisma.EvtTokenLogAggregateArgs> = z.object({
  where: EvtTokenLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLogOrderByWithRelationInputSchema.array(),EvtTokenLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTokenLogGroupByArgsSchema: z.ZodType<Prisma.EvtTokenLogGroupByArgs> = z.object({
  where: EvtTokenLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLogOrderByWithAggregationInputSchema.array(),EvtTokenLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtTokenLogScalarFieldEnumSchema.array(),
  having: EvtTokenLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTokenLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtTokenLogFindUniqueArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtTokenLogFindUniqueOrThrowArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereUniqueInputSchema,
}).strict() ;

export const EvtGraduatedLogFindFirstArgsSchema: z.ZodType<Prisma.EvtGraduatedLogFindFirstArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtGraduatedLogOrderByWithRelationInputSchema.array(),EvtGraduatedLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtGraduatedLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtGraduatedLogScalarFieldEnumSchema,EvtGraduatedLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtGraduatedLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtGraduatedLogFindFirstOrThrowArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtGraduatedLogOrderByWithRelationInputSchema.array(),EvtGraduatedLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtGraduatedLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtGraduatedLogScalarFieldEnumSchema,EvtGraduatedLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtGraduatedLogFindManyArgsSchema: z.ZodType<Prisma.EvtGraduatedLogFindManyArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtGraduatedLogOrderByWithRelationInputSchema.array(),EvtGraduatedLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtGraduatedLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtGraduatedLogScalarFieldEnumSchema,EvtGraduatedLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtGraduatedLogAggregateArgsSchema: z.ZodType<Prisma.EvtGraduatedLogAggregateArgs> = z.object({
  where: EvtGraduatedLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtGraduatedLogOrderByWithRelationInputSchema.array(),EvtGraduatedLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtGraduatedLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtGraduatedLogGroupByArgsSchema: z.ZodType<Prisma.EvtGraduatedLogGroupByArgs> = z.object({
  where: EvtGraduatedLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtGraduatedLogOrderByWithAggregationInputSchema.array(),EvtGraduatedLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtGraduatedLogScalarFieldEnumSchema.array(),
  having: EvtGraduatedLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtGraduatedLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtGraduatedLogFindUniqueArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereUniqueInputSchema,
}).strict() ;

export const EvtGraduatedLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtGraduatedLogFindUniqueOrThrowArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLockLogFindFirstArgsSchema: z.ZodType<Prisma.EvtTokenLockLogFindFirstArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLockLogOrderByWithRelationInputSchema.array(),EvtTokenLockLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLockLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLockLogScalarFieldEnumSchema,EvtTokenLockLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLockLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtTokenLockLogFindFirstOrThrowArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLockLogOrderByWithRelationInputSchema.array(),EvtTokenLockLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLockLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLockLogScalarFieldEnumSchema,EvtTokenLockLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLockLogFindManyArgsSchema: z.ZodType<Prisma.EvtTokenLockLogFindManyArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLockLogOrderByWithRelationInputSchema.array(),EvtTokenLockLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLockLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTokenLockLogScalarFieldEnumSchema,EvtTokenLockLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTokenLockLogAggregateArgsSchema: z.ZodType<Prisma.EvtTokenLockLogAggregateArgs> = z.object({
  where: EvtTokenLockLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLockLogOrderByWithRelationInputSchema.array(),EvtTokenLockLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTokenLockLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTokenLockLogGroupByArgsSchema: z.ZodType<Prisma.EvtTokenLockLogGroupByArgs> = z.object({
  where: EvtTokenLockLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTokenLockLogOrderByWithAggregationInputSchema.array(),EvtTokenLockLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtTokenLockLogScalarFieldEnumSchema.array(),
  having: EvtTokenLockLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTokenLockLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtTokenLockLogFindUniqueArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLockLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtTokenLockLogFindUniqueOrThrowArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTradeLogFindFirstArgsSchema: z.ZodType<Prisma.EvtTradeLogFindFirstArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTradeLogOrderByWithRelationInputSchema.array(),EvtTradeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTradeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTradeLogScalarFieldEnumSchema,EvtTradeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTradeLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtTradeLogFindFirstOrThrowArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTradeLogOrderByWithRelationInputSchema.array(),EvtTradeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTradeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTradeLogScalarFieldEnumSchema,EvtTradeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTradeLogFindManyArgsSchema: z.ZodType<Prisma.EvtTradeLogFindManyArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTradeLogOrderByWithRelationInputSchema.array(),EvtTradeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTradeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtTradeLogScalarFieldEnumSchema,EvtTradeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtTradeLogAggregateArgsSchema: z.ZodType<Prisma.EvtTradeLogAggregateArgs> = z.object({
  where: EvtTradeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTradeLogOrderByWithRelationInputSchema.array(),EvtTradeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtTradeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTradeLogGroupByArgsSchema: z.ZodType<Prisma.EvtTradeLogGroupByArgs> = z.object({
  where: EvtTradeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtTradeLogOrderByWithAggregationInputSchema.array(),EvtTradeLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtTradeLogScalarFieldEnumSchema.array(),
  having: EvtTradeLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtTradeLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtTradeLogFindUniqueArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTradeLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtTradeLogFindUniqueOrThrowArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetLogFindFirstArgsSchema: z.ZodType<Prisma.EvtAssetLogFindFirstArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetLogOrderByWithRelationInputSchema.array(),EvtAssetLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetLogScalarFieldEnumSchema,EvtAssetLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtAssetLogFindFirstOrThrowArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetLogOrderByWithRelationInputSchema.array(),EvtAssetLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetLogScalarFieldEnumSchema,EvtAssetLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetLogFindManyArgsSchema: z.ZodType<Prisma.EvtAssetLogFindManyArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetLogOrderByWithRelationInputSchema.array(),EvtAssetLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetLogScalarFieldEnumSchema,EvtAssetLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetLogAggregateArgsSchema: z.ZodType<Prisma.EvtAssetLogAggregateArgs> = z.object({
  where: EvtAssetLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetLogOrderByWithRelationInputSchema.array(),EvtAssetLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtAssetLogGroupByArgsSchema: z.ZodType<Prisma.EvtAssetLogGroupByArgs> = z.object({
  where: EvtAssetLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetLogOrderByWithAggregationInputSchema.array(),EvtAssetLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtAssetLogScalarFieldEnumSchema.array(),
  having: EvtAssetLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtAssetLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtAssetLogFindUniqueArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtAssetLogFindUniqueOrThrowArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetFeeLogFindFirstArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogFindFirstArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetFeeLogOrderByWithRelationInputSchema.array(),EvtAssetFeeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetFeeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetFeeLogScalarFieldEnumSchema,EvtAssetFeeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetFeeLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogFindFirstOrThrowArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetFeeLogOrderByWithRelationInputSchema.array(),EvtAssetFeeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetFeeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetFeeLogScalarFieldEnumSchema,EvtAssetFeeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetFeeLogFindManyArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogFindManyArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetFeeLogOrderByWithRelationInputSchema.array(),EvtAssetFeeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetFeeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtAssetFeeLogScalarFieldEnumSchema,EvtAssetFeeLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtAssetFeeLogAggregateArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogAggregateArgs> = z.object({
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetFeeLogOrderByWithRelationInputSchema.array(),EvtAssetFeeLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtAssetFeeLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtAssetFeeLogGroupByArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogGroupByArgs> = z.object({
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtAssetFeeLogOrderByWithAggregationInputSchema.array(),EvtAssetFeeLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtAssetFeeLogScalarFieldEnumSchema.array(),
  having: EvtAssetFeeLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtAssetFeeLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogFindUniqueArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetFeeLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogFindUniqueOrThrowArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionStartLogFindFirstArgsSchema: z.ZodType<Prisma.EvtContributionStartLogFindFirstArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionStartLogOrderByWithRelationInputSchema.array(),EvtContributionStartLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionStartLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionStartLogScalarFieldEnumSchema,EvtContributionStartLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionStartLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtContributionStartLogFindFirstOrThrowArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionStartLogOrderByWithRelationInputSchema.array(),EvtContributionStartLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionStartLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionStartLogScalarFieldEnumSchema,EvtContributionStartLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionStartLogFindManyArgsSchema: z.ZodType<Prisma.EvtContributionStartLogFindManyArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionStartLogOrderByWithRelationInputSchema.array(),EvtContributionStartLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionStartLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionStartLogScalarFieldEnumSchema,EvtContributionStartLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionStartLogAggregateArgsSchema: z.ZodType<Prisma.EvtContributionStartLogAggregateArgs> = z.object({
  where: EvtContributionStartLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionStartLogOrderByWithRelationInputSchema.array(),EvtContributionStartLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionStartLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtContributionStartLogGroupByArgsSchema: z.ZodType<Prisma.EvtContributionStartLogGroupByArgs> = z.object({
  where: EvtContributionStartLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionStartLogOrderByWithAggregationInputSchema.array(),EvtContributionStartLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtContributionStartLogScalarFieldEnumSchema.array(),
  having: EvtContributionStartLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtContributionStartLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtContributionStartLogFindUniqueArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionStartLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtContributionStartLogFindUniqueOrThrowArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionUpdateLogFindFirstArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogFindFirstArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionUpdateLogOrderByWithRelationInputSchema.array(),EvtContributionUpdateLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionUpdateLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionUpdateLogScalarFieldEnumSchema,EvtContributionUpdateLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionUpdateLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogFindFirstOrThrowArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionUpdateLogOrderByWithRelationInputSchema.array(),EvtContributionUpdateLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionUpdateLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionUpdateLogScalarFieldEnumSchema,EvtContributionUpdateLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionUpdateLogFindManyArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogFindManyArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionUpdateLogOrderByWithRelationInputSchema.array(),EvtContributionUpdateLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionUpdateLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtContributionUpdateLogScalarFieldEnumSchema,EvtContributionUpdateLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtContributionUpdateLogAggregateArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogAggregateArgs> = z.object({
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionUpdateLogOrderByWithRelationInputSchema.array(),EvtContributionUpdateLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtContributionUpdateLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtContributionUpdateLogGroupByArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogGroupByArgs> = z.object({
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtContributionUpdateLogOrderByWithAggregationInputSchema.array(),EvtContributionUpdateLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtContributionUpdateLogScalarFieldEnumSchema.array(),
  having: EvtContributionUpdateLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtContributionUpdateLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogFindUniqueArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionUpdateLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogFindUniqueOrThrowArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereUniqueInputSchema,
}).strict() ;

export const EvtClaimLogFindFirstArgsSchema: z.ZodType<Prisma.EvtClaimLogFindFirstArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtClaimLogOrderByWithRelationInputSchema.array(),EvtClaimLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtClaimLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtClaimLogScalarFieldEnumSchema,EvtClaimLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtClaimLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EvtClaimLogFindFirstOrThrowArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtClaimLogOrderByWithRelationInputSchema.array(),EvtClaimLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtClaimLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtClaimLogScalarFieldEnumSchema,EvtClaimLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtClaimLogFindManyArgsSchema: z.ZodType<Prisma.EvtClaimLogFindManyArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtClaimLogOrderByWithRelationInputSchema.array(),EvtClaimLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtClaimLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EvtClaimLogScalarFieldEnumSchema,EvtClaimLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const EvtClaimLogAggregateArgsSchema: z.ZodType<Prisma.EvtClaimLogAggregateArgs> = z.object({
  where: EvtClaimLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtClaimLogOrderByWithRelationInputSchema.array(),EvtClaimLogOrderByWithRelationInputSchema ]).optional(),
  cursor: EvtClaimLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtClaimLogGroupByArgsSchema: z.ZodType<Prisma.EvtClaimLogGroupByArgs> = z.object({
  where: EvtClaimLogWhereInputSchema.optional(),
  orderBy: z.union([ EvtClaimLogOrderByWithAggregationInputSchema.array(),EvtClaimLogOrderByWithAggregationInputSchema ]).optional(),
  by: EvtClaimLogScalarFieldEnumSchema.array(),
  having: EvtClaimLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const EvtClaimLogFindUniqueArgsSchema: z.ZodType<Prisma.EvtClaimLogFindUniqueArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereUniqueInputSchema,
}).strict() ;

export const EvtClaimLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EvtClaimLogFindUniqueOrThrowArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereUniqueInputSchema,
}).strict() ;

export const KLine5mFindFirstArgsSchema: z.ZodType<Prisma.KLine5mFindFirstArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereInputSchema.optional(),
  orderBy: z.union([ KLine5mOrderByWithRelationInputSchema.array(),KLine5mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine5mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine5mScalarFieldEnumSchema,KLine5mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine5mFindFirstOrThrowArgsSchema: z.ZodType<Prisma.KLine5mFindFirstOrThrowArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereInputSchema.optional(),
  orderBy: z.union([ KLine5mOrderByWithRelationInputSchema.array(),KLine5mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine5mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine5mScalarFieldEnumSchema,KLine5mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine5mFindManyArgsSchema: z.ZodType<Prisma.KLine5mFindManyArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereInputSchema.optional(),
  orderBy: z.union([ KLine5mOrderByWithRelationInputSchema.array(),KLine5mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine5mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine5mScalarFieldEnumSchema,KLine5mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine5mAggregateArgsSchema: z.ZodType<Prisma.KLine5mAggregateArgs> = z.object({
  where: KLine5mWhereInputSchema.optional(),
  orderBy: z.union([ KLine5mOrderByWithRelationInputSchema.array(),KLine5mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine5mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KLine5mGroupByArgsSchema: z.ZodType<Prisma.KLine5mGroupByArgs> = z.object({
  where: KLine5mWhereInputSchema.optional(),
  orderBy: z.union([ KLine5mOrderByWithAggregationInputSchema.array(),KLine5mOrderByWithAggregationInputSchema ]).optional(),
  by: KLine5mScalarFieldEnumSchema.array(),
  having: KLine5mScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KLine5mFindUniqueArgsSchema: z.ZodType<Prisma.KLine5mFindUniqueArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereUniqueInputSchema,
}).strict() ;

export const KLine5mFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.KLine5mFindUniqueOrThrowArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereUniqueInputSchema,
}).strict() ;

export const KLine1mFindFirstArgsSchema: z.ZodType<Prisma.KLine1mFindFirstArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereInputSchema.optional(),
  orderBy: z.union([ KLine1mOrderByWithRelationInputSchema.array(),KLine1mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine1mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine1mScalarFieldEnumSchema,KLine1mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine1mFindFirstOrThrowArgsSchema: z.ZodType<Prisma.KLine1mFindFirstOrThrowArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereInputSchema.optional(),
  orderBy: z.union([ KLine1mOrderByWithRelationInputSchema.array(),KLine1mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine1mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine1mScalarFieldEnumSchema,KLine1mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine1mFindManyArgsSchema: z.ZodType<Prisma.KLine1mFindManyArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereInputSchema.optional(),
  orderBy: z.union([ KLine1mOrderByWithRelationInputSchema.array(),KLine1mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine1mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KLine1mScalarFieldEnumSchema,KLine1mScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KLine1mAggregateArgsSchema: z.ZodType<Prisma.KLine1mAggregateArgs> = z.object({
  where: KLine1mWhereInputSchema.optional(),
  orderBy: z.union([ KLine1mOrderByWithRelationInputSchema.array(),KLine1mOrderByWithRelationInputSchema ]).optional(),
  cursor: KLine1mWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KLine1mGroupByArgsSchema: z.ZodType<Prisma.KLine1mGroupByArgs> = z.object({
  where: KLine1mWhereInputSchema.optional(),
  orderBy: z.union([ KLine1mOrderByWithAggregationInputSchema.array(),KLine1mOrderByWithAggregationInputSchema ]).optional(),
  by: KLine1mScalarFieldEnumSchema.array(),
  having: KLine1mScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KLine1mFindUniqueArgsSchema: z.ZodType<Prisma.KLine1mFindUniqueArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereUniqueInputSchema,
}).strict() ;

export const KLine1mFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.KLine1mFindUniqueOrThrowArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereUniqueInputSchema,
}).strict() ;

export const ContributionInfoFindFirstArgsSchema: z.ZodType<Prisma.ContributionInfoFindFirstArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereInputSchema.optional(),
  orderBy: z.union([ ContributionInfoOrderByWithRelationInputSchema.array(),ContributionInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionInfoScalarFieldEnumSchema,ContributionInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionInfoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributionInfoFindFirstOrThrowArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereInputSchema.optional(),
  orderBy: z.union([ ContributionInfoOrderByWithRelationInputSchema.array(),ContributionInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionInfoScalarFieldEnumSchema,ContributionInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionInfoFindManyArgsSchema: z.ZodType<Prisma.ContributionInfoFindManyArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereInputSchema.optional(),
  orderBy: z.union([ ContributionInfoOrderByWithRelationInputSchema.array(),ContributionInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionInfoScalarFieldEnumSchema,ContributionInfoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionInfoAggregateArgsSchema: z.ZodType<Prisma.ContributionInfoAggregateArgs> = z.object({
  where: ContributionInfoWhereInputSchema.optional(),
  orderBy: z.union([ ContributionInfoOrderByWithRelationInputSchema.array(),ContributionInfoOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionInfoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionInfoGroupByArgsSchema: z.ZodType<Prisma.ContributionInfoGroupByArgs> = z.object({
  where: ContributionInfoWhereInputSchema.optional(),
  orderBy: z.union([ ContributionInfoOrderByWithAggregationInputSchema.array(),ContributionInfoOrderByWithAggregationInputSchema ]).optional(),
  by: ContributionInfoScalarFieldEnumSchema.array(),
  having: ContributionInfoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionInfoFindUniqueArgsSchema: z.ZodType<Prisma.ContributionInfoFindUniqueArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereUniqueInputSchema,
}).strict() ;

export const ContributionInfoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributionInfoFindUniqueOrThrowArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereUniqueInputSchema,
}).strict() ;

export const ContributionDetailFindFirstArgsSchema: z.ZodType<Prisma.ContributionDetailFindFirstArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereInputSchema.optional(),
  orderBy: z.union([ ContributionDetailOrderByWithRelationInputSchema.array(),ContributionDetailOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionDetailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionDetailScalarFieldEnumSchema,ContributionDetailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionDetailFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContributionDetailFindFirstOrThrowArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereInputSchema.optional(),
  orderBy: z.union([ ContributionDetailOrderByWithRelationInputSchema.array(),ContributionDetailOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionDetailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionDetailScalarFieldEnumSchema,ContributionDetailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionDetailFindManyArgsSchema: z.ZodType<Prisma.ContributionDetailFindManyArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereInputSchema.optional(),
  orderBy: z.union([ ContributionDetailOrderByWithRelationInputSchema.array(),ContributionDetailOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionDetailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContributionDetailScalarFieldEnumSchema,ContributionDetailScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContributionDetailAggregateArgsSchema: z.ZodType<Prisma.ContributionDetailAggregateArgs> = z.object({
  where: ContributionDetailWhereInputSchema.optional(),
  orderBy: z.union([ ContributionDetailOrderByWithRelationInputSchema.array(),ContributionDetailOrderByWithRelationInputSchema ]).optional(),
  cursor: ContributionDetailWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionDetailGroupByArgsSchema: z.ZodType<Prisma.ContributionDetailGroupByArgs> = z.object({
  where: ContributionDetailWhereInputSchema.optional(),
  orderBy: z.union([ ContributionDetailOrderByWithAggregationInputSchema.array(),ContributionDetailOrderByWithAggregationInputSchema ]).optional(),
  by: ContributionDetailScalarFieldEnumSchema.array(),
  having: ContributionDetailScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContributionDetailFindUniqueArgsSchema: z.ZodType<Prisma.ContributionDetailFindUniqueArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereUniqueInputSchema,
}).strict() ;

export const ContributionDetailFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContributionDetailFindUniqueOrThrowArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereUniqueInputSchema,
}).strict() ;

export const UserClaimHistoryFindFirstArgsSchema: z.ZodType<Prisma.UserClaimHistoryFindFirstArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserClaimHistoryOrderByWithRelationInputSchema.array(),UserClaimHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserClaimHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserClaimHistoryScalarFieldEnumSchema,UserClaimHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserClaimHistoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserClaimHistoryFindFirstOrThrowArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserClaimHistoryOrderByWithRelationInputSchema.array(),UserClaimHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserClaimHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserClaimHistoryScalarFieldEnumSchema,UserClaimHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserClaimHistoryFindManyArgsSchema: z.ZodType<Prisma.UserClaimHistoryFindManyArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserClaimHistoryOrderByWithRelationInputSchema.array(),UserClaimHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserClaimHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserClaimHistoryScalarFieldEnumSchema,UserClaimHistoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserClaimHistoryAggregateArgsSchema: z.ZodType<Prisma.UserClaimHistoryAggregateArgs> = z.object({
  where: UserClaimHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserClaimHistoryOrderByWithRelationInputSchema.array(),UserClaimHistoryOrderByWithRelationInputSchema ]).optional(),
  cursor: UserClaimHistoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserClaimHistoryGroupByArgsSchema: z.ZodType<Prisma.UserClaimHistoryGroupByArgs> = z.object({
  where: UserClaimHistoryWhereInputSchema.optional(),
  orderBy: z.union([ UserClaimHistoryOrderByWithAggregationInputSchema.array(),UserClaimHistoryOrderByWithAggregationInputSchema ]).optional(),
  by: UserClaimHistoryScalarFieldEnumSchema.array(),
  having: UserClaimHistoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserClaimHistoryFindUniqueArgsSchema: z.ZodType<Prisma.UserClaimHistoryFindUniqueArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserClaimHistoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserClaimHistoryFindUniqueOrThrowArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereUniqueInputSchema,
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

export const ContributorCreateArgsSchema: z.ZodType<Prisma.ContributorCreateArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  data: z.union([ ContributorCreateInputSchema,ContributorUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributorUpsertArgsSchema: z.ZodType<Prisma.ContributorUpsertArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereUniqueInputSchema,
  create: z.union([ ContributorCreateInputSchema,ContributorUncheckedCreateInputSchema ]),
  update: z.union([ ContributorUpdateInputSchema,ContributorUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributorCreateManyArgsSchema: z.ZodType<Prisma.ContributorCreateManyArgs> = z.object({
  data: z.union([ ContributorCreateManyInputSchema,ContributorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributorCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributorCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributorCreateManyInputSchema,ContributorCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributorDeleteArgsSchema: z.ZodType<Prisma.ContributorDeleteArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  where: ContributorWhereUniqueInputSchema,
}).strict() ;

export const ContributorUpdateArgsSchema: z.ZodType<Prisma.ContributorUpdateArgs> = z.object({
  select: ContributorSelectSchema.optional(),
  include: ContributorIncludeSchema.optional(),
  data: z.union([ ContributorUpdateInputSchema,ContributorUncheckedUpdateInputSchema ]),
  where: ContributorWhereUniqueInputSchema,
}).strict() ;

export const ContributorUpdateManyArgsSchema: z.ZodType<Prisma.ContributorUpdateManyArgs> = z.object({
  data: z.union([ ContributorUpdateManyMutationInputSchema,ContributorUncheckedUpdateManyInputSchema ]),
  where: ContributorWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributorUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributorUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributorUpdateManyMutationInputSchema,ContributorUncheckedUpdateManyInputSchema ]),
  where: ContributorWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributorDeleteManyArgsSchema: z.ZodType<Prisma.ContributorDeleteManyArgs> = z.object({
  where: ContributorWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributorHistoryCreateArgsSchema: z.ZodType<Prisma.ContributorHistoryCreateArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  data: z.union([ ContributorHistoryCreateInputSchema,ContributorHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributorHistoryUpsertArgsSchema: z.ZodType<Prisma.ContributorHistoryUpsertArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereUniqueInputSchema,
  create: z.union([ ContributorHistoryCreateInputSchema,ContributorHistoryUncheckedCreateInputSchema ]),
  update: z.union([ ContributorHistoryUpdateInputSchema,ContributorHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributorHistoryCreateManyArgsSchema: z.ZodType<Prisma.ContributorHistoryCreateManyArgs> = z.object({
  data: z.union([ ContributorHistoryCreateManyInputSchema,ContributorHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributorHistoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributorHistoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributorHistoryCreateManyInputSchema,ContributorHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributorHistoryDeleteArgsSchema: z.ZodType<Prisma.ContributorHistoryDeleteArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  where: ContributorHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributorHistoryUpdateArgsSchema: z.ZodType<Prisma.ContributorHistoryUpdateArgs> = z.object({
  select: ContributorHistorySelectSchema.optional(),
  include: ContributorHistoryIncludeSchema.optional(),
  data: z.union([ ContributorHistoryUpdateInputSchema,ContributorHistoryUncheckedUpdateInputSchema ]),
  where: ContributorHistoryWhereUniqueInputSchema,
}).strict() ;

export const ContributorHistoryUpdateManyArgsSchema: z.ZodType<Prisma.ContributorHistoryUpdateManyArgs> = z.object({
  data: z.union([ ContributorHistoryUpdateManyMutationInputSchema,ContributorHistoryUncheckedUpdateManyInputSchema ]),
  where: ContributorHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributorHistoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributorHistoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributorHistoryUpdateManyMutationInputSchema,ContributorHistoryUncheckedUpdateManyInputSchema ]),
  where: ContributorHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributorHistoryDeleteManyArgsSchema: z.ZodType<Prisma.ContributorHistoryDeleteManyArgs> = z.object({
  where: ContributorHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTxnLogCreateArgsSchema: z.ZodType<Prisma.EvtTxnLogCreateArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  data: z.union([ EvtTxnLogCreateInputSchema,EvtTxnLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtTxnLogUpsertArgsSchema: z.ZodType<Prisma.EvtTxnLogUpsertArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereUniqueInputSchema,
  create: z.union([ EvtTxnLogCreateInputSchema,EvtTxnLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtTxnLogUpdateInputSchema,EvtTxnLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtTxnLogCreateManyArgsSchema: z.ZodType<Prisma.EvtTxnLogCreateManyArgs> = z.object({
  data: z.union([ EvtTxnLogCreateManyInputSchema,EvtTxnLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTxnLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTxnLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTxnLogCreateManyInputSchema,EvtTxnLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTxnLogDeleteArgsSchema: z.ZodType<Prisma.EvtTxnLogDeleteArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  where: EvtTxnLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTxnLogUpdateArgsSchema: z.ZodType<Prisma.EvtTxnLogUpdateArgs> = z.object({
  select: EvtTxnLogSelectSchema.optional(),
  data: z.union([ EvtTxnLogUpdateInputSchema,EvtTxnLogUncheckedUpdateInputSchema ]),
  where: EvtTxnLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTxnLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtTxnLogUpdateManyArgs> = z.object({
  data: z.union([ EvtTxnLogUpdateManyMutationInputSchema,EvtTxnLogUncheckedUpdateManyInputSchema ]),
  where: EvtTxnLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTxnLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTxnLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTxnLogUpdateManyMutationInputSchema,EvtTxnLogUncheckedUpdateManyInputSchema ]),
  where: EvtTxnLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTxnLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtTxnLogDeleteManyArgs> = z.object({
  where: EvtTxnLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLogCreateArgsSchema: z.ZodType<Prisma.EvtTokenLogCreateArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  data: z.union([ EvtTokenLogCreateInputSchema,EvtTokenLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtTokenLogUpsertArgsSchema: z.ZodType<Prisma.EvtTokenLogUpsertArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereUniqueInputSchema,
  create: z.union([ EvtTokenLogCreateInputSchema,EvtTokenLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtTokenLogUpdateInputSchema,EvtTokenLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtTokenLogCreateManyArgsSchema: z.ZodType<Prisma.EvtTokenLogCreateManyArgs> = z.object({
  data: z.union([ EvtTokenLogCreateManyInputSchema,EvtTokenLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTokenLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTokenLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTokenLogCreateManyInputSchema,EvtTokenLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTokenLogDeleteArgsSchema: z.ZodType<Prisma.EvtTokenLogDeleteArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  where: EvtTokenLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLogUpdateArgsSchema: z.ZodType<Prisma.EvtTokenLogUpdateArgs> = z.object({
  select: EvtTokenLogSelectSchema.optional(),
  data: z.union([ EvtTokenLogUpdateInputSchema,EvtTokenLogUncheckedUpdateInputSchema ]),
  where: EvtTokenLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtTokenLogUpdateManyArgs> = z.object({
  data: z.union([ EvtTokenLogUpdateManyMutationInputSchema,EvtTokenLogUncheckedUpdateManyInputSchema ]),
  where: EvtTokenLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTokenLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTokenLogUpdateManyMutationInputSchema,EvtTokenLogUncheckedUpdateManyInputSchema ]),
  where: EvtTokenLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtTokenLogDeleteManyArgs> = z.object({
  where: EvtTokenLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtGraduatedLogCreateArgsSchema: z.ZodType<Prisma.EvtGraduatedLogCreateArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  data: z.union([ EvtGraduatedLogCreateInputSchema,EvtGraduatedLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtGraduatedLogUpsertArgsSchema: z.ZodType<Prisma.EvtGraduatedLogUpsertArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereUniqueInputSchema,
  create: z.union([ EvtGraduatedLogCreateInputSchema,EvtGraduatedLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtGraduatedLogUpdateInputSchema,EvtGraduatedLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtGraduatedLogCreateManyArgsSchema: z.ZodType<Prisma.EvtGraduatedLogCreateManyArgs> = z.object({
  data: z.union([ EvtGraduatedLogCreateManyInputSchema,EvtGraduatedLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtGraduatedLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtGraduatedLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtGraduatedLogCreateManyInputSchema,EvtGraduatedLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtGraduatedLogDeleteArgsSchema: z.ZodType<Prisma.EvtGraduatedLogDeleteArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  where: EvtGraduatedLogWhereUniqueInputSchema,
}).strict() ;

export const EvtGraduatedLogUpdateArgsSchema: z.ZodType<Prisma.EvtGraduatedLogUpdateArgs> = z.object({
  select: EvtGraduatedLogSelectSchema.optional(),
  data: z.union([ EvtGraduatedLogUpdateInputSchema,EvtGraduatedLogUncheckedUpdateInputSchema ]),
  where: EvtGraduatedLogWhereUniqueInputSchema,
}).strict() ;

export const EvtGraduatedLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtGraduatedLogUpdateManyArgs> = z.object({
  data: z.union([ EvtGraduatedLogUpdateManyMutationInputSchema,EvtGraduatedLogUncheckedUpdateManyInputSchema ]),
  where: EvtGraduatedLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtGraduatedLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtGraduatedLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtGraduatedLogUpdateManyMutationInputSchema,EvtGraduatedLogUncheckedUpdateManyInputSchema ]),
  where: EvtGraduatedLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtGraduatedLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtGraduatedLogDeleteManyArgs> = z.object({
  where: EvtGraduatedLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLockLogCreateArgsSchema: z.ZodType<Prisma.EvtTokenLockLogCreateArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  data: z.union([ EvtTokenLockLogCreateInputSchema,EvtTokenLockLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtTokenLockLogUpsertArgsSchema: z.ZodType<Prisma.EvtTokenLockLogUpsertArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereUniqueInputSchema,
  create: z.union([ EvtTokenLockLogCreateInputSchema,EvtTokenLockLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtTokenLockLogUpdateInputSchema,EvtTokenLockLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtTokenLockLogCreateManyArgsSchema: z.ZodType<Prisma.EvtTokenLockLogCreateManyArgs> = z.object({
  data: z.union([ EvtTokenLockLogCreateManyInputSchema,EvtTokenLockLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTokenLockLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTokenLockLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTokenLockLogCreateManyInputSchema,EvtTokenLockLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTokenLockLogDeleteArgsSchema: z.ZodType<Prisma.EvtTokenLockLogDeleteArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  where: EvtTokenLockLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLockLogUpdateArgsSchema: z.ZodType<Prisma.EvtTokenLockLogUpdateArgs> = z.object({
  select: EvtTokenLockLogSelectSchema.optional(),
  data: z.union([ EvtTokenLockLogUpdateInputSchema,EvtTokenLockLogUncheckedUpdateInputSchema ]),
  where: EvtTokenLockLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTokenLockLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtTokenLockLogUpdateManyArgs> = z.object({
  data: z.union([ EvtTokenLockLogUpdateManyMutationInputSchema,EvtTokenLockLogUncheckedUpdateManyInputSchema ]),
  where: EvtTokenLockLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLockLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTokenLockLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTokenLockLogUpdateManyMutationInputSchema,EvtTokenLockLogUncheckedUpdateManyInputSchema ]),
  where: EvtTokenLockLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTokenLockLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtTokenLockLogDeleteManyArgs> = z.object({
  where: EvtTokenLockLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTradeLogCreateArgsSchema: z.ZodType<Prisma.EvtTradeLogCreateArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  data: z.union([ EvtTradeLogCreateInputSchema,EvtTradeLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtTradeLogUpsertArgsSchema: z.ZodType<Prisma.EvtTradeLogUpsertArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereUniqueInputSchema,
  create: z.union([ EvtTradeLogCreateInputSchema,EvtTradeLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtTradeLogUpdateInputSchema,EvtTradeLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtTradeLogCreateManyArgsSchema: z.ZodType<Prisma.EvtTradeLogCreateManyArgs> = z.object({
  data: z.union([ EvtTradeLogCreateManyInputSchema,EvtTradeLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTradeLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTradeLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTradeLogCreateManyInputSchema,EvtTradeLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtTradeLogDeleteArgsSchema: z.ZodType<Prisma.EvtTradeLogDeleteArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  where: EvtTradeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTradeLogUpdateArgsSchema: z.ZodType<Prisma.EvtTradeLogUpdateArgs> = z.object({
  select: EvtTradeLogSelectSchema.optional(),
  data: z.union([ EvtTradeLogUpdateInputSchema,EvtTradeLogUncheckedUpdateInputSchema ]),
  where: EvtTradeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtTradeLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtTradeLogUpdateManyArgs> = z.object({
  data: z.union([ EvtTradeLogUpdateManyMutationInputSchema,EvtTradeLogUncheckedUpdateManyInputSchema ]),
  where: EvtTradeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTradeLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtTradeLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtTradeLogUpdateManyMutationInputSchema,EvtTradeLogUncheckedUpdateManyInputSchema ]),
  where: EvtTradeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtTradeLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtTradeLogDeleteManyArgs> = z.object({
  where: EvtTradeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetLogCreateArgsSchema: z.ZodType<Prisma.EvtAssetLogCreateArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  data: z.union([ EvtAssetLogCreateInputSchema,EvtAssetLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtAssetLogUpsertArgsSchema: z.ZodType<Prisma.EvtAssetLogUpsertArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereUniqueInputSchema,
  create: z.union([ EvtAssetLogCreateInputSchema,EvtAssetLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtAssetLogUpdateInputSchema,EvtAssetLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtAssetLogCreateManyArgsSchema: z.ZodType<Prisma.EvtAssetLogCreateManyArgs> = z.object({
  data: z.union([ EvtAssetLogCreateManyInputSchema,EvtAssetLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtAssetLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtAssetLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtAssetLogCreateManyInputSchema,EvtAssetLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtAssetLogDeleteArgsSchema: z.ZodType<Prisma.EvtAssetLogDeleteArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  where: EvtAssetLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetLogUpdateArgsSchema: z.ZodType<Prisma.EvtAssetLogUpdateArgs> = z.object({
  select: EvtAssetLogSelectSchema.optional(),
  data: z.union([ EvtAssetLogUpdateInputSchema,EvtAssetLogUncheckedUpdateInputSchema ]),
  where: EvtAssetLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtAssetLogUpdateManyArgs> = z.object({
  data: z.union([ EvtAssetLogUpdateManyMutationInputSchema,EvtAssetLogUncheckedUpdateManyInputSchema ]),
  where: EvtAssetLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtAssetLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtAssetLogUpdateManyMutationInputSchema,EvtAssetLogUncheckedUpdateManyInputSchema ]),
  where: EvtAssetLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtAssetLogDeleteManyArgs> = z.object({
  where: EvtAssetLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetFeeLogCreateArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogCreateArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  data: z.union([ EvtAssetFeeLogCreateInputSchema,EvtAssetFeeLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtAssetFeeLogUpsertArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogUpsertArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereUniqueInputSchema,
  create: z.union([ EvtAssetFeeLogCreateInputSchema,EvtAssetFeeLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtAssetFeeLogUpdateInputSchema,EvtAssetFeeLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtAssetFeeLogCreateManyArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogCreateManyArgs> = z.object({
  data: z.union([ EvtAssetFeeLogCreateManyInputSchema,EvtAssetFeeLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtAssetFeeLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtAssetFeeLogCreateManyInputSchema,EvtAssetFeeLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtAssetFeeLogDeleteArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogDeleteArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  where: EvtAssetFeeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetFeeLogUpdateArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogUpdateArgs> = z.object({
  select: EvtAssetFeeLogSelectSchema.optional(),
  data: z.union([ EvtAssetFeeLogUpdateInputSchema,EvtAssetFeeLogUncheckedUpdateInputSchema ]),
  where: EvtAssetFeeLogWhereUniqueInputSchema,
}).strict() ;

export const EvtAssetFeeLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogUpdateManyArgs> = z.object({
  data: z.union([ EvtAssetFeeLogUpdateManyMutationInputSchema,EvtAssetFeeLogUncheckedUpdateManyInputSchema ]),
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetFeeLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtAssetFeeLogUpdateManyMutationInputSchema,EvtAssetFeeLogUncheckedUpdateManyInputSchema ]),
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtAssetFeeLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtAssetFeeLogDeleteManyArgs> = z.object({
  where: EvtAssetFeeLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionStartLogCreateArgsSchema: z.ZodType<Prisma.EvtContributionStartLogCreateArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  data: z.union([ EvtContributionStartLogCreateInputSchema,EvtContributionStartLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtContributionStartLogUpsertArgsSchema: z.ZodType<Prisma.EvtContributionStartLogUpsertArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereUniqueInputSchema,
  create: z.union([ EvtContributionStartLogCreateInputSchema,EvtContributionStartLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtContributionStartLogUpdateInputSchema,EvtContributionStartLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtContributionStartLogCreateManyArgsSchema: z.ZodType<Prisma.EvtContributionStartLogCreateManyArgs> = z.object({
  data: z.union([ EvtContributionStartLogCreateManyInputSchema,EvtContributionStartLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtContributionStartLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtContributionStartLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtContributionStartLogCreateManyInputSchema,EvtContributionStartLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtContributionStartLogDeleteArgsSchema: z.ZodType<Prisma.EvtContributionStartLogDeleteArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  where: EvtContributionStartLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionStartLogUpdateArgsSchema: z.ZodType<Prisma.EvtContributionStartLogUpdateArgs> = z.object({
  select: EvtContributionStartLogSelectSchema.optional(),
  data: z.union([ EvtContributionStartLogUpdateInputSchema,EvtContributionStartLogUncheckedUpdateInputSchema ]),
  where: EvtContributionStartLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionStartLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtContributionStartLogUpdateManyArgs> = z.object({
  data: z.union([ EvtContributionStartLogUpdateManyMutationInputSchema,EvtContributionStartLogUncheckedUpdateManyInputSchema ]),
  where: EvtContributionStartLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionStartLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtContributionStartLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtContributionStartLogUpdateManyMutationInputSchema,EvtContributionStartLogUncheckedUpdateManyInputSchema ]),
  where: EvtContributionStartLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionStartLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtContributionStartLogDeleteManyArgs> = z.object({
  where: EvtContributionStartLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionUpdateLogCreateArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogCreateArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  data: z.union([ EvtContributionUpdateLogCreateInputSchema,EvtContributionUpdateLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtContributionUpdateLogUpsertArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpsertArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereUniqueInputSchema,
  create: z.union([ EvtContributionUpdateLogCreateInputSchema,EvtContributionUpdateLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtContributionUpdateLogUpdateInputSchema,EvtContributionUpdateLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtContributionUpdateLogCreateManyArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogCreateManyArgs> = z.object({
  data: z.union([ EvtContributionUpdateLogCreateManyInputSchema,EvtContributionUpdateLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtContributionUpdateLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtContributionUpdateLogCreateManyInputSchema,EvtContributionUpdateLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtContributionUpdateLogDeleteArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogDeleteArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  where: EvtContributionUpdateLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionUpdateLogUpdateArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpdateArgs> = z.object({
  select: EvtContributionUpdateLogSelectSchema.optional(),
  data: z.union([ EvtContributionUpdateLogUpdateInputSchema,EvtContributionUpdateLogUncheckedUpdateInputSchema ]),
  where: EvtContributionUpdateLogWhereUniqueInputSchema,
}).strict() ;

export const EvtContributionUpdateLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpdateManyArgs> = z.object({
  data: z.union([ EvtContributionUpdateLogUpdateManyMutationInputSchema,EvtContributionUpdateLogUncheckedUpdateManyInputSchema ]),
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionUpdateLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtContributionUpdateLogUpdateManyMutationInputSchema,EvtContributionUpdateLogUncheckedUpdateManyInputSchema ]),
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtContributionUpdateLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtContributionUpdateLogDeleteManyArgs> = z.object({
  where: EvtContributionUpdateLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtClaimLogCreateArgsSchema: z.ZodType<Prisma.EvtClaimLogCreateArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  data: z.union([ EvtClaimLogCreateInputSchema,EvtClaimLogUncheckedCreateInputSchema ]),
}).strict() ;

export const EvtClaimLogUpsertArgsSchema: z.ZodType<Prisma.EvtClaimLogUpsertArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereUniqueInputSchema,
  create: z.union([ EvtClaimLogCreateInputSchema,EvtClaimLogUncheckedCreateInputSchema ]),
  update: z.union([ EvtClaimLogUpdateInputSchema,EvtClaimLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const EvtClaimLogCreateManyArgsSchema: z.ZodType<Prisma.EvtClaimLogCreateManyArgs> = z.object({
  data: z.union([ EvtClaimLogCreateManyInputSchema,EvtClaimLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtClaimLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtClaimLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ EvtClaimLogCreateManyInputSchema,EvtClaimLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const EvtClaimLogDeleteArgsSchema: z.ZodType<Prisma.EvtClaimLogDeleteArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  where: EvtClaimLogWhereUniqueInputSchema,
}).strict() ;

export const EvtClaimLogUpdateArgsSchema: z.ZodType<Prisma.EvtClaimLogUpdateArgs> = z.object({
  select: EvtClaimLogSelectSchema.optional(),
  data: z.union([ EvtClaimLogUpdateInputSchema,EvtClaimLogUncheckedUpdateInputSchema ]),
  where: EvtClaimLogWhereUniqueInputSchema,
}).strict() ;

export const EvtClaimLogUpdateManyArgsSchema: z.ZodType<Prisma.EvtClaimLogUpdateManyArgs> = z.object({
  data: z.union([ EvtClaimLogUpdateManyMutationInputSchema,EvtClaimLogUncheckedUpdateManyInputSchema ]),
  where: EvtClaimLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtClaimLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EvtClaimLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EvtClaimLogUpdateManyMutationInputSchema,EvtClaimLogUncheckedUpdateManyInputSchema ]),
  where: EvtClaimLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const EvtClaimLogDeleteManyArgsSchema: z.ZodType<Prisma.EvtClaimLogDeleteManyArgs> = z.object({
  where: EvtClaimLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine5mCreateArgsSchema: z.ZodType<Prisma.KLine5mCreateArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  data: z.union([ KLine5mCreateInputSchema,KLine5mUncheckedCreateInputSchema ]),
}).strict() ;

export const KLine5mUpsertArgsSchema: z.ZodType<Prisma.KLine5mUpsertArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereUniqueInputSchema,
  create: z.union([ KLine5mCreateInputSchema,KLine5mUncheckedCreateInputSchema ]),
  update: z.union([ KLine5mUpdateInputSchema,KLine5mUncheckedUpdateInputSchema ]),
}).strict() ;

export const KLine5mCreateManyArgsSchema: z.ZodType<Prisma.KLine5mCreateManyArgs> = z.object({
  data: z.union([ KLine5mCreateManyInputSchema,KLine5mCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KLine5mCreateManyAndReturnArgsSchema: z.ZodType<Prisma.KLine5mCreateManyAndReturnArgs> = z.object({
  data: z.union([ KLine5mCreateManyInputSchema,KLine5mCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KLine5mDeleteArgsSchema: z.ZodType<Prisma.KLine5mDeleteArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  where: KLine5mWhereUniqueInputSchema,
}).strict() ;

export const KLine5mUpdateArgsSchema: z.ZodType<Prisma.KLine5mUpdateArgs> = z.object({
  select: KLine5mSelectSchema.optional(),
  data: z.union([ KLine5mUpdateInputSchema,KLine5mUncheckedUpdateInputSchema ]),
  where: KLine5mWhereUniqueInputSchema,
}).strict() ;

export const KLine5mUpdateManyArgsSchema: z.ZodType<Prisma.KLine5mUpdateManyArgs> = z.object({
  data: z.union([ KLine5mUpdateManyMutationInputSchema,KLine5mUncheckedUpdateManyInputSchema ]),
  where: KLine5mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine5mUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.KLine5mUpdateManyAndReturnArgs> = z.object({
  data: z.union([ KLine5mUpdateManyMutationInputSchema,KLine5mUncheckedUpdateManyInputSchema ]),
  where: KLine5mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine5mDeleteManyArgsSchema: z.ZodType<Prisma.KLine5mDeleteManyArgs> = z.object({
  where: KLine5mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine1mCreateArgsSchema: z.ZodType<Prisma.KLine1mCreateArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  data: z.union([ KLine1mCreateInputSchema,KLine1mUncheckedCreateInputSchema ]),
}).strict() ;

export const KLine1mUpsertArgsSchema: z.ZodType<Prisma.KLine1mUpsertArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereUniqueInputSchema,
  create: z.union([ KLine1mCreateInputSchema,KLine1mUncheckedCreateInputSchema ]),
  update: z.union([ KLine1mUpdateInputSchema,KLine1mUncheckedUpdateInputSchema ]),
}).strict() ;

export const KLine1mCreateManyArgsSchema: z.ZodType<Prisma.KLine1mCreateManyArgs> = z.object({
  data: z.union([ KLine1mCreateManyInputSchema,KLine1mCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KLine1mCreateManyAndReturnArgsSchema: z.ZodType<Prisma.KLine1mCreateManyAndReturnArgs> = z.object({
  data: z.union([ KLine1mCreateManyInputSchema,KLine1mCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KLine1mDeleteArgsSchema: z.ZodType<Prisma.KLine1mDeleteArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  where: KLine1mWhereUniqueInputSchema,
}).strict() ;

export const KLine1mUpdateArgsSchema: z.ZodType<Prisma.KLine1mUpdateArgs> = z.object({
  select: KLine1mSelectSchema.optional(),
  data: z.union([ KLine1mUpdateInputSchema,KLine1mUncheckedUpdateInputSchema ]),
  where: KLine1mWhereUniqueInputSchema,
}).strict() ;

export const KLine1mUpdateManyArgsSchema: z.ZodType<Prisma.KLine1mUpdateManyArgs> = z.object({
  data: z.union([ KLine1mUpdateManyMutationInputSchema,KLine1mUncheckedUpdateManyInputSchema ]),
  where: KLine1mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine1mUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.KLine1mUpdateManyAndReturnArgs> = z.object({
  data: z.union([ KLine1mUpdateManyMutationInputSchema,KLine1mUncheckedUpdateManyInputSchema ]),
  where: KLine1mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KLine1mDeleteManyArgsSchema: z.ZodType<Prisma.KLine1mDeleteManyArgs> = z.object({
  where: KLine1mWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionInfoCreateArgsSchema: z.ZodType<Prisma.ContributionInfoCreateArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  data: z.union([ ContributionInfoCreateInputSchema,ContributionInfoUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributionInfoUpsertArgsSchema: z.ZodType<Prisma.ContributionInfoUpsertArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereUniqueInputSchema,
  create: z.union([ ContributionInfoCreateInputSchema,ContributionInfoUncheckedCreateInputSchema ]),
  update: z.union([ ContributionInfoUpdateInputSchema,ContributionInfoUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributionInfoCreateManyArgsSchema: z.ZodType<Prisma.ContributionInfoCreateManyArgs> = z.object({
  data: z.union([ ContributionInfoCreateManyInputSchema,ContributionInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionInfoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionInfoCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionInfoCreateManyInputSchema,ContributionInfoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionInfoDeleteArgsSchema: z.ZodType<Prisma.ContributionInfoDeleteArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  where: ContributionInfoWhereUniqueInputSchema,
}).strict() ;

export const ContributionInfoUpdateArgsSchema: z.ZodType<Prisma.ContributionInfoUpdateArgs> = z.object({
  select: ContributionInfoSelectSchema.optional(),
  data: z.union([ ContributionInfoUpdateInputSchema,ContributionInfoUncheckedUpdateInputSchema ]),
  where: ContributionInfoWhereUniqueInputSchema,
}).strict() ;

export const ContributionInfoUpdateManyArgsSchema: z.ZodType<Prisma.ContributionInfoUpdateManyArgs> = z.object({
  data: z.union([ ContributionInfoUpdateManyMutationInputSchema,ContributionInfoUncheckedUpdateManyInputSchema ]),
  where: ContributionInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionInfoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionInfoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionInfoUpdateManyMutationInputSchema,ContributionInfoUncheckedUpdateManyInputSchema ]),
  where: ContributionInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionInfoDeleteManyArgsSchema: z.ZodType<Prisma.ContributionInfoDeleteManyArgs> = z.object({
  where: ContributionInfoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionDetailCreateArgsSchema: z.ZodType<Prisma.ContributionDetailCreateArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  data: z.union([ ContributionDetailCreateInputSchema,ContributionDetailUncheckedCreateInputSchema ]),
}).strict() ;

export const ContributionDetailUpsertArgsSchema: z.ZodType<Prisma.ContributionDetailUpsertArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereUniqueInputSchema,
  create: z.union([ ContributionDetailCreateInputSchema,ContributionDetailUncheckedCreateInputSchema ]),
  update: z.union([ ContributionDetailUpdateInputSchema,ContributionDetailUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContributionDetailCreateManyArgsSchema: z.ZodType<Prisma.ContributionDetailCreateManyArgs> = z.object({
  data: z.union([ ContributionDetailCreateManyInputSchema,ContributionDetailCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionDetailCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionDetailCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionDetailCreateManyInputSchema,ContributionDetailCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContributionDetailDeleteArgsSchema: z.ZodType<Prisma.ContributionDetailDeleteArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  where: ContributionDetailWhereUniqueInputSchema,
}).strict() ;

export const ContributionDetailUpdateArgsSchema: z.ZodType<Prisma.ContributionDetailUpdateArgs> = z.object({
  select: ContributionDetailSelectSchema.optional(),
  data: z.union([ ContributionDetailUpdateInputSchema,ContributionDetailUncheckedUpdateInputSchema ]),
  where: ContributionDetailWhereUniqueInputSchema,
}).strict() ;

export const ContributionDetailUpdateManyArgsSchema: z.ZodType<Prisma.ContributionDetailUpdateManyArgs> = z.object({
  data: z.union([ ContributionDetailUpdateManyMutationInputSchema,ContributionDetailUncheckedUpdateManyInputSchema ]),
  where: ContributionDetailWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionDetailUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContributionDetailUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContributionDetailUpdateManyMutationInputSchema,ContributionDetailUncheckedUpdateManyInputSchema ]),
  where: ContributionDetailWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContributionDetailDeleteManyArgsSchema: z.ZodType<Prisma.ContributionDetailDeleteManyArgs> = z.object({
  where: ContributionDetailWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserClaimHistoryCreateArgsSchema: z.ZodType<Prisma.UserClaimHistoryCreateArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  data: z.union([ UserClaimHistoryCreateInputSchema,UserClaimHistoryUncheckedCreateInputSchema ]),
}).strict() ;

export const UserClaimHistoryUpsertArgsSchema: z.ZodType<Prisma.UserClaimHistoryUpsertArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereUniqueInputSchema,
  create: z.union([ UserClaimHistoryCreateInputSchema,UserClaimHistoryUncheckedCreateInputSchema ]),
  update: z.union([ UserClaimHistoryUpdateInputSchema,UserClaimHistoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserClaimHistoryCreateManyArgsSchema: z.ZodType<Prisma.UserClaimHistoryCreateManyArgs> = z.object({
  data: z.union([ UserClaimHistoryCreateManyInputSchema,UserClaimHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserClaimHistoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserClaimHistoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserClaimHistoryCreateManyInputSchema,UserClaimHistoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserClaimHistoryDeleteArgsSchema: z.ZodType<Prisma.UserClaimHistoryDeleteArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  where: UserClaimHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserClaimHistoryUpdateArgsSchema: z.ZodType<Prisma.UserClaimHistoryUpdateArgs> = z.object({
  select: UserClaimHistorySelectSchema.optional(),
  data: z.union([ UserClaimHistoryUpdateInputSchema,UserClaimHistoryUncheckedUpdateInputSchema ]),
  where: UserClaimHistoryWhereUniqueInputSchema,
}).strict() ;

export const UserClaimHistoryUpdateManyArgsSchema: z.ZodType<Prisma.UserClaimHistoryUpdateManyArgs> = z.object({
  data: z.union([ UserClaimHistoryUpdateManyMutationInputSchema,UserClaimHistoryUncheckedUpdateManyInputSchema ]),
  where: UserClaimHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserClaimHistoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserClaimHistoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserClaimHistoryUpdateManyMutationInputSchema,UserClaimHistoryUncheckedUpdateManyInputSchema ]),
  where: UserClaimHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserClaimHistoryDeleteManyArgsSchema: z.ZodType<Prisma.UserClaimHistoryDeleteManyArgs> = z.object({
  where: UserClaimHistoryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;