import apiConfig from "../../config/apiConfig";
import { BankAccountDTO } from "../../types/bankaccount";
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

    public getSubAccounts() : Promise<ResponseDTO<BankAccountDTO[]>>{
        let response = fetch(`${this.baseUrl}/subaccounts`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }
}