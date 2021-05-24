import CONSTS from "../../constants/consts";
const stateList: Array<any> = [
  { display_name: "Alabama", id: 0 },
  { display_name: "Alaska", id: 1 },
  { display_name: "Arizona", id: 2 },
  { display_name: "Arkansas", id: 3 },
  { display_name: "California", id: 4 },
  { display_name: "Colorado", id: 5 },
  { display_name: "Connecticut", id: 6 },
  { display_name: "Delaware", id: 7 },
  { display_name: "Florida", id: 8 },
  { display_name: "Georgia", id: 9 },
  { display_name: "Hawaii", id: 10 },
  { display_name: "Idaho", id: 11 },
  { display_name: "Illinois", id: 12 },
  { display_name: "Indiana", id: 13 },
  { display_name: "Iowa", id: 14 },
  { display_name: "Kansas", id: 15 },
  { display_name: "Kentucky", id: 16 },
  { display_name: "Louisiana", id: 17 },
  { display_name: "Maine", id: 18 },
  { display_name: "Maryland", id: 19 },
  { display_name: "Massachusetts", id: 20 },
  { display_name: "Michigan", id: 21 },
  { display_name: "Minnesota", id: 22 },
  { display_name: "Mississippi", id: 23 },
  { display_name: "Missouri", id: 24 },
  { display_name: "Montana", id: 25 },
  { display_name: "Nebraska", id: 26 },
  { display_name: "Nevada", id: 27 },
  { display_name: "New Hampshire", id: 28 },
  { display_name: "New Jersey", id: 29 },
  { display_name: "New Mexico", id: 30 },
  { display_name: "New York", id: 31 },
  { display_name: "North Carolina", id: 32 },
  { display_name: "North Dakota", id: 33 },
  { display_name: "Ohio", id: 34 },
  { display_name: "Oklahoma", id: 35 },
  { display_name: "Oregon", id: 36 },
  { display_name: "Pennsylvania", id: 37 },
  { display_name: "Rhode Island", id: 38 },
  { display_name: "South Carolina", id: 39 },
  { display_name: "South Dakota", id: 40 },
  { display_name: "Tennessee", id: 41 },
  { display_name: "Texas", id: 42 },
  { display_name: "Utah", id: 43 },
  { display_name: "Vermont", id: 44 },
  { display_name: "Virginia", id: 45 },
  { display_name: "Washington", id: 46 },
  { display_name: "West Virginia", id: 47 },
  { display_name: "Wisconsin", id: 48 },
  { display_name: "Wyoming", id: 49 },
];
interface IntialState {
  mainCoverCategories: Array<any>;
  subCoverCategories: Array<any>;
  coverImages: Array<any>;
  userAbout: any;
  relationships: Array<any>;
  situations: Array<any>;
  profileCircleDoctors: any;
  profileCircleSubCircles: any;
  profileCirclePeople: any;
  askedQuestions: any;
  answeredQuestions: any;
  favoritesList: any;
  updatesList: any;
  notifications: any;
  notificationSettings: any;
  activityInfo: any;
  postList: any;
  resourcesData: any;
  questionsList: any;
  treatments: Array<any>;
  meetPeopleList: any;
  stateList: Array<any>;
  providersData: any;
  notificationDetails: any;
  hospitalData: any;
  clinicData: any;
  nfpData: any;
  otherProfessionalData: any;
}

const intialState: IntialState = {
  mainCoverCategories: [],
  subCoverCategories: [],
  coverImages: [],
  userAbout: {},
  relationships: [],
  situations: [],
  profileCircleDoctors: {},
  profileCircleSubCircles: {},
  profileCirclePeople: {},
  askedQuestions: {},
  answeredQuestions: {},
  favoritesList: {},
  updatesList: {},
  notifications: {},
  notificationSettings: {},
  activityInfo: {},
  postList: {},
  resourcesData: {},
  questionsList: {},
  treatments: [],
  meetPeopleList: {},
  stateList: stateList,
  providersData: {},
  notificationDetails: {},
  hospitalData: {},
  clinicData: {},
  nfpData: {},
  otherProfessionalData: {},
};

