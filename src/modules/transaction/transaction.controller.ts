import {
  Controller,
  Put,
  Body,
  UseGuards,
  Delete,
  Res,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionModel } from './models/transaction.model';
import { RankGuard } from '../../guards/rank.guard';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDeleteDto } from './dto/transaction.delete.dto';
import { RanksEnum } from '../../keys/ranks.enum';
import { Rank } from '../../decorators/rank.decorator';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { GetUser } from '../../decorators/user.decorator';

@UseGuards(AuthGuard(), RankGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly i18nService: I18nService,
  ) { }

  @Put('/process/purchase')
  public async ProcessTransaction(@Body() transactionModel: TransactionModel, @GetUser() userRequestId: string) {
    return await this.transactionService.ProcessTransaction(transactionModel, userRequestId);
  }

  @Rank(RanksEnum.ADMINISTRATOR, RanksEnum.MODERATOR)
  @Delete('/delete/purchase')
  public async DeleteTransaction(
    @Body() transactionDeleteDto: TransactionDeleteDto,
    @Res() response,
    @I18nLang() lang: string,
  ) {
    return await this.transactionService
      .DeleteTransaction(transactionDeleteDto)
      .then(() => {
        response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: this.i18nService.translate(
            'translations.transactions.service.transaction_deleted',
            {
              lang,
            },
          ),
        });
      });
  }

  @Rank(RanksEnum.ADMINISTRATOR, RanksEnum.MODERATOR)
  @Get('/get/all')
  public async GetTransactions() {
    return this.transactionService.GetAllTransactions();
  }
}
