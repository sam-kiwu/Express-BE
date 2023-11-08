const {Developer, Sequelize, sequelize} = require('../database/models');

async function fetchAll(req, res){
try {
    const developers = await Developer.findAll();
    return res.status(200).send({developers})
} catch (error) {
    console.error(error);
    return res.status(500).send({error})
}
}

async function Create(req, res){
    try {
        const developer = await Developer.create(req.body);
        return res.status(201).send({developer})
    } catch (error) {
        console.error(error);
        return res.status(500).send({error})
    }
}

async function Delete(req, res){
    try {
        const developerId = req.params.id;

        const developer = await Developer.findOne({where: {id: developerId}});
        if(developer){
            await developer.destroy();
            res.send(`developer id: ${developerId} deleted successfully`);
        } else {
            res.send(`developer id: ${developerId} not found.`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({error})
    }
}

module.exports = {
    fetchAll,
    Create,
    Delete
}