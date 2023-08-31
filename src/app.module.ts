import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express'; // Import MulterModule
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendeesModule } from './attendees/attendees.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventsModule } from './events/events.module';
import { S3ModuleModule } from './s3/s3.module';
import { WalletModule } from './wallet/wallet.module';
import { CarpModule } from './carp/carp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MulterModule.register({
      dest: './uploads',
    }),
    EventsModule,
    AttendeesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    EmailModule,
    AuthModule,
    S3ModuleModule,
    WalletModule,
    AttendeesModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    CarpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
