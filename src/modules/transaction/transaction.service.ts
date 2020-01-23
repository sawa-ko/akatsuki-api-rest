import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { TransactionModel } from './models/transaction.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from '../user/models/user.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { MarketModel } from '../market/models/market.model';
import { TransactionDeleteDto } from './dto/transaction.delete.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly i18nService: I18nRequestScopeService,
    @InjectModel(TransactionModel)
    private readonly transactionModel: ReturnModelType<typeof TransactionModel>,
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(MarketModel)
    private readonly marketModel: ReturnModelType<typeof MarketModel>,
  ) {}

  public async DeleteTransaction(transactionDeleteDto: TransactionDeleteDto) {
    return await this.marketModel
      .findOneAndUpdate(
        transactionDeleteDto.product,
        {
          $pull: {
            buyers: {
              user: transactionDeleteDto.buyer,
            },
          },
        },
        { new: true },
      )
      .catch(() => {
        throw new BadRequestException(
          this.i18nService.translate(
            'translations.transactions.controller.transaction_error_deleted',
          ),
        );
      })
      .then(() => {
        this.userModel
          .findOneAndUpdate(
            transactionDeleteDto.buyer,
            {
              $pull: {
                transactions: {
                  product: transactionDeleteDto.product,
                },
              },
            },
            { new: true },
          )
          .catch(() => {
            throw new BadRequestException(
              this.i18nService.translate(
                'translations.transactions.controller.transaction_error_deleted',
              ),
            );
          })
          .then(() => {
            this.userModel
              .findOneAndUpdate(
                transactionDeleteDto.seller,
                {
                  $pull: {
                    transactions: {
                      product: transactionDeleteDto.product,
                    },
                  },
                },
                { new: true },
              )
              .catch(() => {
                throw new BadRequestException(
                  this.i18nService.translate(
                    'translations.transactions.controller.transaction_error_deleted',
                  ),
                );
              });
          });
      });
  }

  public async ProcessTransaction(
    transactionModel: TransactionModel,
  ): Promise<{
    market: string;
    transaction: string;
    walletBuyer: string;
    walletSeller: string;
    message: string;
  }> {
    const { buyer, seller, product, device, ip } = transactionModel;
    let marketTransaction;
    let userBuyer;
    let userSeller;

    try {
      userBuyer = await this.userModel.findById(buyer);
      userSeller = await this.userModel.findById(seller);
      marketTransaction = await this.marketModel.findById(product);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.transaction_error_process',
        ),
      );
    }

    if (!marketTransaction) {
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.transactions.controller.product_not_found',
        ),
      );
    }

    const discountTotal = Math.round(
      marketTransaction.price -
        (marketTransaction.discount.percentage * marketTransaction.price) / 100,
    );

    if (!userBuyer || !userSeller) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (userBuyer.tachi <= discountTotal) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.tachi_error',
        ),
      );
    }

    if (!userSeller.rank.seller) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.rank_seller_error',
        ),
      );
    }

    userBuyer.transactions.push({
      buyer: {
        id: userBuyer,
        ip,
        device,
      },
      seller: userSeller,
      product,
      type: 0,
      price: marketTransaction.price,
      discount: marketTransaction.discount.percentage,
      market: marketTransaction.market,
    });

    userSeller.transactions.push({
      buyer: {
        id: userBuyer,
        ip,
        device,
      },
      seller: userSeller,
      product,
      type: 1,
      price: marketTransaction.price,
      discount: marketTransaction.discount.percentage,
      market: marketTransaction.market,
    });

    marketTransaction.buyers.push({
      user: userBuyer,
      device,
      ip,
    });

    userBuyer.tachi = userBuyer.tachi - discountTotal;
    userSeller.tachi = userSeller.tachi + discountTotal;
    const transaction = await this.transactionModel.create(transactionModel);

    try {
      await userBuyer.save();
      await userSeller.save();
      await marketTransaction.save();
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.transaction_error_save',
        ),
      );
    }

    const transactionid =
      marketTransaction.buyers[marketTransaction.buyers.length - 1]._id;
    const transactionBuyerId =
      userSeller.transactions[userBuyer.transactions.length - 1]._id;
    const transactionSellerId =
      userSeller.transactions[userSeller.transactions.length - 1]._id;

    if (
      transaction._id &&
      transactionid &&
      transactionBuyerId &&
      transactionSellerId
    ) {
      return {
        market: transactionid,
        transaction: transaction._id,
        walletBuyer: transactionBuyerId,
        walletSeller: transactionSellerId,
        message: this.i18nService.translate(
          'translations.transactions.controller.transaction_successful',
        ),
      };
    } else {
      return {
        market: '',
        transaction: '',
        walletBuyer: '',
        walletSeller: '',
        message: this.i18nService.translate(
          'translations.transactions.controller.transaction_error_id',
        ),
      };
    }
  }

  public async GetAllTransactions() {
    return this.transactionModel
      .find()
      .sort('-createdAt')
      .populate('buyer', 'name photo rank premium.status')
      .populate('seller', 'name photo rank premium.status')
      .populate('product', 'name description price market discount')
      .exec();
  }
}
