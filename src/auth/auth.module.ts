import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../modules/user/models/user.model';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../config/config.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationEnum } from '../keys/configuration.enum';

@Module({
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
  ],
  providers: [AuthService, ConfigService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
