import { BankStatementFilter } from "../../components/MinhaConta/Extrato";
import { BankChargeFilter } from "../../components/Cobrancas/ListaCobrancas";
import { BankAccountDTO } from "../../types/bankaccount";
import { BankStatement } from "../../types/bankStatement";
import { CelcashPaymentRequestDto } from "../../types/celcashPaymentRequestDto";
import { ChargeDTO } from "../../types/charge";
import { ChargesSumByDate } from "../../types/chargesGraphics";
import { MandatoryDocumentsDTO } from "../../types/mandatoryDocuments";
import { ResponseDTO } from "../../types/ResponseDTO";
import { getUserToken } from "../utilities/authFunctions";
import apiConfig from "../../config/apiConfig";

export class BankAccountService {
    private readonly defaultHeaders: HeadersInit;
    private baseUrl: string | undefined;
    constructor() {
        const userToken = getUserToken();
        this.baseUrl = `${apiConfig.baseUrl}/bankaccount`;
        this.defaultHeaders = {
            "Content-type": "application/json",
            "Authorization": `Bearer ${userToken?.token}`
        }
        
    }
    
    public getAccountById(id: number) : Promise<ResponseDTO<BankAccountDTO>>{
        let response = fetch(`${this.baseUrl}/${id}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public getAccountByUserId(id: number) : Promise<ResponseDTO<BankAccountDTO>>{
        let response = fetch(`${this.baseUrl}/accountuser/${id}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public createAccount(bankAccountDTO: BankAccountDTO) : Promise<ResponseDTO<BankAccountDTO> | string[]>{
        let response = fetch(`${this.baseUrl}`,{
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(bankAccountDTO)
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public updateAccount(bankAccountDTO: BankAccountDTO) : Promise<ResponseDTO<BankAccountDTO> | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountDTO.id}`,{
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
        formData.append("associateName", sendMandatoryDocuments.associateName);
        formData.append("associateType", sendMandatoryDocuments.associateType.toString());
        formData.append("associateDocument", sendMandatoryDocuments.associateDocument);
        formData.append("type", sendMandatoryDocuments.type.toString());

        if(sendMandatoryDocuments.selfie)
        formData.append("selfie", sendMandatoryDocuments.selfie[0]);
        if(sendMandatoryDocuments.front)
        formData.append("front", sendMandatoryDocuments.front[0]);
        if(sendMandatoryDocuments.back)
        formData.append("back", sendMandatoryDocuments.back[0]);
        if(sendMandatoryDocuments.address)
        formData.append("address", sendMandatoryDocuments.address[0]);

        if(sendMandatoryDocuments.cnpjCard)
            formData.append("cnpjCard", sendMandatoryDocuments.cnpjCard[0]);
        if(sendMandatoryDocuments.electionRecord)
            formData.append("electionRecord", sendMandatoryDocuments.electionRecord[0]);
        if(sendMandatoryDocuments.lastContract)
            formData.append("lastContract", sendMandatoryDocuments.lastContract[0]);
        if(sendMandatoryDocuments.statute)
            formData.append("statute", sendMandatoryDocuments.statute[0]);

        let response = fetch(`${this.baseUrl}/${bankAccountId}/documents`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userToken?.token}`
            },
            body: formData
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getMovements(id: number, filter: BankStatementFilter) : Promise<ResponseDTO<BankStatement>>{
        let response = fetch(`${this.baseUrl}/${id}/movements?initialDate=${filter.initialDate.toDateString()}&finalDate=${filter.finalDate.toDateString()}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public createCharge(bankAccountId: number, chargeDTO: ChargeDTO) : Promise<ResponseDTO<ChargeDTO> | string | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountId}/charge`,{
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
        
        const uri = `${this.baseUrl}/${id}/charges${query}`;
        let response = fetch(`${uri}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public getChargeById(id: number, chargeId: string) : Promise<ResponseDTO<ChargeDTO>>{
        let response = fetch(`${this.baseUrl}/${id}/charges/${chargeId}`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public cancelCharge(bankAccountDTO: BankAccountDTO, chargeId: string) : Promise<ResponseDTO<boolean> | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountDTO.id}/charges/${chargeId}`,{
            method: "DELETE",
            headers: this.defaultHeaders
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getBalance(id: number) : Promise<ResponseDTO<CelcashBalanceResponseDto>>{
        let response = fetch(`${this.baseUrl}/${id}/balance`, {
            headers: this.defaultHeaders
        });

        return response.then(r => r.json());
    }

    public createPayment(bankAccountId: number, paymentRequest: CelcashPaymentRequestDto) : Promise<ResponseDTO<object> | string | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountId}/payment`,{
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(paymentRequest)
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getChargesSumByDate(bankAccountId: number) : Promise<ResponseDTO<ChargesSumByDate> | string | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountId}/charges/sumByDate`,{
            method: "GET",
            headers: this.defaultHeaders
        })

        return response.then(r => r.json()).catch(e => e);
    }

    public getChargesSumWeekly(bankAccountId: number) : Promise<ResponseDTO<ChargesSumByDate> | string | string[]>{
        let response = fetch(`${this.baseUrl}/${bankAccountId}/charges/sumWeekly`,{
            method: "GET",
            headers: this.defaultHeaders
        })

        return response.then(r => r.json()).catch(e => e);
    }
}