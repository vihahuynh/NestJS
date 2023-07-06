import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';

import { UsersService } from './users/users.service';
import { AuthService } from './users/auth.service';

import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forFeature([User, Report]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}
