export type UserToken = {
    token: string
    expiresIn: Date
    claims: UserClaim[]
}

export type UserClaim = {
    type: string,
    value: string
}