import { SetMetadata } from '@nestjs/common';

export const Rank = (...rank: string[]) => SetMetadata('rank', rank);
