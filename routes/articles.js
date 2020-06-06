const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Article = require("./../models/article.js");
const router = express.Router();
app.use(express.urlencoded({
  extended: false
}));

router.get("/new", (req, res) => {
  res.render("articles/new.ejs", {
    article: new Article()
  });
});

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    createdAt: "desc",
  });
  console.log(articles)
  res.render("articles/archives", {
    articles: articles,
  });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", {
    article: article
  });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug
  });
  if (article == null) res.redirect("/");
  res.render("articles/show", {
    article: article
  });
});

router.post("/", async (req, res, next) => {
  req.article = new Article();
  next();
}, saveArticleAndRedirect('new'));

router.put("/:id", async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveArticleAndRedirect('edit'));

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}.ejs`, {
        article: article
      });
    }
  }
}
module.exports = router;