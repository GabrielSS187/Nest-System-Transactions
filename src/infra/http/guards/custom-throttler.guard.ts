import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return await Promise.resolve(forwarded.split(',')[0].trim());
    }
    return await Promise.resolve(req.ip ?? 'unknown');
  }
}
