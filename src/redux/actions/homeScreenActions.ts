import { http, image_upload } from "../../http/http";
import CONSTS from '../../constants/consts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode } from 'base64-arraybuffer';
import fs from 'react-native-fs'
//import { GoogleSignin } from "@react-native-google-signin/google-signin";
//import { LoginManager } from "react-native-fbsdk-next";

export const getAllCircles = () => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get('allcircle');
        dispatch({ type: CONSTS.ALL_CIRCLES, circles: response.data.all_circles })
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);

    }
}

export const loginAction = (body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.post('login/', body);
        if (response && response.data) {
            await AsyncStorage.setItem('loginType', "email");
            await AsyncStorage.setItem('userData', JSON.stringify(response.data))
            dispatch({ type: CONSTS.LOGIN, data: response.data, loginType: "email" })
            dispatch({ type: CONSTS.HIDE_LOADER })
            dispatch(updateSnackMessage('Logged in successfully'))
        }
    } catch (error) {
        let errMsg = error["response"]?.data?.message ? error["response"]?.data?.message : "Couldn't log in";
        dispatch(updateSnackMessage(errMsg))
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const socialLoginAction = (body: any, type: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    debugger;
    try {
        await AsyncStorage.setItem('loginType', type);
        await AsyncStorage.setItem('userData', JSON.stringify(body))
        dispatch({ type: CONSTS.LOGIN, data: body, loginType: type })
        dispatch({ type: CONSTS.HIDE_LOADER });
        return true;
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER });
        return false;
    }
}

export const init = () => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let response: any = await AsyncStorage.getItem('userData');
        let loginType: any = await AsyncStorage.getItem('loginType');
        let userRole: any = await AsyncStorage.getItem('userRole');
        response = JSON.parse(response)
        if (response) {
            dispatch({ type: CONSTS.LOGIN, data: response, loginType });
        }
        if (userRole) {
            userRole = JSON.parse(userRole)
            dispatch({ type: CONSTS.SELECT_ROLE, data: userRole });
        }
    } catch (error) {
        throw new Error(error.message);
    }
    dispatch({ type: CONSTS.HIDE_LOADER })
    return true;
}

export const logout = (showToast: boolean = true) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER });
    try {
        let loginType: any = await AsyncStorage.getItem('loginType');
        if (loginType === "facebook") {
            //LoginManager.logOut();
        }
        else if (loginType === "google") {
            //await GoogleSignin.revokeAccess();
            //await GoogleSignin.signOut();
        }
        await AsyncStorage.clear();
        dispatch({ type: CONSTS.LOGOUT });
        showToast ? dispatch(updateSnackMessage('Logged out successfully')) : null
    } catch (error) {

    }
    dispatch({ type: CONSTS.HIDE_LOADER })
}

export const contactUs = (body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response = await http.post('contactus/', body);
        if (response && response.data) {
            dispatch({ type: CONSTS.HIDE_LOADER })
            dispatch(updateSnackMessage('Message sent successfully'));
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const updateSnackMessage = (message: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SNACK_MESSAGE, message })

}

export const getSymptoms = (circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response = await http.get(`mastertable/?type=disease_type&value=${circle_id}`);
        if (response && response.data) {
            dispatch({ type: CONSTS.GET_SYMPTOMS, symptoms: response.data })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getCityData = async (key: string) => {
    try {
        const response = await http.get(`masterlocations/?page_num=1&items=10&city=${key}`);
        if (response && response.data) {
            return response.data.data ? response.data.data : [];
        }
    } catch (error) {
        return [];
    }
}

export const getSymptomsList = async (circle_id: number | string, key?: string) => {
    try {
        const response = await http.get(`symptomsearch/?key=${key ? key : ''}&circle_id=${circle_id}`);
        if (response && response.data) {
            return response.data ? response.data : [];
        }
    } catch (error) {
        return [];
    }
}

export const getAddedSymptomsList = async (circle_id: number | string, user_id: number | string) => {
    try {
        const response = await http.get(`symptoms/?user_id=${user_id}&circle_id=${circle_id}`);
        if (response && response.data) {
            return response.data ? response.data : [];
        }
    } catch (error) {
        return [];
    }
}

export const checkUserNameAvailability = async (key: string) => {
    try {
        const response = await http.get(`displaynamecheck/?key=${key ? key : ''}`);
        return true;
    } catch (error) {
        return false;
    }
}

export const addNewUser = (body: any, uri?: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const url = uri ? uri : body.role == "patient" ? 'usercreate/' : 'caregivercreate/'
        const response = await http.post(url, body);
        if (response && response.data) {
            dispatch({ type: CONSTS.ADD_NEW_USER, user: response.data })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message)
    }
}

export const addSymptom = (body: any, user_id: string | number, circle_id: string | number, type: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response = await http.put(`${type}/?user_id=${user_id}&circle_id=${circle_id}`, body);
        if (response && response.data) {
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message)
    }
}

