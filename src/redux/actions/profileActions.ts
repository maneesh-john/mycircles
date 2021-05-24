import { http } from "../../http/http";
import CONSTS from '../../constants/consts'
import { updateSnackMessage, getPresignedUrl, getArrayBuffer, uploadImage, getUserProfileCompletionData } from "./homeScreenActions";
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment';

export const getMainCoverCategories = () => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    dispatch({ type: CONSTS.SUB_COVER_CATEGORIES, data: [] })
    dispatch({ type: CONSTS.COVER_IMAGES, data: [] })
    try {
        const response: any = await http.get(`mastertable/?type=image`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.MAIN_COVER_CATEGORIES, data: response["data"] })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        dispatch({ type: CONSTS.MAIN_COVER_CATEGORIES, data: [] })
    }
}

export const getSubCoverCategories = (parent_id: string | number) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    dispatch({ type: CONSTS.COVER_IMAGES, data: [] })
    try {
        const response: any = await http.get(`mastertable/?type=image&parent_id=${parent_id}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.SUB_COVER_CATEGORIES, data: response["data"] })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.SUB_COVER_CATEGORIES, data: [] })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getCoverImages = (image_type_id: string | number) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`backgroundimage/?image_type_id=${image_type_id}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.COVER_IMAGES, data: response["data"] })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.COVER_IMAGES, data: [] })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}


