import {
  Injectable,
  Logger,
  BadGatewayException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../modules/user/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { TokenGenerator } from 'ts-token-generator';
import { MailerService } from '@nest-modules/mailer';
import { ConfigService } from '../config/config.service';
import { RanksEnum } from '../keys/ranks.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import * as moments from 'moment';
import * as momentstz from 'moment-timezone';
import { SignInDto } from './dto/signin.dto';
import { SecurityDto } from './dto/security.dto';
import { ConfigurationEnum } from '../keys/configuration.enum';
import { IJwtPayload } from './jwt.payload.interface';
import { SecurityUpdateDto } from './dto/security.update.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('Authentication');

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nRequestScopeService,
  ) {}

  public async SignUp(user: UserModel): Promise<void> {
    this.logger.log(
      `Creating a new user with username ${user.username} and with email ${user.email.key}.`,
    );
    const userCreated = new this.userModel(user);
    const passwordSalt = await genSalt(10);

    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    userCreated.email.token = new TokenGenerator().generate();
    userCreated.email.expiration = time;
    userCreated.password.key = await hash(
      userCreated.password.key,
      passwordSalt,
    );
    userCreated.password.token = new TokenGenerator().generate();
    userCreated.ip = user.ip;
    await userCreated
      .save()
      .then(() => {
        this.logger.log(
          `User successfully created with username ${user.username}`,
        );
        this.mailService
          .sendMail({
            to: userCreated.email.key,
            from: 'saturnoxspace@outlook.com',
            subject: 'Verification account | Akatsuki Project',
            template: 'verify_email_request',
            context: {
              name: userCreated.name,
              username: user.username,
              password: user.password.key,
              confirm_account: `${this.configService.get(
                ConfigurationEnum.SERVER_HOST,
              )}auth/email/verification/${userCreated._id}/${
                userCreated.email.token
              }`,
              google_play_app: 'https://play.google.com/akatsukiapp_',
            },
          })
          .catch(() => {
            this.logger.error(
              `Could not send email to user ${user.username} with email ${user.email.key}.`,
            );
            throw new BadGatewayException(
              this.i18nService.translate(
                'translations.auth.service.send_email',
              ),
            );
          });
      })
      .catch((error: any) => {
        if (error.code === 11000) {
          this.logger.error(
            `Could not create user ${user.username} because a user with this data already exists.`,
          );
          throw new ConflictException(
            this.i18nService.translate(
              'translations.auth.service.duplicate_user',
            ),
          );
        }

        this.logger.error(
          `There was a problem processing the user registration request for ${user.username}.`,
        );
        throw new BadRequestException(
          this.i18nService.translate('translations.auth.service.error_signup'),
        );
      });
  }

  public async SignIn(
    signInDto: SignInDto,
  ): Promise<{
    user_id: string;
    session_id: string;
    confirmation: boolean;
    password: boolean;
    ban: boolean;
    ban_reason: string;
    token: string;
  }> {
    const { email, password, device, ip } = signInDto;
    const userSignIn = await this.userModel.findOne({
      'email.key': email,
    });
    this.logger.log(
      `Logging into the account on the device $ {device} with IP ${ip}.`,
    );
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone).toDate();

    if (!userSignIn) {
      this.logger.error(
        `The attempt to login to the account on the device ${device} with IP $ {ip} was rejected due to incorrect cdentials.`,
      );

      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.invalid_credentials',
        ),
      );
    }

    const isPasswordMatch = await compare(password, userSignIn.password.key);
    if (!isPasswordMatch) {
      this.logger.error(
        `The attempt to login to the account ${userSignIn.username} on the device ${device} with IP ${ip} was rejected due to incorrect cdentials.`,
      );

      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.invalid_credentials',
        ),
      );
    }

    const rankData: string[] = [];
    if (userSignIn.rank.admin) {
      rankData.push(RanksEnum.ADMINISTRATOR);
    }

    if (userSignIn.rank.mod) {
      rankData.push(RanksEnum.MODERATOR);
    }

    if (userSignIn.rank.seller) {
      rankData.push(RanksEnum.SELLER);
    }

    if (userSignIn.premium.status) {
      rankData.push(RanksEnum.PREMIUM);
    }

    this.logger.log(
      `Generating ${userSignIn.username} access token for device ${device} with IP ${ip}.`,
    );

    const payload: IJwtPayload = {
      id: userSignIn._id,
      email: userSignIn.email.key,
      username: userSignIn.username,
      rank: rankData,
    };

    const userSessionsDoc = await this.userModel.findOne({
      'email.key': email,
    });

    if (!userSessionsDoc) {
      this.logger.error(
        `The attempt to login to the account ${userSignIn.username} on the device ${device} with IP ${ip} was rejected due to incorrect cdentials.`,
      );

      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.invalid_credentials',
        ),
      );
    }

    const userSessiondExists = await this.userModel.findOne({
      // prettier-ignore
      '_id': userSignIn._id,
      'sessions.device': device,
      'sessions.ip': ip,
    });

    if (userSessiondExists) {
      this.logger.error(
        `The attempt to log on to the account ${userSignIn.username} on the device ${device} with IP ${ip} was rejected because there is already a session registered on that device.`,
      );

      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.session_already_exists',
        ),
      );
    } else {
      if (
        userSignIn.email.status &&
        userSignIn.password.status &&
        !userSignIn.suspension.status
      ) {
        userSessionsDoc.sessions.push({
          device,
          ip,
          twofactor: false,
          createdAt: time,
          updatedAt: time,
        });
        await userSessionsDoc.save();
      } else {
        throw new UnauthorizedException(
          this.i18nService.translate('translations.auth.service.no_permission'),
        );
      }
    }

    const sessionId =
      userSessionsDoc.sessions[userSessionsDoc.sessions.length - 1]._id;
    const tokenUser = this.jwtService.sign(payload);
    if (
      tokenUser &&
      userSignIn.email.status &&
      userSignIn.password.status &&
      !userSignIn.suspension.status &&
      sessionId
    ) {
      this.logger.log(
        `The attempt to log in to the account ${userSignIn.username} in the disposition ${device} with IP ${ip} was successfully completed and the session was logged into the account.`,
      );
      return {
        user_id: userSignIn._id,
        session_id: sessionId,
        confirmation: userSignIn.email.status,
        password: userSignIn.password.status,
        ban: userSignIn.suspension.status,
        ban_reason: '',
        token: tokenUser,
      };
    } else {
      this.logger.error(
        `The attempt to log in to the account ${userSignIn.username} in the disposition ${device} with IP ${ip} was rejected because the account has insufficient permissions to generate an access token and a session.`,
      );
      return {
        user_id: userSignIn._id,
        session_id: '',
        confirmation: userSignIn.email.status,
        password: userSignIn.password.status,
        ban: userSignIn.suspension.status,
        ban_reason: userSignIn.suspension.reason,
        token: '',
      };
    }
  }

  public async VerifyEmail(userId: string, tokenEmail: string): Promise<void> {
    let user;
    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `The request for confirmation of electronic corrode could not be completed because there is no user with this data.`,
      );

      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    this.logger.log(`Verifying email address for account ${user.username}.`);

    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (tokenEmail === user.email.token) {
      this.logger.log(
        `Email address for the account ${user.username} has been successfully confirmed and the account login was enabled.`,
      );

      user.email.status = true;
      user.email.expiration = time;
      user.email.token = new TokenGenerator().generate();
      user.save();
    } else {
      this.logger.error(
        `The email activation of ${user.username} could not be completed because the Token is invalid or has expired.`,
      );
      throw new BadRequestException(
        this.i18nService.translate(
          'translations.auth.service.confirmation_error_token',
        ),
      );
    }
  }

  public async VerifySession(
    userId: string,
    sessionDevice: string,
    sessionIp: string,
    sessionId: string,
  ): Promise<void> {
    let userSessiondExists;
    try {
      userSessiondExists = await this.userModel.findOne({
        // prettier-ignore
        '_id': userId,
        'sessions._id': sessionId,
        'sessions.device': sessionDevice,
        'sessions.ip': sessionIp,
      });
    } catch (error) {
      throw new BadRequestException(
        this.i18nService.translate('translations.auth.service.session_invalid'),
      );
    }

    if (!userSessiondExists) {
      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.session_not_exists',
        ),
      );
    }
  }

  public async VerifySecurity(securityDto: SecurityDto) {
    const user: UserModel = await this.userModel
      .findById(securityDto.id)
      .catch(() => {
        throw new ConflictException(
          this.i18nService.translate(
            'translations.auth.service.user_not_found',
          ),
        );
      });

    if (!user) {
      this.logger.error(
        `The security challenge could not be completed because there is no account with this data.`,
      );

      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    this.logger.log(
      `Verifying security codes to be able to complete the login in the account ${user.username}.`,
    );

    if (!user.security.enabled) {
      this.logger.error(
        `The security challenge could not be processed because the ${user.username} account does not have two-factor security enabled.`,
      );

      throw new ConflictException(
        this.i18nService.translate(
          'translations.auth.service.security_no_enabled',
        ),
      );
    }

    if (
      securityDto.code1 !== user.security.code1 ||
      securityDto.code2 !== user.security.code2 ||
      securityDto.code3 !== user.security.code3 ||
      securityDto.code4 !== user.security.code4 ||
      securityDto.code5 !== user.security.code5
    ) {
      this.logger.error(
        `Security check for account ${user.username} rejected due to incorrectly entered codes.`,
      );

      throw new UnauthorizedException(
        this.i18nService.translate(
          'translations.auth.service.security_code_failed',
        ),
      );
    }
  }

  public async SendPasswordReset(userId: string, userIp: string) {
    let user;
    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }
    const tokenPassword = new TokenGenerator().generate();

    if (!user) {
      this.logger.error(
        `The request for password submission could not be completed because there is no account with this data.`,
      );

      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    this.logger.log(
      `Sending password change confirmation email to the associated email in the ${user.username} account.`,
    );

    await this.mailService
      .sendMail({
        to: user.email.key,
        from: 'saturnoxspace@outlook.com',
        subject: 'Resed password | Akatsuki Project',
        template: 'password_reset_request',
        context: {
          reset_password: 'https://akatsukiapp.com/password/reset',
          name: user.name,
          ip: userIp,
          token: tokenPassword,
        },
      })
      .then(() => {
        this.logger.log(
          `A password change confirmation email was successfully sent to ${user.username}.`,
        );

        user.password.status = false;
        user.password.expiration = time;
        user.password.token = tokenPassword;
        user.save();
      })
      .catch(() => {
        this.logger.error(
          `There was a problem sending the password change confirmation email to ${user.username}.`,
        );

        throw new BadRequestException(
          this.i18nService.translate(
            'translations.auth.service.password_error_reset_email',
          ),
        );
      });
  }

  public async ChangePassword(
    userId: string,
    tokenPasword: string,
    newPassword: string,
  ): Promise<void> {
    let user;
    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `The password change process could not be completed because there is no account with this data.`,
      );

      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    this.logger.log(
      `Changing the account password ${user.username} with code Token ${tokenPasword}.`,
    );

    const salt = await genSalt(10);
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (
      moments().toDate() < user.password.expiration &&
      user.password.token === tokenPasword
    ) {
      this.logger.log(
        `Password successfully changed for account ${user.username} with Token code ${tokenPasword} `,
      );

      user.password.key = await hash(newPassword, salt);
      user.password.status = true;
      user.password.expiration = time;
      user.password.token = new TokenGenerator().generate();
      user.save();
    } else {
      this.logger.error(
        `There was a problem changing the user password ${user.username} because the Token expired or is invalid.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.auth.service.password_token_expiration',
        ),
      );
    }
  }

  public async ChangeSecurity(securityUpdate: SecurityUpdateDto, userRequestId: string, userRequestRank: string[]) {
    let user;
    try {
      user = await this.userModel.findById(securityUpdate.id);
    } catch (error) {
      throw new ConflictException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (!user) {
      this.logger.error(
        `The process of updating account security could not be completed because the requested user does not exist.`,
      );

      throw new NotFoundException(
        this.i18nService.translate('translations.auth.service.user_not_found'),
      );
    }

    if (userRequestId !== securityUpdate.id) {
      if (
        !userRequestRank.includes(RanksEnum.ADMINISTRATOR) &&
        !userRequestRank.includes(RanksEnum.MODERATOR)
      ) {
        throw new ForbiddenException(
          this.i18nService.translate(
            'translations.general.account_no_permission',
          ),
        );
      }
    }

    return await this.userModel
      .findByIdAndUpdate(securityUpdate.id, {
        security: {
          code1: securityUpdate.security.code1,
          code2: securityUpdate.security.code2,
          code3: securityUpdate.security.code3,
          code4: securityUpdate.security.code4,
          code5: securityUpdate.security.code5,
          enabled: securityUpdate.security.enabled,
        },
      })
      .catch(() => {
        throw new BadRequestException(
          this.i18nService.translate('translations.general.process_failed'),
        );
      });
  }

  public async LogOut(userId: string, sessionId: string) {
    this.logger.log(
      `Logging off the user with Id ${userId} and with session Id ${sessionId}.`,
    );

    try {
      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { sessions: { _id: sessionId } } },
      );
    } catch (error) {
      this.logger.error(
        `The session could not be closed with Id ${sessionId} for the user with Id ${userId} because there is no session with that Id or a problem has occurred in the database.`,
      );

      throw new BadRequestException(
        this.i18nService.translate(
          'translations.auth.service.user_session_error',
        ),
      );
    }

    this.logger.log(
      `Successfully closed session for the account with Id ${userId} and with session number ${sessionId}.`,
    );
  }
}
