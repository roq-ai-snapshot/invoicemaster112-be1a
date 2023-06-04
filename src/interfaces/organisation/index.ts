import { ContractInterface } from 'interfaces/contract';
import { FinancialReportInterface } from 'interfaces/financial-report';
import { InvoiceInterface } from 'interfaces/invoice';
import { OrganisationUserInterface } from 'interfaces/organisation-user';
import { UserInterface } from 'interfaces/user';

export interface OrganisationInterface {
  id?: string;
  name: string;
  user_id: string;
  contract?: ContractInterface[];
  financial_report?: FinancialReportInterface[];
  invoice?: InvoiceInterface[];
  organisation_user?: OrganisationUserInterface[];
  user?: UserInterface;
  _count?: {
    contract?: number;
    financial_report?: number;
    invoice?: number;
    organisation_user?: number;
  };
}
