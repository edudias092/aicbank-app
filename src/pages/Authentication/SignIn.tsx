import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo.png';
import { SigninImg } from '../../components/Drawings/AuthDrawings';
import { CadeadoIcon, EmailIcon, GoogleIcon } from '../../components/Icons/Icons';
import { getUserToken, saveUserToken, tokenIsExpired } from '../../common/utilities/authFunctions';
import { Login } from '../../common/services/AuthService';
import { UserToken } from '../../types/userToken';
import { ErrorAlert } from '../../components/Alerts';
import { useForm } from 'react-hook-form';

type FormLogin = {
  email:string,
  password: string
}

const SignIn = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormLogin>();

  useEffect(() => {
    const userToken = getUserToken();

    if (userToken?.token && userToken?.token !== "" && !tokenIsExpired()) {
      navigate("/")
    }

  });

  const enviarLogin = async (data: any) => {
    if(!isValid) return;

    const response = await Login(data.email, data.password);

    if (!response.ok) {
      if (response.status === 400) {
        let result = await response.text();
        setError(result);
        return;
      }
      if (response.status === 500) {
        setError(await response.text());

        return;
      }
    }

    let result = await response.json();
    saveUserToken(result as UserToken);

    navigate("/")
  }

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                {/* <img className="hidden dark:block" src={Logo} alt="Logo" /> */}
                <img className="dark:hidden w-64" src={LogoDark} alt="Logo" />
              </Link>

              <p className="2xl:px-20">
                Faça o login para acessar sua conta.
              </p>

              <span className="mt-15 inline-block">
                <SigninImg />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium"></span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Faça o Login | AIC Bank
              </h2>

              <form onSubmit={handleSubmit(enviarLogin)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Digite seu email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      { ...register("email", {required: true})}
                    />
                    {errors.email && <span className="text-red-500"> Email é obrigatório.</span>}
                    <span className="absolute right-4 top-4">
                      <EmailIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Digite sua senha"
                      {...register("password", {required: true})}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.password && <span className="text-red-500">Senha é obrigatório.</span>}
                    <span className="absolute right-4 top-4">
                      <CadeadoIcon />
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  {error && 
                    <ErrorAlert message={error} action={() => setError(undefined)} />
                  }
                </div>
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Acessar Conta"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
                
                {false && 
                  <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                    <span>
                      <GoogleIcon />
                    </span>
                    Login com o Google
                  </button>
                }

                <div className="mt-6 text-center">
                  <p>
                    Não tem uma conta?{' '}
                    <Link to="/registro" className="text-primary">
                      Registre-se
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
