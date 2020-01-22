import { Injectable, BadRequestException } from '@nestjs/common';
import { ChangelogModel } from './models/changelog.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(ChangelogModel)
    private readonly changelogModel: ReturnModelType<typeof ChangelogModel>,
  ) {}

  public async NewChangelog(changelogModel: ChangelogModel) {
    return this.changelogModel.create(changelogModel).catch(() => {
      throw new BadRequestException(
        'We are sorry but we were unable to process the change log.',
      );
    });
  }

  public async GetChangelog() {
    return await this.changelogModel
      .find()
      .populate('author.info', 'username name photo cover rank')
      .exec();
  }
}
