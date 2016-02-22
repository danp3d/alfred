"use strict";

const BaseCtrl = require('./basecontroller');
const User = require('./../models/user');

class UserCtrl extends BaseCtrl {
    registerRoutes(app) {
        let self = this;
        const checkAuth = (req, res, next) => self.isAuthenticated(req, res, next);
       
        app.get('/user', checkAuth, (req, res) => self.getAll(req, res));
        app.post('/user', checkAuth, (req, res) => self.createNew(req, res));
        app.put('/user/:id', checkAuth, (req, res) => self.update(req, res));
        app.delete('/user/:id', checkAuth, (req, res) => self.destroy(req, res));
    }
       
    getAll(req, res) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 20;
       
        User.findAndCountAll({
            "offset": offset,
            "limit": limit
        }).then(
            (results) => res.status(200).send(results),
            (err) => res.status(500).send(err)
        );
    }
    
    createNew(req, res) {
        let data = req.body;
        
        User.create(data).then(
            (result) => req.status(200).send(result),
            (err) => req.status(500).send(err)
        );
    }

    update(req, res) {
        let data = req.body;
        let id = req.params.id;
        
        User.findOne({ "id": id }).then(
            (result) => req.status(200).send(result),
            (err) => req.status(500).send(err)
        );
    }

    destroy(req, res) {
        let id = req.params.id;
        
        User.findOne({ "id": id }).then(
            (result) => {
                result.destroy().then(
                    () => req.status(200).send({ "message": 'OK' });
                    (err) => req.status(500).send(err);
                );
            },
            (err) => req.status(500).send(err)
        );
    }
}

module.exports = new UserCtrl();
