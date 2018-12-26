export const actionType = {
    INFO_COMPANY: "INFO_COMPANY",
    DEFAULT:'DEFAULT',
    INFO_DASHBOARD:'INFO_DASHBOARD',
    INFO_USERS: 'INFO_USERS',
    INFO_REPORTS: 'INFO_REPORTS',
    LIST:'LIST',
    FILTER_USER: "FILTER_USER",
    loading: 'loading',
};

const defaultState = {
    infoCompany: {
        _id:"",
        name:"",
        ownerEmail:"",
        ownerPassword:"",
        description:"",
        logo:"",
        imageQuality:"",
        orderValue:0,
        active: null,
        createAt:"",
        language:"",
        totalSpace:0,
        useSpace:0,
    },
    infoDashboard:{
        userCount:0,
        reportCount:0,
        lastFiveReports:[],
    },
    infoUsers:[],
    infoReports:[],
    list: [],
    filter: {
        user_id: 'all',
    },
    loading: {
        enable: false,
    }
};

export default function Info(state = defaultState, action) {
    switch (action.type) {
        case "INFO_COMPANY":
            return {...state, infoCompany: action.payload};
        case "DEFAULT":
            return {...state,
                filter: {
                    user_id: 'all',
                }};
        case "INFO_DASHBOARD":
            return {...state, infoDashboard: action.payload};
        case "INFO_USERS":
            return {...state, infoUsers: action.payload};
        case "loading":
            return {...state, loading: action.payload};
        case "INFO_REPORTS":
            return {...state, infoReports: action.payload};
        case "LIST":
            return {...state, list: action.payload};
        case "FILTER_USER":
            return {...state, filter: {...state.filter, user_id: action.user}};
        default:
            return state;
    }
}