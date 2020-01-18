import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { AuthModule } from '../../auth/auth.module';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [TypegooseModule.forFeature([UserModel]), AuthModule, ConfigModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
