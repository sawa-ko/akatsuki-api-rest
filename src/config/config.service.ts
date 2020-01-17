import { existsSync, readFileSync } from 'fs';
import { Logger } from '@nestjs/common';
import { parse } from 'dotenv';

export class ConfigService {
  readonly envConfig: { [ket: string]: string };
  private readonly logger: Logger = new Logger('Configuration');

  constructor() {
    const isDevEnv = process.env.NODE_NEV !== 'production';
    if (isDevEnv) {
      const envFilePath = __dirname + '/../../.env';
      const existPath = existsSync(envFilePath);

      if (!existPath) {
        this.logger.error('.env file does not exist.');
        process.exit(0);
      }

      this.envConfig = parse(readFileSync(envFilePath));
    } else {
      this.envConfig = {
        PORT: process.env.PORT,
      };
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }
}
