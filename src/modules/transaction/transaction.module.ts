import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionModel } from './models/transaction.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from '../../auth/auth.module';
import { UserModel } from '../user/models/user.model';
import { MarketModel } from '../market/models/market.model';

@Module({
  imports: [
    TypegooseModule.forFeature([TransactionModel, UserModel, MarketModel]),
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
