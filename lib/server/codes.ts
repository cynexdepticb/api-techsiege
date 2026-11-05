import { randomBytes, randomUUID } from "node:crypto";

/**
 * Non-guessable team codes and storage-safe upload identifiers.
 *
 * Team code:  TSG-<4 Crockford-base32, no ambiguous chars>  e.g. TSG-7KQZ
 */

const CROCKFORD = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function code(n: number): string {
  const bytes = randomBytes(n);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += CROCKFORD[bytes[i]! % CROCKFORD.length];
  }
  return out;
}

export function newTeamCode(): string {
  return `TSG-${code(4)}`;
}

/** Storage-safe random filename. The uploaded filename is never trusted. */
export function newUploadId(): string {
  return randomUUID();
}
