import fs from "fs";

export class Load {
    file(path) {
        return fs.readFileSync(path);
    };

    json(path) {
        return (JSON.parse(fs.readFileSync(path)));
    };
}