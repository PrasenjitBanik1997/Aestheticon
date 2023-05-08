import moment from 'moment/moment';


export const localDateTimeFormat = (date) => {
    return moment(date, "YYYY-MM-DDTHH:mm:ss").format('YYYY-MM-DD HH:mm A')
};

export const dateAndTimeFormat = (data) => {
    return moment(data).format('MM-DD-YYYY, HH:mm')
};

export const dateFormat = (data) => {
    return moment(data).format('YYYY-MM-DD')
};