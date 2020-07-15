const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Favorites = require("../models/favorite");
const FavoritesRouter = express.Router();
FavoritesRouter.use(bodyParser.json());
const cors = require("./cors");
var authenticate = require("../authenticate");
const user = require("../models/user");
FavoritesRouter.route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite != null) {
          Favorites.find({ user: req.user._id })
            .populate("user")
            .populate("dishes")
            .then(
              (Favorites) => {
                res.statusCode = 200;
                res.setHeader("content-type", "application/json");
                res.json(Favorites);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          var err = new Error("do not have a favorite list for you");
          err.status = 403;
          next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT OPERATION is not allowed on /Favoritess");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite == null) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            req.body.forEach((dishID) => {
              if (favorite.dishes.indexOf(dishID._id) < 0) {
                console.log(dishID);
                console.log(favorite.dishes.indexOf(dishID));
                favorite.dishes.push(dishID);
              }
            });
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        req.body.forEach((dishID) => {
          if (favorite.dishes.indexOf(dishID._id) < 0) {
            console.log(dishID);
            console.log(favorite.dishes.indexOf(dishID));
            favorite.dishes.push(dishID);
          }
        });
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => next(err));
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((user) => {
        if (user != null) {
          Favorites.remove({ user: req.user._id })
            .then(
              (resp) => {
                res.statusCode = 200;
                res.setHeader("content-type", "application/json");
                res.json(resp);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          var err = new Error("you are not authorised to delete favorite here");
          err.status = 403;
          next(err);
        }
      })
      .catch((err) => next(err));
  });

FavoritesRouter.route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /Favorites/" + req.params.dishId);
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Favorites/" + req.params.dishId);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite == null) {
        Favorites.create({ user: req.user._id })
          .then((favorite) => {
            favorite.dishes.push(req.params.dishId);
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        if (favorite.dishes.indexOf(req.params.dishId) < 0) {
          favorite.dishes.push(req.params.dishId);
        }
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => next(err));
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((user) => {
        if (user != null) {
          if (user.dishes != null) {
            user.dishes.forEach((dishId, index) => {
              if (req.params.dishId == dishId) {
                user.dishes.splice(index, 1);
              }
            });
            user
              .save()
              .then(
                (resp) => {
                  console.log(resp.toJSON());
                  if (resp.dishes.length != 0) {
                    res.statusCode = 200;
                    res.setHeader("content-type", "application/json");
                    res.json(resp);
                  } else {
                    Favorites.remove({ user: req.user._id })
                      .then(
                        (resp) => {
                          res.statusCode = 200;
                          res.setHeader("content-type", "application/json");
                          res.json(resp);
                        },
                        (err) => next(err)
                      )
                      .catch((err) => next(err));
                  }
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          }
        } else {
          var err = new Error("you are not authorised to delete favorite here");
          err.status = 403;
          next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = FavoritesRouter;
