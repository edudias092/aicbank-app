import { BalanceDTO } from '../../types/bankStatement';

export type TabelaExtratoProps = {
  periodDescription: string,
  balances?: BalanceDTO[]
}

export const TabelaExtrato = ({periodDescription, balances} : TabelaExtratoProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Extrato Período { periodDescription.length ? ` - ${periodDescription}` : ""}
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Data</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Descrição</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Valor</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Grupo Movimentação</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Tipo Movimentação</p>
        </div>
      </div>

      {balances?.map((balance, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-black dark:text-white">
                {balance.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {balance.friendlyDescription}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">
              R$ {balance.value.toFixed(2)}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-black dark:text-white">{balance.groupPaymentType}</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-sm text-meta-3">{balance.paymentType}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
