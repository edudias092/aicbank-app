export type TransactionDTO = {
    valueInCents: number;
    value: number;
    payDay: Date;
    statusDate: Date;
    status: string;
    Boleto: BoletoDTO;
    pix: PixDTO;
};
  
export type BoletoDTO = {
    pdf: string;
    bankLine: string;
    bankAgency: string;
    bankAccount: string;
};

export type PixDTO = {
    qrCode: string;
    reference: string;
    image: string;
    page: string;
};
  