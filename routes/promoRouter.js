const express = require("express");
const bodyParser = require("body-parser");
const cors = require("./cors");
const mongoose = require("mongoose");
const Promos = require("../models/promotions");
var authenticate = require("../authenticate");
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promos.find({})
      .then(
        (promos) => {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT OPERATION is not allowed on /promotions");
    }
  )
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.create(req.body)
        .then(
          (promo) => {
            res.statusCode = 200;
            res.setHeader("content-type", "application/json");
            res.json(promo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.remove({})
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
  );

promoRouter
  .route("/:promoId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promos.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation not supported on /promotions/" + req.params.promoId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.findByIdAndUpdate(
        req.params.promoId,
        { $set: req.body },
        { new: true }
      )
        .then(
          (updatedPromo) => {
            res.statusCode = 200;
            res.setHeader("content-type", "application/json");
            res.json(updatedPromo);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promos.findByIdAndRemove(req.params.promoId)
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
  );
module.exports = promoRouter;
