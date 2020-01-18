import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RankGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ranks: string[] = this.reflector.get<string[]>(
      'rank',
      context.getHandler(),
    );

    if (!ranks) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasRole = () =>
      user.rank.some((rank: string) => ranks.includes(rank));

    return user && user.rank && hasRole();
  }
}
