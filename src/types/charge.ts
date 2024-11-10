import { CustomerDTO } from "./customer";
import { TransactionDTO } from "./transaction";

export type ChargeDTO = {
    myId: string;
    galaxPayId: number;
    value: number;
    valueInDouble: number;
    paydate: Date;
    paydayString: string;
    mainPaymentMethodId: PaymentMethods;
    paymentLink: string;
    additionalInfo: string;
    status: string;
    Customer: CustomerDTO;
    Transactions: TransactionDTO[];
  };

 export type PaymentMethods = 'creditcard' | 'boleto' | 'pix';