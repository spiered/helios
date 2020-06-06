if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles.js");
const methodOverride = require("method-override");
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected bro"));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views/articles"));

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  res.render(`${__dirname}/views/articles/main.ejs`, {
    articles: articles,
  });
});

app.use("/articles", articleRouter);

app.listen(process.env.PORT || 5000);