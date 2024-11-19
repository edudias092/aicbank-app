export type CelcashPaymentRequestDto = {
    key: string,
    type: CelcashPaymentType,
    value: number,
    valueInDouble: number,
    desc: string,
}

export type CelcashPaymentType = "cpf" | "cnpj" | "mobilePhone" | "email" | "random";