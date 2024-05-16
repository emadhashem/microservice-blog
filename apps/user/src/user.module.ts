import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@app/comman/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@app/comman/auth/auth.module';
import { CloudinaryModule } from 'libs/comman/cloudinary/cloudinary.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    CloudinaryModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
