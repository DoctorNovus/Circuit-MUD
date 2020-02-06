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

class Engine {

    constructor() {
        this.stories = [];
        this.categories = [];
        this.hobbies = [];
        this.entities = [];
    }

    Story(title) {
        let story = new Story(title);
        this.stories.push(story);
        return story;
    }

    Category(title) {
        let category = new Category(title);
        this.categories.push(category);
        return category;
    }

    Hobby(title) {
        let hobby = new Hobby(title);
        this.hobbies.push(hobby);
        return hobby;
    }

    Action(name, description) {
        let action = new Action(name, description);
        return action;
    }

    Entity(attributes) {
        let entity = new Entity(attributes);
        this.entities.push(entity);
        return entity;
    }


}

class Core {
    constructor(title) {
        this.title = title;
        this.body = "";
        this.author = "";
        this.footer = "";
    }
}

class Story extends Core {
    constructor(title) {
        super(title);
    }

    editBody(body) {
        this.body = "";
        if (Array.isArray(body)) {
            this.body = body.join("\n");
        }
    }

    create(engine, category) {
        if (category) {
            if (engine.categories.find(cat => cat.title == category) != undefined) {
                this.body = "";
                let cate = engine.categories.find(cat => cat.title == category);
                for (let part of cate.parts) {
                    if (part != undefined) {
                        this.body += part.text + "\n";
                    }
                }
            }
        }

        let stri = "";
        stri += "-".repeat(61) + "\n";
        stri += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n"
        stri += "-".repeat(61) + "\n";
        stri = createBody(stri, this.body);
        stri += "-".repeat(61) + "\n";
        return stri;
    }
}

class Category extends Core {
    constructor(title) {
        super(title);
        this.parts = [];
    }

    addParts(text) {
        if (Array.isArray(text)) {
            for (let i = 0; i < text.length; i++) {
                let part = {
                    text: text[i]
                }

                this.parts.push(part);
            }

        } else {
            let part = {
                text: text
            };

            this.parts.push(part);
        }
    }

    removeParts(id) {
        if (Array.isArray(id)) {
            for (let i = 0; i < id.length; i++) {
                for (let j = 0; j < this.parts.length; j++) {
                    if (this.parts[j].id == id[i]) this.parts.splice(j, 1);
                }
            }
        } else {
            for (let i = 0; i < this.parts.length; i++) {
                if (this.parts[i].id == id) this.parts.splice(i, 1);
            }
        }
    }

    addHobbies(category) {
        if (Array.isArray(category)) {
            for (let i = 0; i < category.length; i++) {
                this.parts.push(category.title);
            }
        } else {
            this.parts.push(category.title);
        }
    }

    create(engine, category) {
        if (category) {
            if (engine.categories.find(cat => cat.title == category) != undefined) {
                this.body = "";
                let cate = engine.categories.find(cat => cat.title == category);
                for (let part of cate.parts) {
                    if (part != undefined) {
                        this.body += part.text + "\n";
                    }
                }
            }
        }

        let stri = "";
        stri += "-".repeat(61) + "\n";
        stri += "|" + " ".repeat((60 - this.title.length) / 2) + this.title + " ".repeat((60 - this.title.length) / 2) + "|\n"
        stri += "-".repeat(61) + "\n";
        stri = createBody(stri, this.body);
        stri += "-".repeat(61) + "\n";
        return stri;
    }
}

class Hobby extends Core {
    constructor(title) {
        super(title);
        this.actions = [];
    }

    addAction(action) {
        this.actions.push(action);
    }

    executeAction(name) {
        this.actions.find(action => action.name == name).execute();
    }
}

class Action {
    constructor(name, description) {
        this.name = name;
        this.description = this.description;
    }

    addLife(code) {
        this.code = code;
    }

    execute() {
        this.code;
    }
}

class Entity {
    constructor(attributes) {
        this.attributes = attributes;
    }
};

module.exports = {
    Engine: Engine
}