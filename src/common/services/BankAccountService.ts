import { BankStatementFilter } from "../../components/MinhaConta/Extrato";
import { BankChargeFilter } from "../../components/MinhaConta/ListaCobrancas";
import { BankAccountDTO } from "../../types/bankaccount";
import { BankStatement } from "../../types/bankStatement";
import { ChargeDTO } from "../../types/charge";
import { MandatoryDocumentsDTO } from "../../types/mandatoryDocuments";
import { ResponseDTO } from "../../types/ResponseDTO";
import { getUserToken } from "../utilities/authFunctions";
import { buildQueryParams } from "../utilities/helpers";
const baseUrl: string = "http://localhost:5164/api/bankaccount";

export class BankAccountService {
    private readonly defaultHeaders: HeadersInit;
    constructor() {
        const userToken = getUserToken();
        this.defaultHeaders = {
            "Content-type": "application/json",
            "Authorization": `Bearer ${userToken?.token}`
        }
        
    }
    
    public getAccountById(id: number) : Promise<ResponseDTO<BankAccountDTO>>{
        let response = fetch(`${baseUrl}/${id}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public getAccountByUserId(id: number) : Promise<ResponseDTO<BankAccountDTO>>{
        let response = fetch(`${baseUrl}/accountuser/${id}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public createAccount(bankAccountDTO: BankAccountDTO) : Promise<ResponseDTO<BankAccountDTO> | string[]>{
        let response = fetch(`${baseUrl}`,{
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(bankAccountDTO)
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public updateAccount(bankAccountDTO: BankAccountDTO) : Promise<ResponseDTO<BankAccountDTO> | string[]>{
        let response = fetch(`${baseUrl}/${bankAccountDTO.id}`,{
            method: "PUT",
            headers: this.defaultHeaders,
            body: JSON.stringify(bankAccountDTO)
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public sendMandatoryDocuments(bankAccountId: number, sendMandatoryDocuments: MandatoryDocumentsDTO) : Promise<ResponseDTO<BankAccountDTO> | string[]>{
        const formData = new FormData();
        const userToken = getUserToken();

        formData.append("motherName", sendMandatoryDocuments.motherName);
        formData.append("birthDate", sendMandatoryDocuments.birthDate.toISOString());
        formData.append("monthlyIncome", sendMandatoryDocuments.monthlyIncome.toString());
        formData.append("about", sendMandatoryDocuments.about);
        formData.append("socialMediaLink", sendMandatoryDocuments.socialMediaLink);
        formData.append("type", sendMandatoryDocuments.type.toString());
        if(sendMandatoryDocuments.selfie)
        formData.append("selfie", sendMandatoryDocuments.selfie[0]);
        if(sendMandatoryDocuments.front)
        formData.append("front", sendMandatoryDocuments.front[0]);
        if(sendMandatoryDocuments.back)
        formData.append("back", sendMandatoryDocuments.back[0]);
        if(sendMandatoryDocuments.address)
        formData.append("address", sendMandatoryDocuments.address[0]);

        let response = fetch(`${baseUrl}/${bankAccountId}/documents`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken?.token}`
            },
            body: formData
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getMovements(id: number, filter: BankStatementFilter) : Promise<ResponseDTO<BankStatement>>{
        let response = fetch(`${baseUrl}/${id}/movements?initialDate=${filter.initialDate.toDateString()}&finalDate=${filter.finalDate.toDateString()}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public createCharge(bankAccountId: number, chargeDTO: ChargeDTO) : Promise<ResponseDTO<ChargeDTO> | string | string[]>{
        let response = fetch(`${baseUrl}/${bankAccountId}/charge`,{
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(chargeDTO)
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getCharges(id: number, filter: BankChargeFilter | null = null) : Promise<ResponseDTO<ChargeDTO[]>>{
        let query = "";
        if(filter){
            var queryParams = new URLSearchParams();

            queryParams.append("initialDate", filter?.initialDate.toDateString())
            queryParams.append("finalDate", filter?.finalDate.toDateString())

            query = "?"+queryParams.toString();
        }
        
        const uri = `${baseUrl}/${id}/charges${query}`;
        let response = fetch(`${uri}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public getChargeById(id: number, chargeId: string) : Promise<ResponseDTO<ChargeDTO>>{
        let response = fetch(`${baseUrl}/${id}/charges/${chargeId}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public cancelCharge(bankAccountDTO: BankAccountDTO, chargeId: string) : Promise<ResponseDTO<boolean> | string[]>{
        let response = fetch(`${baseUrl}/${bankAccountDTO.id}/charges/${chargeId}`,{
            method: "DELETE",
            headers: this.defaultHeaders
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getBalance(id: number) : Promise<ResponseDTO<CelcashBalanceResponseDto>>{
        let response = fetch(`${baseUrl}/${id}/balance`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }
}