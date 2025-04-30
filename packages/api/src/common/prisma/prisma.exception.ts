import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

class BaseError extends PrismaClientKnownRequestError {
  constructor(error: PrismaClientKnownRequestError) {
    super(error.message, {
      code: error.code,
      clientVersion: error.clientVersion,
      meta: error.meta,
      batchRequestIdx: error.batchRequestIdx,
    })
  }
}

export class PrismaAuthenticationFailedError extends BaseError {
  code = 'P1000'
}

export class PrismaDatabaseUnreachableError extends BaseError {
  code = 'P1001'
}

export class PrismaDatabaseTimeoutError extends BaseError {
  code = 'P1002'
}

export class PrismaDatabaseDoesNotExistError extends BaseError {
  code = 'P1003'
}

export class PrismaOperationTimeoutError extends BaseError {
  code = 'P1008'
}

export class PrismaDatabaseAlreadyExistsError extends BaseError {
  code = 'P1009'
}

export class PrismaUserAccessDeniedError extends BaseError {
  code = 'P1010'
}

export class PrismaTlsConnectionError extends BaseError {
  code = 'P1011'
}

export class PrismaSchemaValidationError extends BaseError {
  code = 'P1012'
}

export class PrismaInvalidDatabaseStringError extends BaseError {
  code = 'P1013'
}

export class PrismaUnderlyingModelError extends BaseError {
  code = 'P1014'
}

export class PrismaUnsupportedDatabaseVersionError extends BaseError {
  code = 'P1015'
}

export class PrismaIncorrectParametersError extends BaseError {
  code = 'P1016'
}

export class PrismaServerClosedConnectionError extends BaseError {
  code = 'P1017'
}

export class PrismaValueTooLongError extends BaseError {
  code = 'P2000'
}

export class PrismaRecordDoesNotExistError extends BaseError {
  code = 'P2001'
}

export class PrismaUniqueConstraintError extends BaseError {
  code = 'P2002'
}

export class PrismaForeignKeyConstraintError extends BaseError {
  code = 'P2003'
}

export class PrismaDatabaseConstraintError extends BaseError {
  code = 'P2004'
}

export class PrismaInvalidFieldValueError extends BaseError {
  code = 'P2005'
}

export class PrismaInvalidValueError extends BaseError {
  code = 'P2006'
}

export class PrismaDataValidationError extends BaseError {
  code = 'P2007'
}

export class PrismaQueryParsingError extends BaseError {
  code = 'P2008'
}

export class PrismaQueryValidationError extends BaseError {
  code = 'P2009'
}

export class PrismaRawQueryFailedError extends BaseError {
  code = 'P2010'
}

export class PrismaNullConstraintViolationError extends BaseError {
  code = 'P2011'
}

export class PrismaMissingRequiredValueError extends BaseError {
  code = 'P2012'
}

export class PrismaMissingRequiredArgumentError extends BaseError {
  code = 'P2013'
}

export class PrismaRelationViolationError extends BaseError {
  code = 'P2014'
}

export class PrismaRelatedRecordNotFoundError extends BaseError {
  code = 'P2015'
}

export class PrismaQueryInterpretationError extends BaseError {
  code = 'P2016'
}

export class PrismaRecordsNotConnectedError extends BaseError {
  code = 'P2017'
}

export class PrismaConnectedRecordsNotFoundError extends BaseError {
  code = 'P2018'
}

export class PrismaInputError extends BaseError {
  code = 'P2019'
}

export class PrismaValueOutOfRangeError extends BaseError {
  code = 'P2020'
}

export class PrismaTableDoesNotExistError extends BaseError {
  code = 'P2021'
}

export class PrismaColumnDoesNotExistError extends BaseError {
  code = 'P2022'
}

export class PrismaInconsistentColumnDataError extends BaseError {
  code = 'P2023'
}

export class PrismaConnectionPoolTimeoutError extends BaseError {
  code = 'P2024'
}

export class PrismaOperationFailedError extends BaseError {
  code = 'P2025'
}

export class PrismaUnsupportedFeatureError extends BaseError {
  code = 'P2026'
}

export class PrismaDatabaseQueryExecutionErrors extends BaseError {
  code = 'P2027'
}

export class PrismaTransactionApiError extends BaseError {
  code = 'P2028'
}

export class PrismaFulltextIndexNotFoundError extends BaseError {
  code = 'P2030'
}

export class PrismaMongoDBReplicaSetError extends BaseError {
  code = 'P2031'
}

export class PrismaNumberOutOfRangeError extends BaseError {
  code = 'P2033'
}

export class PrismaTransactionConflictError extends BaseError {
  code = 'P2034'
}

export class PrismaDatabaseCreationFailedError extends BaseError {
  code = 'P3000'
}

