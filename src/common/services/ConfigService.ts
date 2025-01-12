import apiConfig from "../../config/apiConfig";
import { CelcashBankAccountDto } from "../../types/celcashBankAccountDto";
import { ResponseDTO } from "../../types/ResponseDTO";
import { getUserToken } from "../utilities/authFunctions";

export class ConfigService {
    private readonly defaultHeaders: HeadersInit;
    private baseUrl: string | undefined;
    constructor() {
        const userToken = getUserToken();
        this.baseUrl = `${apiConfig.baseUrl}/config`;
        this.defaultHeaders = {
            "Content-type": "application/json",
            "Authorization": `Bearer ${userToken?.token}`
        }   
    }

    public getSubAccounts() : Promise<ResponseDTO<CelcashBankAccountDto[]>>{
        let response = fetch(`${this.baseUrl}/subaccounts`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public checkSubAccount(galaxId: number, approve: boolean) : Promise<ResponseDTO<boolean>>{
        let response = fetch(`${this.baseUrl}/subaccounts/${galaxId}/status`, {
            method: 'PATCH',
            headers: this.defaultHeaders,
            body: JSON.stringify( approve )
        });

        return response.then(r => r.json());
    }
}