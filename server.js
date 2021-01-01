const express = require('express')

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('./dist/oask-gtp-data-prep-gui'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/oask-gtp-data-prep-gui/'});
});

console.log(`Server started at port: ${port}`)
app.listen(port)