import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule, RequestLoggingMiddleware } from './common/logger';
import { DatabaseModule } from './modules/database/database.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { TeamModule } from './modules/team/team.module';
import { PropertyModule } from './modules/property/property.module';
import { SplitModule } from './modules/split/split.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ReportModule } from './modules/report/report.module';
import { InvoiceFormModule } from './modules/invoice-form/invoice-form.module';
import { DataImportModule } from './modules/data-import/data-import.module';

@Module({
  imports: [
    // Infrastructure
    LoggerModule,
    DatabaseModule,

    // Core entities (order matters - dependencies first)
    CurrencyModule,
    UserModule,
    ContactModule,
    TeamModule,
    PropertyModule,
    SplitModule,
    TransactionModule,

    // Features
    AuthModule,
    ReportModule,
    InvoiceFormModule,
    DataImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
