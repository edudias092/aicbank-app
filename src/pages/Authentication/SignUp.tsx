import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo.png';
import Logo from '../../images/logo/logo.png';
import { SigninImg } from '../../components/Drawings/AuthDrawings';
import { CadeadoIcon, EmailIcon, GoogleIcon } from '../../components/Icons/Icons';
import { getUserToken, saveUserToken, tokenIsExpired } from '../../common/utilities/authFunctions';
import { useForm } from 'react-hook-form';
import { Login, Registro } from '../../common/services/AuthService';
import { UserToken } from '../../types/userToken';
import { ErrorAlert } from '../../components/Alerts';

type FormRegister = {
  email:string,
  password: string
  confirmPassword: string
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormRegister>();

  useEffect(() => {
    const userToken = getUserToken();

    if (userToken?.token && userToken?.token !== "" && !tokenIsExpired()) {
      navigate("/")
    }

  });

  const enviarRegistro = async (data: any) => {
    if(!isValid) return;
    
    const response = await Registro(data.email, data.password, data.confirmPassword);

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
                <img className="hidden dark:block w-80" src={Logo} alt="Logo" />
                <img className="dark:hidden w-64" src={LogoDark} alt="Logo" />
              </Link>
              <p className="2xl:px-20">
                
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
                Registre-se | AIC Bank
              </h2>

              <form onSubmit={handleSubmit(enviarRegistro)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Digite um email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      { ...register("email", {required: true})}
                    />
                    {errors.email && <span className="text-red-500">Email é obrigatório.</span>}
                    <span className="absolute right-4 top-4">
                      <EmailIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Digite uma senha"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      { ...register("password", {required: true})}
                    />
                    {errors.password && <span className="text-red-500">Senha é obrigatório.</span>}
                    <span className="absolute right-4 top-4">
                      <CadeadoIcon />
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Confirme a Senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Digite novamente a senha"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      { ...register("confirmPassword", {required: true})}
                    />
                    {errors.confirmPassword && <span className="text-red-500"> Confirme a senha é obrigatório.</span>}
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
                    value="Criar conta"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                {false && <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <GoogleIcon />
                  </span>
                  Registre-se com o Google
                </button>
                }

                <div className="mt-6 text-center">
                  <p>
                    Já tem uma conta?{' '}
                    <Link to="/login" className="text-primary">
                      Login
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

export default SignUp;
