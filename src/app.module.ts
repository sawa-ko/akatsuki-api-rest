import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ConfigurationEnum } from './keys/configuration.enum';
import { TypegooseModule } from 'nestjs-typegoose';
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer';
import {
  I18nModule,
  QueryResolver,
  HeaderResolver,
  CookieResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { MarketModule } from './modules/market/market.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { GeneralGateway } from './gateway/general.gateway';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(ConfigurationEnum.DB_HOST),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
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
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new HeaderResolver(),
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    ConfigModule,
    UserModule,
    AuthModule,
    CacheModule.register(),
    AdminModule,
    MarketModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    GeneralGateway,
  ],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get(ConfigurationEnum.PORT_API);
  }
}
