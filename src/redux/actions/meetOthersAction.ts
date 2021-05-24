import { http, dovemedRequest, k8Staging, stage } from "../../http/http";
import CONSTS from "../../constants/consts";
import { updateSnackMessage } from "./homeScreenActions";
import Axios from "axios";

export const getPeopleList = (
  page_num: number,
  items: number,
  circle_id: number | string,
  location?: string,
  age?: number,
  gender?: string,
  username?: string
) => async (dispatch: any) => {
  try {
    dispatch({ type: CONSTS.SHOW_LOADER });
    let url: string = `membersearch/?page_num=${page_num}&items=${items}&circle_id=${circle_id}`;
    if (location) {
      url += `&location=${location}`;
    }
    if (age) {
      url += `&age=${age}`;
    }
    if (gender) {
      url += `&gender=${gender}`;
    }
    if (username) {
      url += `&username=${username}`;
    }
    const res: any = await http.get(url);
    if (res && res.data) {
      dispatch({ type: CONSTS.MEET_PEOPLE_LIST, data: res.data });
    }
    dispatch({ type: CONSTS.HIDE_LOADER });
    return res.data;
  } catch (error) {
    dispatch({ type: CONSTS.MEET_PEOPLE_LIST, data: {} });
    dispatch({ type: CONSTS.HIDE_LOADER });
  }
};

export const getProvidersList = (
  page: number,
  first_name?: string,
  last_name?: string,
  city?: string,
  speciality?: string,
  gender?: string,
  state?: string
) => async (dispatch: any) => {
  try {
    dispatch({ type: CONSTS.SHOW_LOADER });
    let url: string = `physician/physician-search/?is_active_physician=true&page=${page}`;
    if (first_name) {
      url += `&first_name=${first_name}`;
    }
    if (last_name) {
      url += `&last_name=${last_name}`;
    }
    if (gender) {
      url += `&gender=${gender}`;
    }
    if (city) {
      url += `&city=${city}`;
    }
    if (speciality) {
      url += `&speciality=${speciality}`;
    }
    if (state) {
      url += `&state=${state}`;
    }
    const res: any = await dovemedRequest.get(url);
    if (res && res.data) {
      dispatch({ type: CONSTS.PROVIDERS_LIST, data: res.data });
    }
    dispatch({ type: CONSTS.HIDE_LOADER });
  } catch (error) {
    dispatch({ type: CONSTS.PROVIDERS_LIST, data: {} });
    dispatch({ type: CONSTS.HIDE_LOADER });
  }
};

export const createProvider = (body: any) => async (dispatch: any) => {
  try {
    dispatch({ type: CONSTS.SHOW_LOADER });
    const res: any = await http.post(`provider/`, body);
    if (res && res.data) {
      dispatch(updateSnackMessage("Added successfully"));
    }
    dispatch({ type: CONSTS.HIDE_LOADER });
  } catch (error) {
    dispatch({ type: CONSTS.HIDE_LOADER });
    throw new Error(error.message);
  }
};

export const getDirectoryData = (
  type: string,
  filters: any,
  speciality?: string
) => async (dispatch: any) => {
  try {
    dispatch({ type: CONSTS.SHOW_LOADER });
    let url = "";
    switch (type) {
      case "hospital":
        url = "hospitalsearch/";
        break;
      case "clinic":
        url = "clinicsearch/";
        break;
      case "other":
        url = "";
        break;
      case "nfp":
        url = "nfpsearch/";
        break;
      default:
        break;
    }
    Object.keys(filters).forEach((rs, i) => {
      url += i ? `&${rs}=${filters[rs]}` : `?${rs}=${filters[rs]}`;
    });
    let res;

    if (type == "other") {
      res = await Axios.get(
        `https://stage.k8s.dovemed.com/api/v1/rating/search-ohcp${url}&speciality=${speciality}`,
        {
          headers: {
            Authorization: `Basic ZG92ZW1lZDpkb3ZlbWVkLXJ1bGVz`,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
    } 
    // else if (type == "nfp") {
    //   res = await Axios.get(
    //     `https://pr2760.stage.k8s.dovemed.com/api/v1/nfp/nfps`,
    //     {
    //       headers: {
    //         Authorization: "Basic ZG92ZW1lZDpkb3ZlbWVkLXJ1bGVz",
    //         //"X-Requested-With": "XMLHttpRequest",
    //       },
    //     }
    //   );
    // } 
    else {
      res = await http.get(url);
    }
    console.log(res);

    if (res) {
      switch (type) {
        case "hospital":
          dispatch({ type: CONSTS.HOSPITALS_LIST, data: res });
          break;
        case "clinic":
          dispatch({ type: CONSTS.CLINICS_LIST, data: res });
          break;
        case "other":
          dispatch({ type: CONSTS.OTHER_PROFESSIONAL_LIST, data: res.data });
          break;
        case "nfp":
          dispatch({ type: CONSTS.NFP_LIST, data: res });
          break;
        default:
          break;
      }
    }
    dispatch({ type: CONSTS.HIDE_LOADER });
  } catch (error) {
    console.log(error);
    type === "hospital"
      ? dispatch({ type: CONSTS.HOSPITALS_LIST, data: {} })
      : dispatch({ type: CONSTS.CLINICS_LIST, data: {} });
    dispatch({ type: CONSTS.HIDE_LOADER });
  }
};
