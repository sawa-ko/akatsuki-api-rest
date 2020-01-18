import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../../modules/user/models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { ConfigurationEnum } from '../../keys/configuration.enum';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthModule } from '../auth.module';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import { join } from 'path';
import { I18nModule } from 'nestjs-i18n';

describe('Auth Controller', () => {
  let controller: AuthController;

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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