export const getActivityList = async (key: string, circle_id: string | number, treatment_type: string) => {
    try {
        const response = await http.get(`treatmentsearch/?key=${key}&circle_id=${circle_id}&treatment_type=${treatment_type}`);
        if (response && response.data) {
            return response.data ? response.data : [];
        }
    } catch (error) {
        return [];
    }
}

export const addANewTreatment = (body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response = await http.post(`treatment/`, body);
        if (response && response.data) {
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message)
    }
}

export const getTreatmentList = async (user_role: string, user_id: string | number, circle_id: string | number) => {
    try {
        const response = await http.get(`treatment/?circle_id=${circle_id}&user_id=${user_id}&role=${user_role}`);
        if (response && response.data) {
            return response.data ? response.data : [];
        }
    } catch (error) {
        return [];
    }
}

export const deleteTreatement = async (ids: string) => {
    try {
        const response = await http.delete(`treatment/?ids=${ids}`);
        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export const addUserStory = async (user_id: string, userType: string, body: any) => {
    try {
        const response = await http.put(`${userType}/?user_id=${user_id}`, body);
        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

export const isUserActive = async (body: any) => {
    try {
        const res = await http.post('isactive/', body);
        console.log(res);

        if (res && res.data) {
            return true
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const resendVerificationEmail = async (body: any) => {
    try {
        const res = await http.post('signupresend/', body);
        return true
    } catch (error) {
        throw new Error(error.message)
    }
}

export const toggleToCircleView = (circle: any = {}, activeRoute?: string) => (dispatch: any) => {
    dispatch({ type: CONSTS.NAVIGATE_TO_CIRCLE, activeRoute })
    dispatch({ type: CONSTS.SELECTED_CIRCLE, circle })
    AsyncStorage.removeItem('userRole');
    dispatch({ type: CONSTS.SELECT_ROLE, data: null });
}


export const getUserProfileDate = (user_id: string | number, circle_id: string | number) => async (dispatch: any) => {
    dispatch({ type: CONSTS.CLEAR_PROFILE_DATA })
    dispatch(getUserData(user_id, circle_id))
}


export const getUserData = (user_id: string | number, circle_id: string | number) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`userprofile/?user_id=${user_id}&circle_id=${circle_id}`);
        if (response && response.data) {
            dispatch({ type: CONSTS.USER_DATA, data: response.data })
            dispatch({ type: CONSTS.MY_USER_DATA, data: response.data })
            const role = response.data.user_info.role;
            if (!(role === 'advocate' || role === 'hcp' || role === 'doctor')) {
                dispatch(getUserProfileCompletionData(circle_id, role))
            } else {
                dispatch({ type: CONSTS.USER_PROFILE_COMPLETION_DATA, data: {} })
            }
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        //console.log(error.response);
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getUserProfileCompletionData = (circle_id: string | number, role: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let uri;
        switch (role) {
            case 'caregiver': {
                uri = 'caregiverprofilecompletion';
                break;
            }
            case 'patient': {
                uri = 'normaluserprofilecompletion';
                break;
            }
            default:
                uri = 'normaluserprofilecompletion';
                break;
        }
        const response: any = await http.get(`${uri}/?circle_id=${circle_id}`);
        if (response && response.data) {
            dispatch({ type: CONSTS.USER_PROFILE_COMPLETION_DATA, data: response })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}


export const updateUserData = (user_id: string | number, circle_id: string | number, body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.put(`user/?id=${user_id}`, body);
        if (response && response.data) {
            dispatch(getUserData(user_id, circle_id))
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const uploadProfileImage = (file: any, user_id: string | number, circle_id: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const file_name: any = { file_name: [file.name] }
        const upload_data = await getPresignedUrl(file_name)
        const blob = await getArrayBuffer(file)
        await uploadImage(upload_data.url[0], blob)
        const body = { file_name: upload_data.filename[0] }
        await dispatch(updateUserData(user_id, circle_id, body))
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getPresignedUrl = async (data: any) => {
    try {
        const img_data = await http.post('imageurl/', data)
        return img_data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const uploadImage = async (url: string, body: any) => {
    try {
        await image_upload.put(url, body)
    } catch (error) {
        throw new Error(error.message);
    }
    return
}


export const getArrayBuffer = async (file: any) => {
    try {
        const base64 = await fs.readFile(file.uri, 'base64');
        const arrayBuffer = decode(base64);
        return arrayBuffer;
    } catch (error) {
        console.log(error)
    }
}

export const closeAccount = (circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const res: any = await http.delete(`useraccountclose/?circle_id=${circle_id}`);
        if (res && res.data) {
            dispatch(logout())
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        console.log(error)
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getOtherUserProfile = (user_role: string, user_id: string | number, circle_id: string | number, clearAll?: boolean) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    if (clearAll) {
        dispatch({ type: CONSTS.CLEAR_PROFILE_DATA })
    }
    try {
        const response: any = await http.get(`otheruserprofile/?user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`);
        if (response && response.data) {
            dispatch({ type: CONSTS.USER_DATA, data: response.data })
            dispatch({ type: CONSTS.USER_PROFILE_COMPLETION_DATA, data: {} })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getOtherProfilePageData = (type: string, user_role: string, user_id: string | number, circle_id: string | number) => async (dispatch: any) => {
    //https://devapi.mycircles.dovemed.com/api/hospitalinfo/?id=22780&circle_id=1
    let url = ``;
    switch (type) {
        case "physician":
            url = `doctorinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "doctor":
            url = `doctorinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "clinic":
            url = `clinicinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "nfp":
            url = `nfpinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "other":
            url = `hcpinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "hospital":
            url = `hospitalinfo/?id=${user_id}&circle_id=${circle_id}`;
            break;
        case "otheruser":
            url = `otheruserprofile/?user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`;
            break;
        default:
            url = `otheruserprofile/?user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`;
            break;
    }
    dispatch({ type: CONSTS.SHOW_LOADER })
    if (true) {
        dispatch({ type: CONSTS.CLEAR_PROFILE_DATA })
    }
    try {
        const response: any = await http.get(url);
        if (response && response.data) {
            dispatch({ type: CONSTS.USER_DATA, data: response.data })
            dispatch({ type: CONSTS.USER_PROFILE_COMPLETION_DATA, data: {} })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        // console.log(error);
        // console.log(error["response"]);
        // console.log(error["response"]?.data);


        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
    return true;
}

export const getQuestionCategories = () => async (dispatch: any) => {
    try {
        const res = await http.get(`mastertable/?type=category`);
        if (res && res.data) {
            dispatch({ type: CONSTS.QUESTION_CATEGORIES, data: res.data })
        }
    } catch (error) {
        dispatch({ type: CONSTS.QUESTION_CATEGORIES, data: [] })
    }
}

export const getUserInfo = async (user_role: string, user_id: string | number, circle_id: string | number) => {
    try {
        const response: any = await http.get(`otheruserprofile/?user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`);
        if (response && response.data) {
            return response.data
        }
    } catch (error) {
        return {}
    }
}

export const loginCheck = async (type: string, body: any) => {
    try {
        const response: any = await http.post(`${type}/`, body);
        if (response && response.results) {
            return response.results[0]
        }
    } catch (error) {
        throw new Error("Details not found");
    }
}