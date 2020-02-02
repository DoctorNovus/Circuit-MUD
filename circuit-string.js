function createBody(string, body) {
    str = string;
    if (body.includes("\n")) {
        body.split("\n").forEach((part) => {

            let countD = 0;

            for (let i = 0; i < Math.ceil(part.length / 60); i++) {
                countD++;
            }

            for (let i = 0; i < Math.ceil(part.length / 60) + countD; i++) {
                let rep = 0;

                if (!(Math.floor((60 - body.substr(0, 60).length) % 2 == 0))) {
                    rep = 1;
                }

                str += "|" + " ".repeat(Math.floor((60 - part.substr(0, 60).length) / 2 - rep)) + part.substr(0, 60) + " ".repeat(Math.floor((60 - part.substr(0, 60).length) / 2 - rep)) + "|\n";
                part = part.substr(60, part.length);
            }
        });
    } else {
        console.log(body);

        let countD = 0;
        for (let i = 0; i < Math.ceil(body.length / 60); i++) {
            countD++;
        }

        for (let i = 0; i < Math.ceil(body.length / 60) + countD; i++) {
            let rep = 0;

            if (!(Math.floor((60 - body.substr(0, 60).length) / 2) % 2 == 0)) {
                rep = 1;
            }

            str += "|" + " ".repeat(Math.floor((60 - body.substr(0, 60).length) / 2)) + body.substr(0, 60) + " ".repeat(Math.floor((60 - body.substr(0, 60).length) / 2 - rep)) + "|\n";
            body = body.substr(60, body.length);
        }
    }

    return str;
};

class Story {
    constructor() {
        this.title = "";
        this.body = "";
        this.author = "";
        this.footer = "";
    }

    editTitle(title) {
        this.title = title;
    }

    editBody(body) {
        this.body = "";
        if (Array.isArray(body)) {
            this.body = body.join("\n");
        }
    }

    create() {
        let stri = "";
        stri += "-".repeat(61) + "\n";
        stri += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n"
        stri += "-".repeat(61) + "\n";
        stri = createBody(stri, this.body);
        stri += "-".repeat(61) + "\n";
        return stri;
    }
}

module.exports = {
    Story: Story
}