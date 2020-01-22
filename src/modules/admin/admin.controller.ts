import { Controller, Put, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ChangelogModel } from './models/changelog.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('/new/changelog')
  public async NewChangelog(
    @Body() changelog: ChangelogModel,
    @Res() response,
  ) {
    return await this.adminService.NewChangelog(changelog).then(() => {
      response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Registro de cambios publicado con éxito.',
      });
    });
  }

  @Get('/get/changelog')
  public async GetChangelog() {
    return await this.adminService.GetChangelog();
  }
}
