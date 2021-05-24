import { http } from "../../http/http";
import CONSTS from '../../constants/consts'
import { updateSnackMessage } from "./homeScreenActions";

export const getResourcesList = (page_num: number, items: number, type: string | undefined, circle_id: number | string, item_id?: number | string, showLoader: boolean = true) => async (dispatch: any) => {
    try {
        if (showLoader) {
            dispatch({ type: CONSTS.SHOW_LOADER })
        }
        let url: string = `resources/?page_num=${page_num}&items=${items}&circle_id=${circle_id}`;
        if (type) {
            url += `&type=${type}`
        }
        if (item_id) {
            url += `&id=${item_id}`
        }
        const res: any = await http.get(url);
        if (res && res.data) {
            switch (type) {
                case 'Articles': {
                    const data: any = {
                        articles_pagination: res.pagination
                    }
                    data[type] = res.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                case 'Polls': {
                    const data: any = {
                        polls_pagination: res.pagination
                    }
                    data[type] = res.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                case 'Videos': {
                    const data: any = {
                        videos_pagination: res.pagination
                    }
                    data[type] = res.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                case 'Slideshows': {
                    const data: any = {
                        slideshows_pagination: res.pagination
                    }
                    data[type] = res.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                case 'Trivia': {
                    const data: any = {
                        trivia_pagination: res.pagination
                    }
                    data[type] = res.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                default: {
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: res.data })
                    break;
                }
            }
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.RESOURCES_DATA, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const getPollsData = (page_num: number, items: number, item_id: number | string, type: string) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        const res: any = await http.get(`polls/?id=${item_id}&page_num=${page_num}&items=${items}`);
        if (res && res.data) {
            switch (type) {
                case 'Polls': {
                    const data: any = {
                        polls_pagination: res.pagination
                    }
                    data[type] = res.data.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                case 'Trivia': {
                    const data: any = {
                        trivia_pagination: res.paginator
                    }
                    data[type] = res.data.data;
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: data })
                    break;
                }
                default: {
                    dispatch({ type: CONSTS.RESOURCES_DATA, data: {} })
                    break;
                }
            }
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.RESOURCES_DATA, data: {} })
        dispatch({ type: CONSTS.HIDE_LOADER })
    }
}

export const submitPollAnswer = (body: any, type: string) => async (dispatch: any) => {
    try {
        dispatch({ type: CONSTS.SHOW_LOADER })
        const res: any = await http.post(`poll_response/`, body);
        if (res && res.data) {
            dispatch(updateSnackMessage(`${type} submitted successfully`))
            dispatch(getPollsData(1, 1, body.poll, type))
        }
        dispatch({ type: CONSTS.HIDE_LOADER })
    } catch (error) {
        dispatch({ type: CONSTS.HIDE_LOADER })
        throw new Error(error.message);
    }
}

