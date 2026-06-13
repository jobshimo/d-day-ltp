import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProgressModule,
    // Serve Angular SPA from the same origin; API routes under /api take precedence.
    // Built api main.js is at dist/apps/api/main.js → __dirname = dist/apps/api
    // Angular output (confirmed E-1): dist/apps/learning-app/browser
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'learning-app', 'browser'),
      exclude: ['/api/{*splat}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
