export class UserService {
    userData;
    constructor(userData) {
        this.userData = userData;
    }
    getName() {
        return this.userData.NAME;
    }
}
