import { User } from '@entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '@modules/user/user.service';
import { UserProfileModule } from '@modules/user-profile/user-profile.module';
import { UserConnectionModule } from '@modules/user-connection/user-connection.module';
import { UserFollowerModule } from '@modules/user-follower/user-follower.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    UserProfileModule,
    UserConnectionModule,
    UserFollowerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
