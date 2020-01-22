import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketModel } from './models/market.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypegooseModule.forFeature([MarketModel]), AuthModule],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
