import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express'; // Import MulterModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventsModule } from './events/events.module';
import { AttendeesModule } from './attendees/attendees.module';
import { S3ModuleModule } from './s3-module/s3-module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MulterModule.register({ // Add MulterModule configuration
      dest: './uploads', // Specify the destination directory for uploaded files
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
