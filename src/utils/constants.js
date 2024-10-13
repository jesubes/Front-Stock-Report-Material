const SERVER_IP = process.env.REACT_APP_BASE_PATH;


export const ENV = {
    BASE_API: `${SERVER_IP}/api`,
    API_ROUTES: {
        QR_GENERATE:'qrcode',
        REPORTS:'report',
        EXCEL:'excel',
        EXCEL_TO_JSON:'excel/json',
        CONTACT_JSON:'excel/contact'
    }
}