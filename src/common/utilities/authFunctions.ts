import { UserToken } from "../../types/userToken";

const ClaimTypes = {
    AccountUserId : "AccountUserId",
    Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
}

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
        const accountUserClaim = userToken.claims.find(c => c.type == ClaimTypes.AccountUserId)

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

export const userHasRole = (roleName: string): boolean => {
    const userToken = getUserToken();

    if(!userToken) return false;

    return userToken.claims.some(x => x.type == ClaimTypes.Role && x.value.toLowerCase() == roleName.toLowerCase())
}

export const isAdmin = (): boolean => {
    return userHasRole("Admin");
}