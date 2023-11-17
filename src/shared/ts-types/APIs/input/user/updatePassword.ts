export interface UpdatePasswordBody {
    updateInfo: {
        password: string;
        repeatedPassword: string;
    };
}

export interface UpdatePasswordInput extends UpdatePasswordBody {
    userId: string;
}
