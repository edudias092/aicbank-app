export type CelcashBankAccountDto = {
    document: string,
    emailContact: string,
    name: string,
    nameDisplay: string,
    Verification: VerificationData,
    ApiAuth: ApiAuth
}

export type VerificationData = {
    reasons: string[]
    status: "approved" | "denied" | "pending" | "analyzing" | "empty"
}

export type ApiAuth = {
    galaxId: string,
    galaxHash: string
}