export class PrismaMigrationDestructiveChangesError extends BaseError {
  code = 'P3001'
}

export class PrismaMigrationRollbackError extends BaseError {
  code = 'P3002'
}

export class PrismaMigrationFormatChangedError extends BaseError {
  code = 'P3003'
}

export class PrismaSystemDatabaseAlterationError extends BaseError {
  code = 'P3004'
}

export class PrismaNonEmptySchemaError extends BaseError {
  code = 'P3005'
}

export class PrismaFailedMigrationError extends BaseError {
  code = 'P3006'
}

export class PrismaPreviewFeaturesBlockedError extends BaseError {
  code = 'P3007'
}

export class PrismaMigrationAlreadyAppliedError extends BaseError {
  code = 'P3008'
}

export class PrismaFailedMigrationsError extends BaseError {
  code = 'P3009'
}

export class PrismaMigrationNameTooLongError extends BaseError {
  code = 'P3010'
}

export class PrismaMigrationNotFoundForRollbackError extends BaseError {
  code = 'P3011'
}

export class PrismaMigrationNotInFailedStateError extends BaseError {
  code = 'P3012'
}

export class PrismaProviderArraysNotSupportedError extends BaseError {
  code = 'P3013'
}

export class PrismaShadowDatabaseCreationError extends BaseError {
  code = 'P3014'
}

export class PrismaMigrationFileNotFoundError extends BaseError {
  code = 'P3015'
}

export class PrismaDatabaseResetFallbackFailedError extends BaseError {
  code = 'P3016'
}

export class PrismaMigrationNotFoundError extends BaseError {
  code = 'P3017'
}

export class PrismaMigrationFailedToApplyError extends BaseError {
  code = 'P3018'
}

export class PrismaProviderMismatchError extends BaseError {
  code = 'P3019'
}

export class PrismaShadowDatabaseDisabledError extends BaseError {
  code = 'P3020'
}

export class PrismaNoForeignKeysError extends BaseError {
  code = 'P3021'
}

export class PrismaNoDirectDdlError extends BaseError {
  code = 'P3022'
}

export class PrismaIntrospectionFailedError extends BaseError {
  code = 'P4000'
}

export class PrismaEmptyIntrospectedDatabaseError extends BaseError {
  code = 'P4001'
}

export class PrismaInconsistentIntrospectedSchemaError extends BaseError {
  code = 'P4002'
}

export class PrismaDataProxyRequestError extends BaseError {
  code = 'P5000'
}

export class PrismaDataProxyRetryRequestError extends BaseError {
  code = 'P5001'
}

export class PrismaDataProxyInvalidDatasourceError extends BaseError {
  code = 'P5002'
}

export class PrismaDataProxyResourceNotFoundError extends BaseError {
  code = 'P5003'
}

export class PrismaDataProxyFeatureNotImplementedError extends BaseError {
  code = 'P5004'
}

export class PrismaDataProxySchemaUploadError extends BaseError {
  code = 'P5005'
}

export class PrismaDataProxyUnknownServerError extends BaseError {
  code = 'P5006'
}

export class PrismaDataProxyUnauthorizedError extends BaseError {
  code = 'P5007'
}

export class PrismaDataProxyUsageExceededError extends BaseError {
  code = 'P5008'
}

export class PrismaDataProxyRequestTimeoutError extends BaseError {
  code = 'P5009'
}

export class PrismaDataProxyFetchError extends BaseError {
  code = 'P5010'
}

export class PrismaDataProxyInvalidRequestParametersError extends BaseError {
  code = 'P5011'
}

export class PrismaDataProxyUnsupportedEngineVersionError extends BaseError {
  code = 'P5012'
}

export class PrismaDataProxyEngineStartupError extends BaseError {
  code = 'P5013'
}

export class PrismaDataProxyUnknownEngineStartupError extends BaseError {
  code = 'P5014'
}

export class PrismaDataProxyInteractiveTransactionError extends BaseError {
  code = 'P5015'
}

