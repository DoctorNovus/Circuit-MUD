const fs = require("fs");

fs.writeFile("./admins.json", JSON.stringify({
    "admins": []
}, null, 4), (err) => {
    if (err) throw err;
})

fs.writeFile("./database.json", JSON.stringify({
    "users": []
}, null, 4), (err) => {
    if (err) throw err;
});