"use strict";

const BaseCtrl = require('./basecontroller');
const {{modelName}} = require('./../models/{{name}}');

class {{ctrlName}} extends BaseCtrl {
    registerRoutes(app) {
        let self = this;
        const checkAuth = (req, res, next) => self.isAuthenticated(req, res, next);
       
        app.get('/{{name}}', checkAuth, (req, res) => self.getAll(req, res));
        app.post('/{{name}}', checkAuth, (req, res) => self.createNew(req, res));
        app.put('/{{name}}/:id', checkAuth, (req, res) => self.update(req, res));
        app.delete('/{{name}}/:id', checkAuth, (req, res) => self.destroy(req, res));
    }
       
    getAll(req, res) {
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 20;
       
        {{modelName}}.findAndCountAll({
            "offset": offset,
            "limit": limit
        }).then(
            (results) => res.status(200).send(results),
            (err) => res.status(500).send(err)
        );
    }
    
    createNew(req, res) {
        let data = req.body;
        
        {{modelName}}.create(data).then(
            (result) => req.status(200).send(result),
            (err) => req.status(500).send(err)
        );
    }

    update(req, res) {
        let data = req.body;
        let id = req.params.id;
        
        {{modelName}}.findOne({ "id": id }).then(
            (result) => req.status(200).send(result),
            (err) => req.status(500).send(err)
        );
    }

    destroy(req, res) {
        let id = req.params.id;
        
        {{modelName}}.findOne({ "id": id }).then(
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

module.exports = new {{ctrlName}}();
