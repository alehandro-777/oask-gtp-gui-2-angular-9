const express = require('express')

const port = process.env.PORT || 3002;
const app = express();

app.use(express.static('./dist/e-commer-angular9'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/e-commer-angular9/'});
});

console.log(`Server started at port: ${port}`)
app.listen(port)