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

 export const getPaymentMethodDescription = (paymentMethod: PaymentMethods) => {
  switch(paymentMethod){
    case 'creditcard':
      return "Cartão de crédito";
    case 'boleto':
      return "Boleto Bancário/Pix";
    case 'pix':
      return "Pix"

    default:
      return ""
  }
}

export const getActualValue = (value: number | null | undefined) => {
  if(value){
    var actualValue = value / 100;

    return "R$ " + actualValue.toFixed(2).toLocaleString();
  }

  return "-";
}

export const getPayDay = (charge: ChargeDTO | null | undefined) => { 
  if(charge){
    if(charge.Transactions && charge.Transactions.length > 0){
      var transaction = charge.Transactions[charge.Transactions.length - 1];
      
      return new Date(transaction.payDay).toLocaleDateString();
    }
  }

  return "-";
}

export const getStatusName = (status: string) => {
  switch(status){
    case 'active':
      return "Ativa";
    case 'canceled':
      return "Cancelada";
    case 'closed':
      return "Encerrada"
    case 'waitingPayment':
      return "Aguardando pagamento"
    case 'inactive':
      return "Inativa"

    default:
      return ""
  }
}

export const isDue = (charge: ChargeDTO | null | undefined) => { 
  if(charge){
    if(charge.Transactions && charge.Transactions.length > 0){
      let transaction = charge.Transactions[charge.Transactions.length - 1];
      let year = new Date().getFullYear();
      let month = new Date().getMonth();
      let date = new Date().getDate();
      let today = new Date(year, month, date);
      return new Date(transaction.payDay).getTime() < today.getTime();
    }
  }

  return false;
}