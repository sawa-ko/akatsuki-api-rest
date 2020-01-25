import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MarketModel } from './models/market.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { RanksEnum } from '../../keys/ranks.enum';
import { CommentMarketDto } from './dto/comment.add.dto';
import { CommentRemoveMarketDto } from './dto/comment.remove.dto';
import { BuyerAddMarketDto } from './dto/buyer.add.dto';
import { BuyerRemoveMarketDto } from './dto/buyer.remove.dto';
import { ReactionAddMarketDto } from './dto/reaction.add.dto';
import { ReactionRemoveMarketDto } from './dto/reaction.remove.dto';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class MarketService {
  private readonly logger: Logger = new Logger('Market');

  constructor(
    @InjectModel(MarketModel)
    private readonly marketModel: ReturnModelType<typeof MarketModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async AddProduct(marketModel: MarketModel, idUserRequest: string) {
    this.logger.log(
      `Creating a new product for the market with the name of ${marketModel.name} with a value of ${marketModel.price} and with a discount of ${marketModel.discount.percentage}%. This product is published by ${marketModel.author} on the device ${marketModel.device} with IP ${marketModel.ip}.`,
    );

    if (`${marketModel.author}` !== idUserRequest) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.market.service.product_error_added',
        ),
      );
    }

    this.marketModel.status = false;
    this.marketModel.available = false;

    return await this.marketModel.create(marketModel).catch((error) => {
      this.logger.error(
        `The product with name ${marketModel.name} could not be processed by user ${marketModel.author} due to a database failure.`,
      );

      throw new BadRequestException(error);
    });
  }

  public async ApproveProduct(productId: string) {
    try {
      this.marketModel.findByIdAndUpdate(productId, {
        status: true,
      });
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }
  }

  public async GetProduct(
    productId: string,
    rankUserRequest: string[],
    idUserRequest: string,
  ) {
    this.logger.log(
      `Obtaining product data ${productId} by user ${idUserRequest}.`,
    );

    if (
      !rankUserRequest.includes(RanksEnum.ADMINISTRATOR) &&
      !rankUserRequest.includes(RanksEnum.MODERATOR)
    ) {
      return await this.marketModel
        .findById(productId)
        .select([
          'name',
          'description',
          'market',
          'price',
          'available',
          'status',
          'discount',
          'author',
          'buyers',
          'reactions',
          'comments',
          'createdAt',
          'updatedAt',
        ])
        .populate('author', 'name photo rank premium.status')
        .populate('buyers.user', 'name photo rank premium.status')
        .populate('reactions.user', 'name photo rank premium.status')
        .populate('comments.author', 'name photo rank premium.status')
        .exec();
    }
  }

  public async GetAllProducts(
    filterOrder: number,
    filterMarket: number,
    rankUserRequest: string[],
    idUserRequest: string,
  ) {
    let order = '-createdAt';
    let search = {};

    this.logger.log(
      `Obtaining data of all products with the filterOrder ${filterOrder} by the user ${idUserRequest}.`,
    );

    if (
      !rankUserRequest.includes(RanksEnum.ADMINISTRATOR) &&
      !rankUserRequest.includes(RanksEnum.MODERATOR)
    ) {
      switch (filterOrder) {
        case 1:
          order = '-createdAt';
          break;
        case 2:
          order = '-price';
          break;
        case 3:
          order = '-discount.percentage';
          break;
        case 3:
          order = 'createdAt';
          break;
        case 4:
          order = 'price';
          break;
        case 5:
          order = 'discount.percentage';
          break;
      }

      switch (filterMarket) {
        case 1:
          search = { market: 1, status: true };
          break;
        case 2:
          search = { market: 2, status: true };
          break;
        case 3:
          search = { market: 3, status: true };
          break;
        case 4:
          search = { market: 4, status: true };
          break;
        case 5:
          search = { market: 5, status: true };
          break;
        case 6:
          search = { market: 6, status: true };
          break;
        default:
          search = { market: 1, status: true };
      }

      return await this.marketModel
        .find(search)
        .sort(order)
        .select([
          'name',
          'description',
          'market',
          'price',
          'available',
          'status',
          'discount',
          'author',
          'buyers',
          'reactions',
          'comments',
          'createdAt',
          'updatedAt',
        ])
        .populate('author', 'name photo rank premium.status')
        .populate('buyers.user', 'name photo rank premium.status')
        .populate('reactions.user', 'name photo rank premium.status')
        .populate('comments.author', 'name photo rank premium.status')
        .exec();
    }
  }

  public async GetNoApprovedProducts() {
    return await this.marketModel
      .find({ status: false })
      .sort('-createdAt')
      .select([
        'name',
        'description',
        'market',
        'price',
        'available',
        'status',
        'discount',
        'author',
        'buyers',
        'reactions',
        'comments',
        'createdAt',
        'updatedAt',
      ])
      .populate('author', 'name photo rank premium.status')
      .populate('buyers.user', 'name photo rank premium.status')
      .populate('reactions.user', 'name photo rank premium.status')
      .populate('comments.author', 'name photo rank premium.status')
      .exec();
  }

  public async AddBuyerToProduct(buyerAddMarketDto: BuyerAddMarketDto) {
    let product;

    this.logger.log(
      `Adding the user ${buyerAddMarketDto.user} as a new buyer of the product ${buyerAddMarketDto.product}.`,
    );

    try {
      product = await this.marketModel.findById(buyerAddMarketDto.product);
    } catch (error) {
      this.logger.error(
        `The user ${buyerAddMarketDto.user} could not be added as a new buyer of the product ${buyerAddMarketDto.product} due to an error in the database.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      this.logger.error(
        `The user ${buyerAddMarketDto.user} could not be added as a new buyer of the product ${buyerAddMarketDto.product} because the product does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    product.buyers.push({
      user: buyerAddMarketDto.user,
      device: buyerAddMarketDto.device,
      ip: buyerAddMarketDto.ip,
    });

    return await product.save().catch(() => {
      this.logger.error(
        `The user ${buyerAddMarketDto.user} could not be added as a new buyer of the product ${buyerAddMarketDto.product} because the changes could not be saved.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.buyer_error_added',
        ),
      );
    });
  }

  public async AddComment(commentMarketDto: CommentMarketDto, idUserRequest: string) {
    let product;

    this.logger.log(
      `Adding a new comment for ${commentMarketDto.user} to the product ${commentMarketDto.product}.`,
    );

    try {
      product = await this.marketModel.findById(commentMarketDto.product);
    } catch (error) {
      this.logger.error(
        `A new comment for ${commentMarketDto.user} could not be added to the product ${commentMarketDto.product} due to a system error.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      this.logger.error(
        `A new comment for ${commentMarketDto.user} could not be added to the product ${commentMarketDto.product} because the product does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (`${commentMarketDto.user}` !== idUserRequest) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.market.service.comment_error_added',
        ),
      );
    }

    product.comments.push({
      author: commentMarketDto.user,
      device: commentMarketDto.device,
      ip: commentMarketDto.ip,
      content: commentMarketDto.content,
    });

    return await product.save().catch(() => {
      this.logger.error(
        `A new comment for ${commentMarketDto.user} could not be added to the product ${commentMarketDto.product} because the changes could not be saved.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.comment_error_added',
        ),
      );
    });
  }

  public async AddReaction(reactionAddMarketDto: ReactionAddMarketDto, idUserRequest: string) {
    let product;

    this.logger.log(
      `Adding a new reaction for ${reactionAddMarketDto.user} to the product ${reactionAddMarketDto.product}.`,
    );

    try {
      product = await this.marketModel.findById(reactionAddMarketDto.product);
    } catch (error) {
      this.logger.error(
        `A new reaction for ${reactionAddMarketDto.user} could not be added to the product ${reactionAddMarketDto.product} due to an error in the database.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      this.logger.error(
        `A new reaction for ${reactionAddMarketDto.user} could not be added to the product ${reactionAddMarketDto.product} because the product does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (`${reactionAddMarketDto.user}` !== idUserRequest) {
      throw new ConflictException(
        this.i18nService.translate(
          'translations.market.service.comment_error_added',
        ),
      );
    }

    product.reactions.push({
      user: reactionAddMarketDto.user,
      device: reactionAddMarketDto.device,
      ip: reactionAddMarketDto.ip,
      type: reactionAddMarketDto.type,
    });

    return await product.save().catch(() => {
      this.logger.error(
        `A new reaction for ${reactionAddMarketDto.user} could not be added to the product ${reactionAddMarketDto.product} because the changes could not be saved.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.reaction_error_added',
        ),
      );
    });
  }

  public async RemoveComment(
    commentRemoveMarketDto: CommentRemoveMarketDto,
    idUserRequest: string,
  ) {
    let product;

    this.logger.log(
      `Deleting comment by ${commentRemoveMarketDto.author} in the product ${commentRemoveMarketDto.product}.`,
    );

    try {
      product = await this.marketModel.findById(commentRemoveMarketDto.product);
    } catch (error) {
      this.logger.error(
        `Could not delete comment for ${commentRemoveMarketDto.author} in product ${commentRemoveMarketDto.product} due to an error in the database.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      this.logger.error(
        `Could not delete comment for ${commentRemoveMarketDto.author} in product ${commentRemoveMarketDto.product} because the product does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (idUserRequest !== product.reaction.user) {
      this.logger.error(
        `Could not delete comment for ${commentRemoveMarketDto.author} on product ${commentRemoveMarketDto.product} because user ${idUserRequest} is not the author of the comment.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.market.service.comment_only_delete_owned',
        ),
      );
    }

    return await this.marketModel
      .findOneAndUpdate(
        commentRemoveMarketDto.product,
        {
          $pull: {
            comments: {
              author: commentRemoveMarketDto.author,
            },
          },
        },
        { new: true },
      )
      .catch(() => {
        this.logger.error(
          `Could not delete comment for ${commentRemoveMarketDto.author} in product ${commentRemoveMarketDto.product} because the changes could not be saved.`,
        );

        throw new BadRequestException(
          this.i18nService.translate(
            'translations.market.service.comment_error_deleted',
          ),
        );
      });
  }

  public async RemoveBuyer(buyerRemoveMarketDto: BuyerRemoveMarketDto) {
    this.logger.log(
      `Removing buyer ${buyerRemoveMarketDto.user} from product ${buyerRemoveMarketDto.product}.`,
    );

    return await this.marketModel
      .findOneAndUpdate(
        buyerRemoveMarketDto.product,
        {
          $pull: {
            buyers: {
              user: buyerRemoveMarketDto.user,
            },
          },
        },
        { new: true },
      )
      .catch(() => {
        this.logger.error(
          `Could not remove buyer ${buyerRemoveMarketDto.user} from product ${buyerRemoveMarketDto.product} because the changes could not be saved.`,
        );

        throw new BadRequestException(
          this.i18nService.translate(
            'translations.market.service.buyer_error_deleted',
          ),
        );
      });
  }

  public async RemoveReaction(
    reactionRemoveMarketDto: ReactionRemoveMarketDto,
    idUserRequest: string,
  ) {
    let product;

    this.logger.log(
      `Eliminating reaction for ${reactionRemoveMarketDto.user} in the product ${reactionRemoveMarketDto.product}.`,
    );

    try {
      product = await this.marketModel.findById(
        reactionRemoveMarketDto.product,
      );
    } catch (error) {
      this.logger.error(
        `The reaction could not be deleted for ${reactionRemoveMarketDto.user} in product ${reactionRemoveMarketDto.product} due to a database failure.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      this.logger.error(
        `The reaction could not be removed for ${reactionRemoveMarketDto.user} in the product ${reactionRemoveMarketDto.product} because the product does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (idUserRequest !== product.reaction.user) {
      this.logger.error(
        `The reaction could not be deleted for ${reactionRemoveMarketDto.user} in the product ${reactionRemoveMarketDto.product} because the user ${idUserRequest} is not the author of the reaction.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.market.service.reaction_only_delete_owned',
        ),
      );
    }

    return await this.marketModel
      .findOneAndUpdate(
        reactionRemoveMarketDto.product,
        {
          $pull: {
            reactions: {
              user: reactionRemoveMarketDto.user,
            },
          },
        },
        { new: true },
      )
      .catch(() => {
        this.logger.error(
          `The reaction could not be deleted for ${reactionRemoveMarketDto.user} in the product ${reactionRemoveMarketDto.product} because the changes could not be saved.`,
        );

        throw new BadRequestException(
          this.i18nService.translate(
            'translations.market.service.reaction_error_deleted',
          ),
        );
      });
  }

  public async DeleteProduct(productId: string) {
    return this.marketModel.findByIdAndDelete(productId).catch((error) => {
      throw new NotFoundException(error);
    });
  }
}