const errorCodeToClass = {
  P1000: PrismaAuthenticationFailedError,
  P1001: PrismaDatabaseUnreachableError,
  P1002: PrismaDatabaseTimeoutError,
  P1003: PrismaDatabaseDoesNotExistError,
  P1008: PrismaOperationTimeoutError,
  P1009: PrismaDatabaseAlreadyExistsError,
  P1010: PrismaUserAccessDeniedError,
  P1011: PrismaTlsConnectionError,
  P1012: PrismaSchemaValidationError,
  P1013: PrismaInvalidDatabaseStringError,
  P1014: PrismaUnderlyingModelError,
  P1015: PrismaUnsupportedDatabaseVersionError,
  P1016: PrismaIncorrectParametersError,
  P1017: PrismaServerClosedConnectionError,
  P2000: PrismaValueTooLongError,
  P2001: PrismaRecordDoesNotExistError,
  P2002: PrismaUniqueConstraintError,
  P2003: PrismaForeignKeyConstraintError,
  P2004: PrismaDatabaseConstraintError,
  P2005: PrismaInvalidFieldValueError,
  P2006: PrismaInvalidValueError,
  P2007: PrismaDataValidationError,
  P2008: PrismaQueryParsingError,
  P2009: PrismaQueryValidationError,
  P2010: PrismaRawQueryFailedError,
  P2011: PrismaNullConstraintViolationError,
  P2012: PrismaMissingRequiredValueError,
  P2013: PrismaMissingRequiredArgumentError,
  P2014: PrismaRelationViolationError,
  P2015: PrismaRelatedRecordNotFoundError,
  P2016: PrismaQueryInterpretationError,
  P2017: PrismaRecordsNotConnectedError,
  P2018: PrismaConnectedRecordsNotFoundError,
  P2019: PrismaInputError,
  P2020: PrismaValueOutOfRangeError,
  P2021: PrismaTableDoesNotExistError,
  P2022: PrismaColumnDoesNotExistError,
  P2023: PrismaInconsistentColumnDataError,
  P2024: PrismaConnectionPoolTimeoutError,
  P2025: PrismaOperationFailedError,
  P2026: PrismaUnsupportedFeatureError,
  P2027: PrismaDatabaseQueryExecutionErrors,
  P2028: PrismaTransactionApiError,
  P2030: PrismaFulltextIndexNotFoundError,
  P2031: PrismaMongoDBReplicaSetError,
  P2033: PrismaNumberOutOfRangeError,
  P2034: PrismaTransactionConflictError,
  P3000: PrismaDatabaseCreationFailedError,
  P3001: PrismaMigrationDestructiveChangesError,
  P3002: PrismaMigrationRollbackError,
  P3003: PrismaMigrationFormatChangedError,
  P3004: PrismaSystemDatabaseAlterationError,
  P3005: PrismaNonEmptySchemaError,
  P3006: PrismaFailedMigrationError,
  P3007: PrismaPreviewFeaturesBlockedError,
  P3008: PrismaMigrationAlreadyAppliedError,
  P3009: PrismaFailedMigrationsError,
  P3010: PrismaMigrationNameTooLongError,
  P3011: PrismaMigrationNotFoundForRollbackError,
  P3012: PrismaMigrationNotInFailedStateError,
  P3013: PrismaProviderArraysNotSupportedError,
  P3014: PrismaShadowDatabaseCreationError,
  P3015: PrismaMigrationFileNotFoundError,
  P3016: PrismaDatabaseResetFallbackFailedError,
  P3017: PrismaMigrationNotFoundError,
  P3018: PrismaMigrationFailedToApplyError,
  P3019: PrismaProviderMismatchError,
  P3020: PrismaShadowDatabaseDisabledError,
  P3021: PrismaNoForeignKeysError,
  P3022: PrismaNoDirectDdlError,
  P4000: PrismaIntrospectionFailedError,
  P4001: PrismaEmptyIntrospectedDatabaseError,
  P4002: PrismaInconsistentIntrospectedSchemaError,
  P5000: PrismaDataProxyRequestError,
  P5001: PrismaDataProxyRetryRequestError,
  P5002: PrismaDataProxyInvalidDatasourceError,
  P5003: PrismaDataProxyResourceNotFoundError,
  P5004: PrismaDataProxyFeatureNotImplementedError,
  P5005: PrismaDataProxySchemaUploadError,
  P5006: PrismaDataProxyUnknownServerError,
  P5007: PrismaDataProxyUnauthorizedError,
  P5008: PrismaDataProxyUsageExceededError,
  P5009: PrismaDataProxyRequestTimeoutError,
  P5010: PrismaDataProxyFetchError,
  P5011: PrismaDataProxyInvalidRequestParametersError,
  P5012: PrismaDataProxyUnsupportedEngineVersionError,
  P5013: PrismaDataProxyEngineStartupError,
  P5014: PrismaDataProxyUnknownEngineStartupError,
  P5015: PrismaDataProxyInteractiveTransactionError,
} as const

type ErrorCode = keyof typeof errorCodeToClass

export function toTypedPrismaError(error: BaseError) {
  if (!(error instanceof PrismaClientKnownRequestError)) {
    return null
  }

  const code: ErrorCode = error.code as ErrorCode
  const ErrorClass = errorCodeToClass[code]

  if (!ErrorClass) {
    return null
  }

  return new ErrorClass(error)
}