export const getAbout = (user_id: string | number, circle_id: string | number, role: string, other_profile: boolean = false, other_user_profile_role?: string, type?: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER });
    try {
        
        let uri;
        switch (role) {
            case 'caregiver': {
                if (type == "notification_user") {
                    uri = `caregiver/?user_id=${user_id}`;
                }
                else {
                    uri = other_profile ? `caregiver/?id=${user_id}` : `caregiver/?user_id=${user_id}`;
                }
                break;
            }
            case 'patient': {
                if (type == "notification_user") {
                    uri = `normaluserabout/?user_id=${user_id}&role=patient`;
                }
                else {
                    uri = other_profile ? `normaluserabout/?id=${user_id}` : `normaluserabout/?user_id=${user_id}&role=patient`;
                }
                break;
            }
            case 'advocate': {
                uri = other_profile ? `advocate/?user_id=${user_id}` : `advocate/?user_id=${user_id}`;//`advocate/?id=${user_id}`;
                break;
            }
            case 'hcp': {
                uri = `hcp/?id=${user_id}`;
                break;
            }
            case 'doctor': {
                uri = other_profile ? `doctorinfo/?id=${user_id}` : `doctor/?user_id=${user_id}`;
                break;
            }
            case 'hospital': {
                uri = other_profile ? `hospitalinfo/?id=${user_id}` : `hospital/?user_id=${user_id}`;
                break;
            }
            case 'clinic': {
                uri = other_profile ? `clinicinfo/?id=${user_id}` : `clinic/?user_id=${user_id}`;
                break;
            }
            default:
                uri = `normaluserabout?user_id=${user_id}`;
                if (other_user_profile_role) {
                    uri += `&role=${other_user_profile_role}`;
                }
                break;
        }
        
        const response: any = await http.get(`${uri}&circle_id=${circle_id}`);
        
        if (!other_profile && (role === 'patient' || role === 'caregiver')) {
            dispatch(getUserProfileCompletionData(circle_id, role))
        }
        if (response && response["data"]) {
            dispatch({ type: CONSTS.USER_ABOUT, data: response["data"] })
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        console.log(error.response);
        console.log(error.response["data"]);
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const updateCircleUserData = (user_id: string | number, circle_id: string | number, data: any, includeCircle: boolean = true, role: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let uri;
        switch (role) {
            case 'caregiver': {
                uri = 'caregiver';
                break;
            }
            case 'patient': {
                uri = 'normaluser';
                break;
            }
            case 'advocate': {
                uri = 'advocate';
                break;
            }
            case 'hcp': {
                uri = 'hcp';
                break;
            }
            default:
                uri = 'normaluser';
                break;
        }
        let url: string = `${uri}/?user_id=${user_id}`;
        if (includeCircle) {
            url += `&circle_id=${circle_id}`
        }
        const response: any = await http.put(url, data);
        if (response && response["data"]) {
            dispatch(getAbout(user_id, circle_id, role))
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const geBaseDataForProfileEdit = () => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const relatioshipResponse: any = await http.get(`mastertable/?type=relationship`);
        const situationResponse: any = await http.get(`mastertable/?type=current_situation`);
        if (relatioshipResponse && relatioshipResponse.data) {
            dispatch({ type: CONSTS.RELATIONSHIPS, data: relatioshipResponse.data })
        }
        if (situationResponse && situationResponse.data) {
            dispatch({ type: CONSTS.SITUATIONS, data: situationResponse.data })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const editAbout = (user_id: string | number, circle_id: string | number, body: any, role: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let uri;
        switch (role) {
            case 'caregiver': {
                uri = 'caregiverabout';
                break;
            }
            case 'patient': {
                uri = 'normaluserabout';
                break;
            }
            // case 'advocate': {
            //     uri = '';
            //     break;
            // }
            // case 'hcp': {
            //     uri = '';
            //     break;
            // }
            default:
                uri = 'normaluserabout';
                break;
        }
        const response: any = await http.put(`${uri}/?user_id=${user_id}`, body);
        if (response && response["data"]) {
            dispatch(getAbout(user_id, circle_id, role))
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        console.log(error.response["data"]);

        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getProfileCirclePeople = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`profilecirclepeople/?page_num=${page_num}&items=${items}&user_id=${user_id}&role=${user_role}&circle_id=${circle_id}`);

        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_CIRCLE_PEOPLE, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {

        dispatch({ type: CONSTS.PROFILE_CIRCLE_PEOPLE, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getProfileCircleSubCircle = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`profilecirclesubcircles/?page_num=${page_num}&items=${items}&user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`);

        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_CIRCLE_SUBCIRCLE, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {

        dispatch({ type: CONSTS.PROFILE_CIRCLE_SUBCIRCLE, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getProfileCircleDoctors = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`profilecircledoctors/?page_num=${page_num}&items=${items}&user_id=${user_id}&circle_id=${circle_id}&role=${user_role}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_CIRCLE_DOCTORS, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {

        dispatch({ type: CONSTS.PROFILE_CIRCLE_DOCTORS, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const addUserToCircle = (user_role: string, circle_id: number | string, selected_user_id?: number | string, ext_ref_id?: string | number, type?: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let url: string = `${type ? type : 'addtocircle'}/?circle_id=${circle_id}&role=${user_role}`
        if (selected_user_id) {
            url += `&user_id=${selected_user_id}`
        } else if (ext_ref_id) {
            url += `&ext_ref_id=${ext_ref_id}`
        }
        const response: any = await http.post(url);
        if (response && response["data"]) {
            dispatch(updateSnackMessage(response.message))
        }
        dispatch({ type: CONSTS.HIDE_LOADER });
        return true;
    } catch (error) {
        
        let errMsg = error["response"]?.data?.message ? error["response"]?.data?.message : "Already added";
        dispatch(updateSnackMessage(errMsg))
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(errMsg);
        return false;
    }
}

export const removeUserFromCircle = (selected_user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.delete(`removefromcircle/?user_id=${selected_user_id}&circle_id=${circle_id}`);
        if (response && response["data"]) {
            dispatch(updateSnackMessage(response.message))
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        console.log(error);
        console.log(error["response"]);
        console.log(error["response"]?.data);
        dispatch(updateSnackMessage(error.message))
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);

    }
}

export const getAskedQuestions = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string, sort_by: string = '-created_at') => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`askquestions/?user_id=${user_id}&role=${user_role}&circle_id=${circle_id}&page_num=${page_num}&items=${items}&sort_by=${sort_by}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_ASKED_QUESTIONS, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        dispatch({ type: CONSTS.PROFILE_ASKED_QUESTIONS, data: {} })

    }
}

export const getAnsweredQuestions = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string, sort_by: string = '-created_at') => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`askquestionsansweredlist/?user_id=${user_id}&role=${user_role}&circle_id=${circle_id}&page_num=${page_num}&items=${items}&sort_by=${sort_by}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_ANSWERED_QUESTIONS, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        dispatch({ type: CONSTS.PROFILE_ANSWERED_QUESTIONS, data: {} })
    }
}

export const addReaction = async (circle_id: number | string, body: any) => {
    try {
        const response: any = await http.post(`reactions/?circle_id=${circle_id}`, body)
        if (response) {
            return response
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const sharePosts = async (circle_id: number | string, body: any) => {
    try {
        const response: any = await http.post(`bulkshare/?circle_id=${circle_id}`, body)
        if (response) {
            return response
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


export const removeReaction = async (reaction_id: number | string,) => {
    try {
        const response: any = await http.delete(`reactions/?ids=${reaction_id}`)
        if (response) {
            return true
        }
    } catch (error) {
        console.log(error)
        throw new Error(error.message);
    }
}

export const getFavoritesList = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`reactionsfavoritelist/?user_id=${user_id}&role=${user_role}&circle_id=${circle_id}&page_num=${page_num}&items=${items}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.PROFILE_FAVORITES_LIST, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        console.log(error)
        dispatch({ type: CONSTS.HIDE_LOADER })
        dispatch({ type: CONSTS.PROFILE_FAVORITES_LIST, data: {} })
    }
}

export const getPostsList = (user_role: string, page_num: number, items: number, user_id: number | string, circle_id: number | string, receiver_id: string, sort_by: string = '-created_at', filters?: string, activity?: boolean, showLoader: boolean = true, post_id?: string | number) => async (dispatch: any) => {
    if (showLoader) {
        dispatch({ type: CONSTS.SHOW_LOADER })
    }
    
    try {
        let url: string = `dovemedpost/?page_num=${page_num}&items=${items}&sort_by=${sort_by}`;
        if (!activity && user_role){ //} && user_role !== "caregiver") {
            url += `&role=${user_role}`
        }
        if (post_id) {
            url += `&id=${post_id}`
        }
        if (circle_id) {
            url += `&circle_id=${circle_id}`
        }
        if (user_id) {
            url += `&user_id=${user_id}`
        }
        if (receiver_id) {
            url += `&receiver_user=${receiver_id}`
        }
        if (filters) {
            url += `&filters=${filters}`
        }
        let response: any = await http.get(url);
        if (response && response["data"]) {
            let posts = response["data"].data;
            posts = posts.sort((a: any, b: any) => {
                let d1 = moment(a.post_time);
                let d2 = moment(b.post_time);
                if (d1 < d2) {
                    return 1;
                }
                else if (d1 > d2) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
            response["data"].data = posts;
            if (post_id) {
                dispatch({ type: CONSTS.NOTIFICATION_DETAILS, data: response["data"] })
            }
            else if (activity) {
                dispatch({ type: CONSTS.POSTS_LIST, data: response["data"] })
            } else {
                dispatch({ type: CONSTS.PROFILE_UPDATES_LIST, data: response["data"] })
            }
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        // console.log(error.response);
        // console.log(error.response["data"]);
        dispatch({ type: CONSTS.HIDE_LOADER })
        if (post_id) {
            dispatch({ type: CONSTS.NOTIFICATION_DETAILS, data: {} })
        }
        else if (activity) {
            dispatch({ type: CONSTS.POSTS_LIST, data: {} })
        } else {
            dispatch({ type: CONSTS.PROFILE_UPDATES_LIST, data: {} })
        }
    }
}

export const getPostComments = async (page_num: number, items: number, item_id: number | string) => {
    try {
        const response: any = await http.get(`dovemedpostcomments/?page_num=${page_num}&items=${items}&post_id=${item_id}`);
        if (response && response["data"]) {
            return response["data"];
        }
    } catch (error) {
        return {}
    }
}

export const getQuestionComments = async (page_num: number, items: number, item_id: number | string, circle_id: number | string) => {
    try {
        const response: any = await http.get(`questioncomments/?page_num=${page_num}&items=${items}&question_id=${item_id}&circle_id=${circle_id}`);
        if (response && response["data"]) {
            return response["data"];
        }
    } catch (error) {
        return {}
    }
}

export const getPostSubComments = async (comment_id: number | string) => {
    try {
        const response: any = await http.get(`commentsonpostcomment/?page_num=1&items=100&comment_id=${comment_id}`);
        if (response && response["data"]) {
            return response["data"];
        }
    } catch (error) {
        return {}
    }
}

export const postCommentsOnQuestion = async (circle_id: string | number, body: any) => {
    try {
        const response: any = await http.post(`comments/?circle_id=${circle_id}`, body);
        if (response && response["data"]) {
            return response["data"];
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const processAndUploadImage = async (file: any): Promise<string> => {
    try {
        const file_name: any = { file_name: [file.name] }
        const upload_data = await getPresignedUrl(file_name)
        const blob = await getArrayBuffer(file)
        await uploadImage(upload_data.url[0], blob)
        return upload_data.filename[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getSharePeopleList = async (page_num: number, items: number, circle_id: number | string, username?: string): Promise<any> => {
    try {
        let url = `share/?page_num=${page_num}&items=${items}&circle_id=${circle_id}`;
        if (username) {
            url += `&username=${username}`
        }
        const res: any = await http.get(url);
        if (res) {
            return res;
        }
    } catch (error) {
        console.log(error.response);

        return {}
    }
}

export const updateOrganizationContactInfo = (user_id: string | number, circle_id: string | number, data: any, location_id: number | string, role: string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        let uri;
        switch (role) {
            case 'advocate': {
                uri = 'advocatecontactdetails';
                break;
            }
            case 'hcp': {
                uri = 'hcpcontactdetails';
                break;
            }
            default:
                uri = 'advocatecontactdetails';
                break;
        }
        let url: string = `${uri}/?user_id=${user_id}&location_id=${location_id}`;
        const response: any = await http.put(url, data);
        if (response && response["data"]) {
            dispatch(getAbout(user_id, circle_id, role))
            dispatch({ type: CONSTS.HIDE_LOADER })
        }
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const requestToAdd = async (user_role: string, circle_id: number | string, user_id?: string | number): Promise<any> => {
    try {
        let url = `requesttoadd/?circle_id=${circle_id}&user_id=${user_id}&role=${user_role}`;
        const res: any = await http.post(url);
        if (res && res.data) {
            return res.data;
        }
    } catch (error) {
        return {}
    }
}

export const makePost = (body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.post(`dovemedpost/`, body);
        if (response && response["data"]) {
            dispatch(updateSnackMessage('Posted successfully.'))
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);

    }
}

export const recommendDoctor = async (body: any): Promise<any> => {
    try {
        let url = `doctorrecommend/`;
        const res: any = await http.post(url, body);
        if (res && res.data) {
            return res.data;
        }
    } catch (error) {
        return {}
    }
}

export const getNotifications = (page_num: number, items: number, user_id: number | string, circle_id: number | string, sort_by: string = '-created_at') => async (dispatch: any) => {
    try {
        const response: any = await http.get(`notifications/?user_id=${user_id}&circle_id=${circle_id}&page_num=${page_num}&items=${items}&sort_by=${sort_by}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.NOTIFICATIONS, data: response["data"] })
        }
    } catch (error) {
        dispatch({ type: CONSTS.NOTIFICATIONS, data: {} })
    }
}

export const getNotificationSettings = (circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`notificationsettings/?circle_id=${circle_id}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.NOTIFICATION_SETTINGS, data: response["data"][0] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.NOTIFICATION_SETTINGS, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const updateNotificationSettings = (circle_id: number | string, body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.put(`notificationsettings/?circle_id=${circle_id}`, body);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.NOTIFICATION_SETTINGS, data: response["data"][0] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.NOTIFICATION_SETTINGS, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const updateNotification = (notification_id: number | string, body: any) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.put(`notifications/?id=${notification_id}`, body);
        if (response && response["data"]) {
            //todo
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getActivityInfo = (circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER })
    try {
        const response: any = await http.get(`activity/?circle_id=${circle_id}`);
        if (response && response["data"]) {
            dispatch({ type: CONSTS.ACTIVITY_INFO, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.ACTIVITY_INFO, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}


export const reportSpam = async (post_id: number | string, body: any) => {
    try {
        const response: any = await http.put(`dovemedpost/?id=${post_id}`, body)
        if (response) {
            return response
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getQuestionsWithSearch = (page_num: number, items: number, circle_id: string | number, key?: string, category?: string) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        let url: string = `questionsearch/?page_num=${page_num}&items=${items}&circle_id=${circle_id}&key=${key ? key : ''}`;
        if (category) {
            url += `&category=${category}`;
        }
        const response: any = await http.get(url)
        if (response && response["data"]) {
            dispatch({ type: CONSTS.QUESTIONS_LIST, data: response["data"] })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.QUESTIONS_LIST, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const postQuestion = (body: any) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        const response: any = await http.post(`askquestions/`, body)
        dispatch(updateSnackMessage('Question posted successfully'))
        dispatch(getQuestionsWithSearch(1, 1, body.user_circle))
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

export const getAllTreatments = (page_num: number, items: number, key: string = '', value: string) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        let url: string = `alltreatments/?page_num=${page_num}&items=${items}&value=${value}`;
        if (key) {
            url += `&key=${key}`;
        }
        const response: any = await http.get(url)
        if (response && response["data"]) {
            dispatch({ type: CONSTS.TREATMENTS_LIST, data: response["data"].data })
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.TREATMENTS_LIST, data: [] })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getTreatments = (type: string, circle_id: string | number, key?: string) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        let url: string = `treatmentsearch/?key=${key}&circle_id=${circle_id}&treatment_type=${type}`;
        const response: any = await http.get(url)
        if (response && response["data"]) {
            if (type === 'others') {
                dispatch({ type: CONSTS.TREATMENTS_LIST, data: response["data"].others })
            } else {
                dispatch({ type: CONSTS.TREATMENTS_LIST, data: response["data"].circle_treatments })
            }
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.TREATMENTS_LIST, data: [] })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const readNotification = (notification_id: number | string, body: any, page_num: number, items: number, user_id: number | string, circle_id: number | string) => async (dispatch: any) => {
    try {
        const res = await http.put(`notifications/?id=${notification_id}`, body)
        if (res && res.data) {
            dispatch(getNotifications(page_num, items, user_id, circle_id))
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

//NEW ADDITIONS

export const hasMultiRoles = (circle_id: number | string) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER });
    try {
        const response: any = await http.get(`hasmultirole/?circle_id=${circle_id}`);
        if (response && response["data"]) {
            //dispatch({ type: CONSTS.SELECT_ROLE, data: response["data"] })
            dispatch({ type: CONSTS.HIDE_LOADER });
            return response["data"];
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: CONSTS.HIDE_LOADER })
        //dispatch({ type: CONSTS.SELECT_ROLE, data: null })
        return [];
    }
}

export const postSelectedRole = (circle_id: number | string, roleDetails: any, callApi: true) => async (dispatch: any) => {
    dispatch({ type: CONSTS.SHOW_LOADER });
    try {
        if (callApi) {
            const response: any = await http.post(`hasmultirole/`, { circle_id: circle_id, role: roleDetails.role });
        }
        await AsyncStorage.setItem('userRole', JSON.stringify(roleDetails));
        dispatch({ type: CONSTS.SELECT_ROLE, data: roleDetails })
        dispatch({ type: CONSTS.HIDE_LOADER });
        return true;
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        dispatch({ type: CONSTS.SELECT_ROLE, data: null })
        return false;
    }
}