type CelcashBalanceResponseDto = {
    Balance: BalanceDto
}

type BalanceDto = {
    enabled: number,
    requested: number,
    blockedBoleto: number,
    blockedCard: number,
    updatedAt: Date
}