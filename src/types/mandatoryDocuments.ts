export type MandatoryDocumentsDTO = {
    id: number,
    motherName: string,
    birthDateString: string,
    birthDate: Date,
    monthlyIncome: number,
    about: string,
    socialMediaLink: string,
    type: MandatoryDocumentType,
    selfie?: FileList,
    front?: FileList,
    back?: FileList,
    address?: FileList,
    lastContract?: FileList,
    cnpjCard?: FileList,
    electionRecord?: FileList,
    statute?: FileList,
    associateDocument: string,
    associateType: "partner" | "attorney" | "personinvolved",
    associateName: string,
    statusIntegration: string,
    reasonsStatus: string[]
}

export enum MandatoryDocumentType {
    RG = 1, CNH
}
