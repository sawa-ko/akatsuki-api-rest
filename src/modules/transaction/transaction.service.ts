import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
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
  private readonly logger: Logger = new Logger('Transaction');

  constructor(
    private readonly i18nService: I18nRequestScopeService,
    @InjectModel(TransactionModel)
    private readonly transactionModel: ReturnModelType<typeof TransactionModel>,
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    @InjectModel(MarketModel)
    private readonly marketModel: ReturnModelType<typeof MarketModel>,
  ) { }

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
    transactionData: TransactionModel,
    userRequestId: string,
  ): Promise<{
    market: string;
    transaction: string;
    walletBuyer: string;
    walletSeller: string;
    message: string;
  }> {
    const { buyer, product, device, ip } = transactionData;
    let marketTransaction;
    let userBuyer;
    let userSeller;

    if (userRequestId !== `${buyer}`) {
      throw new ConflictException();
    }

    this.logger.log(
      `Starting process of a new transaction by user ${buyer} with device ${device} and with IP address ${ip}...`,
    );

    try {
      userBuyer = await this.userModel.findById(buyer);
      marketTransaction = await this.marketModel.findById(product);
    } catch (error) {
      this.logger.error(
        `The transaction could not be processed because the product ${product} or buyer ${buyer} does not exist in the database.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.transaction_error_process',
        ),
      );
    }

    if (!marketTransaction) {
      this.logger.error(
        `The transaction could not be processed because the product ${product} does not exist.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.transactions.controller.product_not_found',
        ),
      );
    }

    const userSellerId = marketTransaction.author;
    try {
      userSeller = await this.userModel.findById(userSellerId);
    } catch (error) {
      this.logger.error(
        `The transaction could not be processed because the seller does not exist.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.transaction_error_process',
        ),
      );
    }

    const discountTotal = Math.round(
      marketTransaction.price -
      (marketTransaction.discount.percentage * marketTransaction.price) / 100,
    );

    if (!userBuyer || !userSeller) {
      this.logger.error(
        `The transaction could not be processed because the buyer ${buyer} or seller ${userSellerId} does not exist.`,
      );

      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (userBuyer.tachi <= discountTotal) {
      this.logger.error(
        `The transaction could not be processed because the buyer ${buyer} does not have the Tachi enough to complete the transaction.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.tachi_error',
        ),
      );
    }

    if (!userSeller.rank.seller) {
      this.logger.error(
        `The transaction could not be processed because the seller ${userSellerId} does not have sufficient permits to sell.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.rank_seller_error',
        ),
      );
    }

    this.logger.log(
      `Creating transactions in user accounts ${buyer}, ${userSellerId} and in the product ${product}...`,
    );

    userBuyer.transactions.push({
      buyer: {
        id: userBuyer._id,
        ip,
        device,
      },
      seller: marketTransaction.author._id,
      product,
      type: 0,
      price: marketTransaction.price,
      discount: marketTransaction.discount.percentage,
      market: marketTransaction.market,
    });

    userSeller.transactions.push({
      buyer: {
        id: userBuyer._id,
        ip,
        device,
      },
      seller: marketTransaction.author._id,
      product,
      type: 1,
      price: marketTransaction.price,
      discount: marketTransaction.discount.percentage,
      market: marketTransaction.market,
    });

    marketTransaction.buyers.push({
      user: userBuyer._id,
      device,
      ip,
    });

    this.logger.log(
      `Sharing virtual money between users ${buyer} and ${userSellerId}. In total the seller ${userSellerId} won ${discountTotal} in this transaction and the buyer spent a total of ${discountTotal} of ${marketTransaction.price} having a discount of ${marketTransaction.discount.percentage}%.`,
    );

    userBuyer.tachi = userBuyer.tachi - discountTotal;
    userBuyer.stats.spent = discountTotal;
    userBuyer.stats.exp = userBuyer.stats.exp + (Math.floor(Math.random() * 100) + 1);
    userSeller.tachi = userSeller.tachi + discountTotal;
    userSeller.stats.won = discountTotal;
    userSeller.stats.rep = userBuyer.stats.rep + (Math.floor(Math.random() * 50) + 1);
    const transaction = await this.transactionModel.create(transactionData);

    try {
      await userBuyer.save();
      await userSeller.save();
      await marketTransaction.save();
    } catch (error) {
      this.logger.error(
        `The transaction could not be processed because the changes could not be saved.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.transactions.controller.transaction_error_save',
        ),
      );
    }

    this.logger.log(`Getting transaction ID...`);

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
      this.logger.log(
        `Transaction completed successfully. User initiated ${buyer} to buy the product ${product} that was published by ${userSellerId}.`,
      );

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
      this.logger.warn(
        `The transaction was completed but the transaction IDs could not be obtained. User initiated ${buyer} to buy the product ${product} that was published by ${userSellerId}.`,
      );

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
    this.logger.log('Obtaining all transactions. (Admin)');
    return this.transactionModel
      .find()
      .sort('-createdAt')
      .populate('buyer', 'name photo rank premium.status')
      .populate('seller', 'name photo rank premium.status')
      .populate('product', 'name description price market discount')
      .exec();
  }
}
