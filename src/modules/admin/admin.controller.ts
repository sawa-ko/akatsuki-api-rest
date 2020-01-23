import { Controller, Put, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ChangelogModel } from './models/changelog.model';
import { I18nService, I18nLang } from 'nestjs-i18n';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly i18nService: I18nService,
  ) {}

  @Put('/new/changelog')
  public async NewChangelog(
    @Body() changelog: ChangelogModel,
    @Res() response,
    @I18nLang() lang: string,
  ) {
    return await this.adminService.NewChangelog(changelog).then(() => {
      response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: this.i18nService.translate(
          'translations.admin.controller.changelog_added',
          {
            lang,
          },
        ),
      });
    });
  }

  @Get('/get/changelog')
  public async GetChangelog() {
    return await this.adminService.GetChangelog();
  }
}
