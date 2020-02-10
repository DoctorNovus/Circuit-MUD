import bcrypt from "bcrypt";

export class Password {
    encrypt(pass) {
        let saltRounds = 7;

        return bcrypt.hashSync(pass, saltRounds);
    }

    compare(pass, dbPass) {
        return bcrypt.compareSync(pass, dbPass);
    }
}