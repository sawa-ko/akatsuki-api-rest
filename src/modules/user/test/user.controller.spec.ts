import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../models/user.model';
import { AuthModule } from '../../../auth/auth.module';
import { ConfigModule } from '../../../config/config.module';
import { UserService } from '../user.service';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import { ConfigService } from '../../../config/config.service';
import { ConfigurationEnum } from '../../../keys/configuration.enum';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypegooseModule.forFeature([UserModel]),
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
          resolvers: [
            new QueryResolver(['lang', 'locale', 'l']),
            new HeaderResolver(),
            new CookieResolver(['lang', 'locale', 'l']),
          ],
        }),
        AuthModule,
        ConfigModule,
      ],
      providers: [UserService],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
