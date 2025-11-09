export * from './authentication.service';
import { AuthenticationApiService } from './authentication.service';
export * from './borrower.service';
import { BorrowerApiService } from './borrower.service';
export * from './company.service';
import { CompanyApiService } from './company.service';
export * from './default.service';
import { DefaultApiService } from './default.service';
export * from './file.service';
import { FileApiService } from './file.service';
export * from './inOutBalance.service';
import { InOutBalanceApiService } from './inOutBalance.service';
export * from './loan.service';
import { LoanApiService } from './loan.service';
export * from './payment.service';
import { PaymentApiService } from './payment.service';
export * from './reports.service';
import { ReportsApiService } from './reports.service';
export * from './user.service';
import { UserApiService } from './user.service';
export const APIS = [
  AuthenticationApiService,
  BorrowerApiService,
  CompanyApiService,
  DefaultApiService,
  FileApiService,
  InOutBalanceApiService,
  LoanApiService,
  PaymentApiService,
  ReportsApiService,
  UserApiService,
];
