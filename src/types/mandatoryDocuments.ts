export type MandatoryDocumentsDTO = {
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

}

export enum MandatoryDocumentType {
    RG = 1, CNH
}