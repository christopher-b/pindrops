/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  AppPindropPin: {
    lexicon: 1,
    id: 'app.pindrop.pin',
    defs: {
      main: {
        type: 'record',
        record: {
          type: 'object',
          required: ['lat', 'lng', 'label', 'date'],
          properties: {
            lat: {
              type: 'string',
              description: 'Latitude in decimal degrees.',
            },
            lng: {
              type: 'string',
              description: 'Longitude in decimal degrees.',
            },
            label: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
              description: 'Human-readable label for the pin.',
            },
            date: {
              type: 'string',
              format: 'datetime',
              description: 'ISO8601 UTC date-time',
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  AppPindropPin: 'app.pindrop.pin',
} as const
