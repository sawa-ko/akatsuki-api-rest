import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ChangelogModel } from './models/changelog.model';

@Module({
  imports: [TypegooseModule.forFeature([ChangelogModel])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
