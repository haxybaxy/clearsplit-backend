import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TeamModule } from './modules/team/team.module';
import { ReportModule } from './modules/report/report.module';
import { PropertyModule } from './modules/property/property.module';
import { InvoiceFormModule } from './modules/invoice-form/invoice-form.module';
import { DataImportModule } from './modules/data-import/data-import.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    DatabaseModule,
    TransactionModule,
    TeamModule,
    ReportModule,
    PropertyModule,
    InvoiceFormModule,
    DataImportModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
