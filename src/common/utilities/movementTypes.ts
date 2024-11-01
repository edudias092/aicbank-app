const groupPaymentTypes : Map<string, string> = new Map();

groupPaymentTypes.set("phoneRecharge", "Recarga de Celular");
groupPaymentTypes.set("returnTransactionPix", "Pix recebido por QRCode dinâmico");
groupPaymentTypes.set("notificationWhatsapp", "Notificação whatsapp");
groupPaymentTypes.set("inactiveTax", "Tarifa de conta inativa");
groupPaymentTypes.set("purchaseModule", "Compra de módulo");
groupPaymentTypes.set("paymentPix", "Pix enviado");
groupPaymentTypes.set("mensality", "Mensalidade");
groupPaymentTypes.set("devolutionPix", "Devolução de Pix");
groupPaymentTypes.set("specialDevolution", "Mecanismo de devolução especial do pix");
groupPaymentTypes.set("antecipationBlockedToEnabled", "Tarifa de Antecipação de Saldo de Boleto");
groupPaymentTypes.set("boleto", "Boleto");
groupPaymentTypes.set("reverseValue", "Estorno em Conta");
groupPaymentTypes.set("subacquirer", "Cartão de Crédito");
groupPaymentTypes.set("debitValue", "Débito em Conta");
groupPaymentTypes.set("notificationSms", "Notificação SMS");
groupPaymentTypes.set("blockedBalance", "Bloqueio de Saldo");
groupPaymentTypes.set("comission", "Comissão");
groupPaymentTypes.set("withdraw", "Saque/Transferências");
groupPaymentTypes.set("billPayment", "Pagamento de conta");

export const getGroupPaymentTypes = (key: string): string | undefined => {
    return groupPaymentTypes.get(key) ?? key.includes("credit") ? "Crédito" : "Débito";
}

const paymentTypes = new Map();

paymentTypes.set("debitSplit", "Débito de valor que foi realizado o Split")
paymentTypes.set("creditSplit", "Crédito de valor que foi recebido por Split")
paymentTypes.set("credit", "Crédito")
paymentTypes.set("creditPix", "Crédito de Boleto Pago via Pix")
paymentTypes.set("debitTaxPix", "Débito da Taxa de Boleto Pago via Pix")
paymentTypes.set("debitTax", "Débito da Taxa de Boleto Pago")

paymentTypes.set("debitValueEnabledMed", "Débito do valor bloqueado pelo MED")
paymentTypes.set("creditValueEnabledMed", "Crédito do valor recebido por MED")

paymentTypes.set("boletoCreditEnabled", "Crédito do valor da comissão");

paymentTypes.set("creditValueEnabledCancel", "Crédito do valor da transferência cancelada")
paymentTypes.set("creditTaxNormalEnabledCancel", "Crédito da tarifa de transferência cancelada")
paymentTypes.set("creditTaxAntecipationEnabledCancel", "Crédito da tarifa de transferência antecipada")
paymentTypes.set("creditValueEnabled", "Crédito do valor de transferência devolvida por erro")
paymentTypes.set("debitValueEnabled", "Débito do valor da transferência")
paymentTypes.set("debitTaxNormalEnabled", "Débito da tarifa de transferência")
paymentTypes.set("debitTaxAntecipationEnabled", "Débito da tarifa de transferência antecipada")

paymentTypes.set("creditValueCancel", "Crédito do valor de pagamento cancelado");
paymentTypes.set("debitValue", "Débito do valor do pagamento");

paymentTypes.set("debitCardSubacquirerChargeback", "Estorno por chargeback para transações no cartão de débito");
paymentTypes.set("debitCardSubacquirerCredit", "Crédito do recebimento por cartão de débito");
paymentTypes.set("debitCardSubacquirerDebitTax", "Débito da tarifa por cartão de débito");
paymentTypes.set("debitCardDebitSplit", "Débito de valor que foi realizado o Split");
paymentTypes.set("debitCardCreditSplit", "Crédito de valor que foi recebido por Split");
paymentTypes.set("subacquirerChargeback", "Estorno por chargeback para transações no cartão de crédito");
paymentTypes.set("subacquirerReversal", "Estorno");
paymentTypes.set("subacquirerCredit", "Crédito do recebimento por cartão de crédito");
paymentTypes.set("subacquirerDebitTax", "Débito da tarifa por cartão de crédito");
paymentTypes.set("subacquirerDebitTaxAntecipation", "Débito da tarifa de antecipação");

paymentTypes.set("credit", "Crédito de QR Code Pago");
paymentTypes.set("debitTax", "Débito de Taxa");

paymentTypes.set("creditGrossValueEnabledError", "Crédito do valor de Pix devolvido por erro");
paymentTypes.set("creditTaxEnabledError", "Crédito da tarifa de Pix devolvido por erro");
paymentTypes.set("debitGrossValueEnabled", "Débito do valor de Pix Realizado");
paymentTypes.set("debitTaxEnabled", "Débito da taxa de Pix Realizado");

paymentTypes.set("debit", "Débito de valor da Compra de Módulo");

paymentTypes.set("debitNotificationWhatsApp", "Débito da Mensalidade do Módulo: Notificações WhatsApp");

paymentTypes.set("creditReceived", "Crédito para Devolução Pix Recebida");
paymentTypes.set("debitEnabledSended", "Débito para Devolução Pix Enviada");

paymentTypes.set("creditReceivedEnabled", "Crédito para Devolução Pix Recebida via MED (Mecanismo Especial de Devolução)");
paymentTypes.set("debitEnabled", "Débito para Devolução Pix Enviada via MED (Mecanismo Especial de Devolução)");

export const getPaymentTypes = (key: string): string | undefined => {
    return paymentTypes.get(key) ?? key.includes("credit") ? "Crédito" : "Débito";
}