import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MarketModel } from './models/market.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { RanksEnum } from 'src/keys/ranks.enum';
import { CommentMarketDto } from './dto/comment.add.dto';
import { CommentRemoveMarketDto } from './dto/comment.remove.dto';
import { BuyerAddMarketDto } from './dto/buyer.add.dto';
import { BuyerRemoveMarketDto } from './dto/buyer.remove.dto';
import { ReactionAddMarketDto } from './dto/reaction.add.dto';
import { ReactionRemoveMarketDto } from './dto/reaction.remove.dto';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(MarketModel)
    private readonly marketModel: ReturnModelType<typeof MarketModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async AddProduct(marketModel: MarketModel) {
    return await this.marketModel.create(marketModel).catch(() => {
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.product_error_added',
        ),
      );
    });
  }

  public async GetProduct(productId: string, rankUserRequest: string[]) {
    if (
      !rankUserRequest.includes(RanksEnum.ADMINISTRATOR) &&
      !rankUserRequest.includes(RanksEnum.MODERATOR)
    ) {
      return await this.marketModel
        .findById(productId)
        .select([
          'name',
          'description',
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

  public async GetAllProducts(filter: number, rankUserRequest: string[]) {
    let order = '-createdAt';

    if (
      !rankUserRequest.includes(RanksEnum.ADMINISTRATOR) &&
      !rankUserRequest.includes(RanksEnum.MODERATOR)
    ) {
      switch (filter) {
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

      return await this.marketModel
        .find({})
        .sort(order)
        .select([
          'name',
          'description',
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

  public async AddBuyerToProduct(buyerAddMarketDto: BuyerAddMarketDto) {
    let product;
    try {
      product = await this.marketModel.findById(buyerAddMarketDto.product);
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
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
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.buyer_error_added',
        ),
      );
    });
  }

  public async AddComment(commentMarketDto: CommentMarketDto) {
    let product;
    try {
      product = await this.marketModel.findById(commentMarketDto.product);
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
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
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.market.service.comment_error_added',
        ),
      );
    });
  }

  public async AddReaction(reactionAddMarketDto: ReactionAddMarketDto) {
    let product;
    try {
      product = await this.marketModel.findById(reactionAddMarketDto.product);
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
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
    try {
      product = await this.marketModel.findById(commentRemoveMarketDto.product);
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (idUserRequest !== product.reaction.user) {
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
        throw new BadRequestException(
          this.i18nService.translate(
            'translations.market.service.comment_error_deleted',
          ),
        );
      });
  }

  public async RemoveBuyer(buyerRemoveMarketDto: BuyerRemoveMarketDto) {
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
    try {
      product = await this.marketModel.findById(
        reactionRemoveMarketDto.product,
      );
    } catch (error) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (!product) {
      throw new NotFoundException(
        this.i18nService.translate(
          'translations.market.service.product_not_found',
        ),
      );
    }

    if (idUserRequest !== product.reaction.user) {
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
        throw new BadRequestException(
          this.i18nService.translate(
            'translations.market.service.reaction_error_deleted',
          ),
        );
      });
  }
}
