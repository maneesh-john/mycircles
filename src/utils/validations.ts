export const validate = (value: any, type: string): boolean => {
    switch (type) {
        case 'email': {
            const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
            if (pattern.test(value)) {
                return true;
            } else {
                return false;
            }
        }
        case 'phone': {
            const pattern = /^\d{10}$/;
            if (pattern.test(value)) {
                return true;
            }
            else {
                return false;
            }
        }
        case 'password': {
            if (value.length >= 8) {
                return true;
            }
            else {
                return false;
            }
        }
        default:
            return false;
    }
}