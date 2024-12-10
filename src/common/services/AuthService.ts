import apiConfig from "../../config/apiConfig";

const baseUrl: string = `${apiConfig.baseUrl}/Auth`;

export const Login = async (email: string, password: string) : Promise<Response> => {

    return await fetch(`${baseUrl}/login`, {
        method:"POST",
        body: JSON.stringify({email, password}),
        mode:`cors`,
        headers:{
            "Content-type": "application/json"
        }
    });
}

export const Registro = async (email: string, 
                                password: string, 
                                confirmPassword:string) : Promise<Response> => {
    
    return await fetch(`${baseUrl}/register`, {
        method:"POST",
        body: JSON.stringify({email, password, confirmPassword}),
        mode:`cors`,
        headers:{
            "Content-type": "application/json"
        }
    });
}