export type BankStatement = {
    type: boolean,
    balances: BalanceDTO[],
    totals: TotalsDTO[]
}

export type BalanceDTO = {
    galaxPayId: number,
    value: number,
    createdAt: Date,
    friendlyDescription: string,
    groupPaymentType: string,
    paymentType: string,
    transactionGalaxPayId: number
}

export type TotalsDTO = {
    initial: number,
    final: number
}