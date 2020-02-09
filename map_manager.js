let fs = require("fs");

readAndGen(process.argv[2]);

function readAndGen(world) {
    fs.readFile("./worlds.json", null, (err, data) => {
        data = JSON.parse(data);
        data[world].map = generateMap(9, 9);
        fs.writeFile("./worlds.json", JSON.stringify(data, null, 4), (err) => {

        });
    });
}

let reso = {};

process.argv.splice(3, process.argv.length).forEach(ore => {
    reso[ore] = {
        "count": 0
    };
})

function generateMap(rows, columns) {
    let map = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let type = "sector";

            if (j == 4 && i == 0) {
                type = "exit";
            }

            row.push({
                "type": type,
                "pos": {
                    "x": j,
                    "y": i
                },
                "resources": reso
            });
        }
        map.push(row);
    }

    return map;
}

function readMap(map) {
    let mapReader = [];
    for (let row of map) {
        let rowBoat = [];
        for (let column of row) {
            rowBoat.push(column);
        };
        mapReader.push(rowBoat);
    }

    return mapReader;
}