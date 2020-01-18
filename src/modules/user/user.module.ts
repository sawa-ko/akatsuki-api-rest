import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './models/user.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypegooseModule.forFeature([UserModel]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
