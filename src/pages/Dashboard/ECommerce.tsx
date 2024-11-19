import React, { useContext, useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import { useNavigate } from 'react-router-dom';
import { getAccountUserEmail, getAccountUserId, tokenIsExpired } from '../../common/utilities/authFunctions';
import { BiCalendarPlus, BiCheckSquare, BiRefresh } from 'react-icons/bi';
import { BankAccountService } from '../../common/services/BankAccountService';
import { ContaContext } from '../../contexts/ContaContextProvider';

const ECommerce: React.FC = () => {
  const bankAccountService = new BankAccountService();
  const bankAccountCtx = useContext(ContaContext);
  
  const navigate = useNavigate();
  const email = getAccountUserEmail() ?? '';

  const [balance, setBalance] = useState<CelcashBalanceResponseDto>();
  const [sendingToApi, setSendingToApi] = useState(false);

  const getAccount = async (userId: number | null) => {
    if(!userId || !email || tokenIsExpired()){
        navigate("/login");
        return;
    }

    if(bankAccountCtx != null && bankAccountCtx?.bankAccount == undefined){
        const response = await bankAccountService.getAccountByUserId(userId)
        
        bankAccountCtx.setBankAccount(response.data)
    }
  }

  const getBalance = async () => {
    if(bankAccountCtx?.bankAccount){
        setSendingToApi(s => s = true);
        
        try{

            const result = await bankAccountService.getBalance(bankAccountCtx?.bankAccount?.id);
            
            if(result.data){
                setBalance(result.data);
            }
        }
        catch(e) {
            console.log(e);
        }

        setSendingToApi(s => s = false);
    }
}

  useEffect(() => {
    var userId = getAccountUserId();
    
    if(!userId){
      
      navigate("/login");
      return;
    }
    getAccount(userId).then(
      () => getBalance().then().catch(e => console.log(e))
    ).catch(e => console.log(e));

  },[bankAccountCtx?.bankAccount])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Saldo disponível da conta" total={balance?.enabled ? "R$ "+balance?.enabled.toLocaleString() : "R$ 0,00"} >
          <BiCheckSquare className='text-2xl text-success' />
        </CardDataStats>
        <CardDataStats title="Saldo em trânsito" total={balance?.requested ? "R$ "+balance?.requested.toLocaleString() : "R$ 0,00"} >
        <BiRefresh className='text-2xl text-primary' />
        </CardDataStats>
        <CardDataStats title="Saldo à receber de boleto" total={balance?.blockedBoleto ? "R$ "+balance?.blockedBoleto.toLocaleString() : "R$ 0,00"} >
          <BiCalendarPlus className='text-2xl text-warning' />
        </CardDataStats>
        <CardDataStats title="Saldo à receber de cartão" total={balance?.blockedCard ? "R$ "+balance?.blockedCard.toLocaleString() : "R$ 0,00"} >
          <BiCalendarPlus className='text-2xl text-danger' />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default ECommerce;
