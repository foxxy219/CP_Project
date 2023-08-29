const API_ENDPOINT = process.env.REACT_APP_API_USER_BASE_URL || '';

export const API_ROUTES = {
    user:{
        login: `${API_ENDPOINT}/user/login`,
        signUp: `${API_ENDPOINT}/user/sign-up`,
        getUserByObjectId: `${API_ENDPOINT}/user/get-user-by-object-id`,
        getCurrentUser: `${API_ENDPOINT}/user/get-current-user`,
    },
    admin:{
        register: `${API_ENDPOINT}/admin/register`,
        changeRole: `${API_ENDPOINT}/admin/change-role`,
        activeUser: `${API_ENDPOINT}/admin/active-user`,
        deactiveUser: `${API_ENDPOINT}/admin/deactive-user`,
        updateRole: `${API_ENDPOINT}/admin/update-role`,
        updateRFID: `${API_ENDPOINT}/admin/update-rfid`,
    }
};
