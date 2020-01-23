import { Injectable, BadRequestException } from '@nestjs/common';
import { ChangelogModel } from './models/changelog.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(ChangelogModel)
    private readonly changelogModel: ReturnModelType<typeof ChangelogModel>,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async NewChangelog(changelogModel: ChangelogModel) {
    return this.changelogModel.create(changelogModel).catch(() => {
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.admin.service.changelog_error_add',
        ),
      );
    });
  }

  public async GetChangelog() {
    return await this.changelogModel
      .find()
      .populate('author.info', 'username name photo cover rank')
      .limit(1)
      .exec();
  }
}
