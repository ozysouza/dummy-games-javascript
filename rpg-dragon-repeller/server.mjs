import express from "express"

const app = express();
const port = 3000
app.use(express.static("."));

app.listen(port, () => {
    console.info(`Server running on port http://localhost:${port}!`);
});