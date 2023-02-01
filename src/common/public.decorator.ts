import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as public (no JWT required). Used for rate limiter skip. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
