import { UserToken } from "../../types/userToken";

export const saveUserToken = (userToken: UserToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
}

export const getUserToken = () : UserToken | null => {
    let userTokenJSON = sessionStorage.getItem("token");

    if (userTokenJSON) {
        return JSON.parse(userTokenJSON) as UserToken;
    }

    return null;
}

export const getAccountUserId = () : number | null => {
    const userToken = getUserToken();

    if(userToken){
        const accountUserClaim = userToken.claims.find(c => c.type == "AccountUserId")

        return parseInt(accountUserClaim?.value ?? "");
    }

    return null;
}

export const tokenIsExpired = () : boolean => {
    const token = getUserToken();

    if(!token) return false;

    const dateNow = new Date();
    const tokenExpirationDate = new Date(token.expiresIn)

    return dateNow > tokenExpirationDate;
}

export const getAccountUserEmail = () : string | null => {
    const userToken = getUserToken();

    if(userToken){
        const accountUserClaim = userToken.claims.find(c => c.type == "Email")

        return accountUserClaim?.value ?? "";
    }

    return null;
}

export const logout = () : void => {
    sessionStorage.removeItem("token");
}