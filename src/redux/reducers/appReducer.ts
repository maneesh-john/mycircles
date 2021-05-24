import CONSTS from "../../constants/consts";

const otherProfessionalTypes: Array<{ id: string, display_name: string }> = [
    { "id": "anesthesiology_assistant", "display_name": "Anesthesiology Assistant" },
    { "id": "certified_clinical_nurse_specialist_(cns)", "display_name": "Certified Clinical Nurse Specialist (Cns)" },
    { "id": "certified_nurse_midwife_(cnm)", "display_name": "Certified Nurse Midwife (Cnm)" },
    { "id": "certified_registered_nurse_anesthetist_(crna)", "display_name": "Certified Registered Nurse Anesthetist (Crna)" },
    { "id": "chiropractic", "display_name": "Chiropractic" },
    { "id": "clinical_social_worker", "display_name": "Clinical Social Worker" },
    { "id": "nurse_practitioner", "display_name": "Nurse Practitioner" },
    { "id": "occupational_therapy", "display_name": "Occupational Therapy" },
    { "id": "optometry", "display_name": "Optometry" },
    { "id": "physical_therapy", "display_name": "Physical Therapy" },
    { "id": "physician_assistant", "display_name": "Physician Assistant" },
    { "id": "clinical_psychologist", "display_name": "Clinical Psychologist" },
    { "id": "qualified_audiologist", "display_name": "Qualified Audiologist" },
    { "id": "qualified_speech_language_pathologist", "display_name": "Qualified Speech Language Pathologist" },
    { "id": "registered_dietitian_or_nutrition_professional", "display_name": "Registered Dietitian Or Nutrition Professional" }
];
const adminTypes: Array<{ id: string, display_name: string }> = [
    { id: "hospital", display_name: "Hospital Administrator" },
    { id: "clinic", display_name: "Clinic Administrator" },
    { id: "nfc", display_name: "Non For Profit Administrator" },
]

interface IntialState {
    allCircles: Array<any>,
    selectedCircle: any,
    userData: any,
    token: string,
    loginType: string,
    loader: boolean,
    snackMessage: string,
    symptoms: Array<any>,
    newUser: any,
    isLoggedIn: boolean,
    isCircleView: boolean,
    userProfileInfo: any,
    userProfileCompletionInfo: any,
    role: string,
    userSelectedRole: any,
    myProfileInfo: any,
    activeRoute: string,
    questionCategories: Array<any>,
    otherProfessionalTypes: Array<{ id: string, display_name: string }>
    adminTypes: Array<{ id: string, display_name: string }>
}

const intialState: IntialState = {
    allCircles: [],
    selectedCircle: {},
    userData: {},
    loginType: "",
    token: '',
    loader: false,
    snackMessage: '',
    symptoms: [],
    newUser: {},
    isLoggedIn: false,
    isCircleView: false,
    userProfileInfo: {},
    userProfileCompletionInfo: {},
    role: '',
    userSelectedRole: null,
    myProfileInfo: {},
    activeRoute: '',
    questionCategories: [],
    otherProfessionalTypes,
    adminTypes
}

export const appReducer = (state: IntialState = intialState, action: any): IntialState => {
    switch (action.type) {
        case CONSTS.ALL_CIRCLES: {
            return { ...state, allCircles: action.circles }
        }
        case CONSTS.SELECTED_CIRCLE: {
            return { ...state, selectedCircle: action.circle }
        }
        case CONSTS.LOGIN: {
            return { ...state, isLoggedIn: true, userData: action.data, token: action.data.token, loginType: action.loginType }
        }
        case CONSTS.SHOW_LOADER: {
            return { ...state, loader: true }
        }
        case CONSTS.HIDE_LOADER: {
            return { ...state, loader: false }
        }
        case CONSTS.LOGOUT: {
            return { ...intialState }
        }
        case CONSTS.SNACK_MESSAGE: {
            return { ...state, snackMessage: action.message }
        }
        case CONSTS.GET_SYMPTOMS: {
            return { ...state, symptoms: action.symptoms }
        }
        case CONSTS.ADD_NEW_USER: {
            debugger;
            return { ...state, newUser: action.user, token: action.user.user[0].token, userData: action.user.user[0] }
        }
        case CONSTS.NAVIGATE_TO_CIRCLE: {
            return { ...state, isCircleView: !state.isCircleView, activeRoute: action.activeRoute }
        }
        case CONSTS.USER_DATA: {
            return { ...state, userProfileInfo: action.data, role: action?.data?.user_info?.role }
        }
        case CONSTS.SELECT_ROLE: {
            return {
                ...state, userSelectedRole: action.data
            }
        }
        case CONSTS.MY_USER_DATA: {
            return { ...state, myProfileInfo: action.data }
        }
        case CONSTS.USER_PROFILE_COMPLETION_DATA: {
            return { ...state, userProfileCompletionInfo: action.data }
        }
        case CONSTS.CLEAR_PROFILE_DATA: {
            return { ...state, userProfileInfo: {}, userProfileCompletionInfo: {} }
        }
        case CONSTS.QUESTION_CATEGORIES: {
            return { ...state, questionCategories: action.data }
        }
        default:
            return state;
    }
}
