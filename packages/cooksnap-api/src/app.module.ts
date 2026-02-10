import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { RecipesModule } from './recipes/recipes.module';
import { GeminiModule } from './gemini/gemini.module';
import { KamisModule } from './kamis/kamis.module';
import { CoupangModule } from './coupang/coupang.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VideoModule } from './video/video.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    RecipesModule,
    GeminiModule,
    KamisModule,
    CoupangModule,
    AuthModule,
    UsersModule,
    VideoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
