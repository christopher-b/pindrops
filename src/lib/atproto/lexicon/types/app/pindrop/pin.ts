/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../lexicons'
import { type $Typed, is$typed as _is$typed, type OmitKey } from '../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.pindrop.pin'

export interface Record {
  $type: 'app.pindrop.pin'
  /** Latitude in decimal degrees. */
  lat: string
  /** Longitude in decimal degrees. */
  lng: string
  /** Human-readable label for the pin. */
  label: string
  /** ISO8601 UTC date-time */
  date: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
