const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);

//REQUESTS TARGETING ALL ARTICLES

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, articles) {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully added a new article.");
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });

// END REQUESTS TARGETING ALL ARTICLES

//REQUESTS TARGETING A SPECIFIC ARTICLE

app.route("/articles/:title")
  .get(function(req, res) {
    const articleTitle = req.params.title;

    Article.findOne({
      title: articleTitle
    }, function(err, article) {
      if (err) {
        res.send(err);
      } else if (!article) {
        res.send("The requested article cannot be found");
      } else {
        res.send(article);
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.title
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated the requested article.");
        }
      }
    )
  })

  .patch(function(req, res) {
    Article.update({
        title: req.params.title
      }, {
        $set: req.body
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("Successfully updated article.");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.title
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Article successfully deleted.");
      }
    });
  });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started successfully.");
});
