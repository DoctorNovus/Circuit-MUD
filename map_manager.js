let fs = require("fs");

fs.readFile("./worlds.json", null, (err, data) => {
    data = JSON.parse(data);
    data["High-Tech Haven"].map = generateMap(9, 9);
    fs.writeFile("./worlds.json", JSON.stringify(data, null, 4), (err) => {

    });
});


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
                "resources": 0
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