export const profileReducer = (
  state: IntialState = intialState,
  action: any
): IntialState => {
  switch (action.type) {
    case CONSTS.MAIN_COVER_CATEGORIES: {
      return { ...state, mainCoverCategories: action.data };
    }
    case CONSTS.SUB_COVER_CATEGORIES: {
      return { ...state, subCoverCategories: action.data };
    }
    case CONSTS.COVER_IMAGES: {
      return { ...state, coverImages: action.data };
    }
    case CONSTS.USER_ABOUT: {
      return { ...state, userAbout: action.data };
    }
    case CONSTS.SITUATIONS: {
      return { ...state, situations: action.data };
    }
    case CONSTS.RELATIONSHIPS: {
      return { ...state, relationships: action.data };
    }
    case CONSTS.PROFILE_CIRCLE_DOCTORS: {
      return { ...state, profileCircleDoctors: action.data };
    }
    case CONSTS.PROFILE_CIRCLE_PEOPLE: {
      return { ...state, profileCirclePeople: action.data };
    }
    case CONSTS.PROFILE_CIRCLE_SUBCIRCLE: {
      return { ...state, profileCircleSubCircles: action.data };
    }
    case CONSTS.LOGOUT: {
      return { ...intialState };
    }
    case CONSTS.PROFILE_ASKED_QUESTIONS: {
      return { ...state, askedQuestions: action.data };
    }
    case CONSTS.PROFILE_ANSWERED_QUESTIONS: {
      return { ...state, answeredQuestions: action.data };
    }
    case CONSTS.PROFILE_FAVORITES_LIST: {
      return { ...state, favoritesList: action.data };
    }
    case CONSTS.PROFILE_UPDATES_LIST: {
      return { ...state, updatesList: action.data };
    }
    case CONSTS.CLEAR_PROFILE_DATA: {
      return {
        ...intialState,
        resourcesData: state.resourcesData,
        questionsList: state.questionsList,
        meetPeopleList: state.meetPeopleList,
        providersData: state.providersData,
        notificationDetails: state.notificationDetails,
      };
    }
    case CONSTS.NOTIFICATIONS: {
      return { ...state, notifications: action.data };
    }
    case CONSTS.NOTIFICATION_SETTINGS: {
      return { ...state, notificationSettings: action.data };
    }
    case CONSTS.ACTIVITY_INFO: {
      return { ...state, activityInfo: action.data };
    }
    case CONSTS.POSTS_LIST: {
      return { ...state, postList: action.data };
    }
    case CONSTS.RESOURCES_DATA: {
      return { ...state, resourcesData: action.data };
    }
    case CONSTS.QUESTIONS_LIST: {
      return { ...state, questionsList: action.data };
    }
    case CONSTS.TREATMENTS_LIST: {
      return { ...state, treatments: action.data };
    }
    case CONSTS.MEET_PEOPLE_LIST: {
      return { ...state, meetPeopleList: action.data };
    }
    case CONSTS.PROVIDERS_LIST: {
      return { ...state, providersData: action.data };
    }
    case CONSTS.NOTIFICATION_DETAILS: {
      return { ...state, notificationDetails: action.data };
    }
    case CONSTS.HOSPITALS_LIST: {
      return { ...state, hospitalData: action.data };
    }
    case CONSTS.CLINICS_LIST: {
      return { ...state, clinicData: action.data };
    }
    case CONSTS.NFP_LIST: {
      return { ...state, nfpData: action.data };
    }
    case CONSTS.OTHER_PROFESSIONAL_LIST: {
      return { ...state, otherProfessionalData: action.data };
    }
    default:
      return state;
  }
};
