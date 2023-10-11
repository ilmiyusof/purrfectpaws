
export const validateEmailPattern = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}

export const validatePasswordPattern = (pass: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?$])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(pass);
}

export const validateNamePattern = (name: string) => {
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    return nameRegex.test(name);
}

export const validateConfirmPassword = (pass1: string, pass2:string) => {
    if(pass1 === pass2) {
        return true;
    } else {
        return false;
    }
}

