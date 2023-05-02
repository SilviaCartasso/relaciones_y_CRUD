const {validationResult} = require('express-validator');
const {Movie, Genre, Actor, Sequelize} = require('../database/models');
const {Op} = Sequelize;

const actorsController = {
    'list': (req, res) => {
        Actor.findAll({
            include: [{association: "movies"}]
        })
            .then(actors => {
                //res.send(movies);
                res.render('actorsList.ejs', {actors})
            })
    },
    'detail': (req, res) => {
        const ACTOR_PROMISE = Actor.findByPk(req.params.id, {
            include: [{association: "movies"}]
        });
        const MOVIES_PROMISE = Movie.findAll();
        
    Promise.all([ACTOR_PROMISE, MOVIES_PROMISE])
            .then(([actor, allmovies]) => {
                res.render('actorDetail.ejs', {actor, allmovies});
            })
    },
        'add': function (req, res) {
        Movie.findAll()
        .then(movies => {
            return res.render('actorsAdd', {movies});
        })
        .catch(error => console.log(error));

    },
    'create': function (req, res) {
        const errors = validationResult(req);

        if(errors.isEmpty()) {
            Actor.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                rating: req.body.rating,
                favorite_movie_id: req.body.favorite_movie_id,
              })
              .then((actor) => {
                res.redirect('/actors')
    })
              .catch((error) => console.log(error))

        } else {
            Movie.findAll()
            .then(movies => {
                return res.render('actorsAdd', {movies, errors: errors.mapped()} );
            })
            .catch(error => console.log(error));
            }

    },
    edit: function(req, res) {
        const ACTOR_ID = req.params.id;

        const ACTOR_PROMISE = Actor.findByPk(ACTOR_ID);
        const MOVIES_PROMISE = Movie.findAll();

        Promise.all([ACTOR_PROMISE, MOVIES_PROMISE])

        .then(([actor, movies]) => {
            return res.render("actorsEdit", {actor, movies}) 
        })
        .catch(error => console.log(error));
        
    },
    update: function (req,res) {
        const errors = validationResult(req);
        const ACTOR_ID = req.params.id;

        if(errors.isEmpty()){
                               
            Actor.update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                rating: req.body.rating,
                favorite_movie_id: req.body.favorite_movie_id,
            },
            { where : {id: ACTOR_ID}}
            )
            .then((response) => {
                if (response) {
                    return res.redirect (`/actors/detail/${ACTOR_ID}`)
                    } else {
                        throw new Error()
                    }
            })
            .catch(error=> {
                return console.log(error)})
    } else{
        Actor.findByPk(ACTOR_ID)
        .then(actor => {
            return res.render("actorsEdit", {
                actor,
                errors: errors.mapped()}) 
        })
        .catch((error) => console.log(error))
        }
    },

    delete: function (req, res) {
        const ACTOR_ID = req.params.id;

        Actor.findByPk(ACTOR_ID)
        .then(actor => res.render("actorsDelete", {actor}))
        .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        const ACTOR_ID = req.params.id;

        Actor.destroy({
            where: {id: ACTOR_ID}
        })
        .then(() => {
            return res.redirect("/actors")
        })
        .catch((error) => console.log(error))

    }

}

module.exports = actorsController;