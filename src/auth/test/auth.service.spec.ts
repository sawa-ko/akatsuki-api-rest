import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../../modules/user/models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { ConfigurationEnum } from '../../keys/configuration.enum';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../auth.controller';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import { AuthModule } from '../auth.module';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
} from 'nestjs-i18n';
import { join } from 'path';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypegooseModule.forFeature([UserModel]),
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory(configService: ConfigService) {
            return {
              secret: configService.get(ConfigurationEnum.TOKEN_SECRET),
              signOptions: {
                expiresIn: '15d',
              },
            };
          },
        }),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            transport: configService.get(ConfigurationEnum.EMAIL_HOST),
            defaults: {
              from: configService.get(ConfigurationEnum.EMAIL_FROM),
            },
            template: {
              dir: __dirname + '/views/email/',
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
        }),
        I18nModule.forRoot({
          path: join(__dirname, '/i18n'),
          filePattern: '*.json',
          fallbackLanguage: 'en_US',
          saveMissing: false,
        }),
        AuthModule,
      ],
      providers: [AuthService, ConfigService, JwtStrategy],
      controllers: [AuthController],
      exports: [JwtStrategy, PassportModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
