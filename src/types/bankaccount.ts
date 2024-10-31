export type BankAccountDTO = {
    id: number,
    document: string,
    name: string,
    nameDisplay: string,
    phone: string,
    emailContact: string,
    logo: string,
    softDescriptor: string,
    Address: AddressDTO,
    galaxPayId: number,
    galaxId: string,
    galaxHash: string,
    responsibleDocument: string,
    typeCompany: string,
    cnae: string,
    status: StatusBankAccount,
    type: TypeBankAccount,
    Professional: ProfessionalDTO,
    accountuserId: number,
}

export type AddressDTO = {
    id: number,
    zipCode: string,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    bankaccountId: number
}

export type ProfessionalDTO = {
    id: number,
    internalName: string,
    inscription: string,
}

export enum StatusBankAccount {
    Pending = 1,
    PendingDocuments,
    PendingAnalysis,
    Activated,
    Deactivated
}

export enum TypeBankAccount {
    PF = 1,
    PJ
}