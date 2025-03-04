export class userService {
    Name;
    constructor(name) {
        this.Name = name;
    }
    GetName() {
        return this.Name;
    }
}
