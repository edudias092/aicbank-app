export const buildQueryParams = (obj : object) : string => {
    var queryParams = new URLSearchParams();

    Object.entries(obj).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
    });

    return queryParams.toString();
}