import { BalanceDTO } from '../../types/bankStatement';

export type TabelaExtratoProps = {
  periodDescription: string,
  balances?: BalanceDTO[]
}

export const TabelaExtrato = ({periodDescription, balances} : TabelaExtratoProps) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      
      <div className="py-2 px-2 md:px-6 xl:px-7.5">
        <h4 className="text-lg font-semibold text-black dark:text-white">
         { periodDescription.length > 0 ? `Período - ${periodDescription}` : ""}
        </h4>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3">
                  Grupo Movimentação
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo Movimentação
                </th>
            </tr>
        </thead>
        <tbody>
          {balances && balances.length > 0 ? balances?.map((balance, key) => (
            <tr key={key}>
              <td className="px-6 py-4">
                {balance.createdAt.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                {balance.friendlyDescription}
              </td>
              <td className="px-6 py-4">
                R$ {balance.value.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                {balance.groupPaymentType}
              </td>
              <td className="px-6 py-4">
                {balance.paymentType}
              </td>
            </tr>
          )):
            <tr className="bg-white text-center text-lg border-t border-slate-100">
                <td className="py-4" colSpan={6}>
                  Nenhum registro encontrado
                </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};
