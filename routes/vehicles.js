const vehicleModel = require("../models/vehicles")


const router = (fastify, options, done) => {

    fastify.post("/create", options, (req, res) => {
        if (req.body.modelHash && req.body.ownerId && req.body.position && req.body.colorData) {
            const { modelHash, ownerId, position, colorData } = req.body
            const instance = new vehicleModel({
                modelHash: modelHash, ownerId: ownerId,
                position: position, primaryColor: colorData.primaryColor, secondaryColor: colorData.secondaryColor
            })
            return instance.save().then(data => {
                res.send({ result: data})
            })

        } else {

            return res.code(404).send({ result: { message: "Already created or required params are lack of." } })
        }

    })
    fastify.get("/get/:type", options, async (req, res) => {
        if(req.params.type === 'all') {
           const result = await vehicleModel.find()
           return res.code(200).send(result)
        } else return res.code(400).send(false)
    })
    fastify.post("/update", options, async (req, res) => {
        const vehicleExist = await vehicleModel.exists({ _id: req.body.data._id })
        if (vehicleExist) {
            const updatedData = {
                "modelHash": req.body.data.modelHash,
                "ownerId": req.body.data.ownerId,
                "position": req.body.data.position,
                "primaryColor": req.body.data.colorData.primaryColor,
                "secondaryColor": req.body.data.colorData.secondaryColor,
            }
            const data = await vehicleModel.findOneAndUpdate({ _id: req.body.data._id }, updatedData, {
                new: true,
            });
            return res.code(200).send(JSON.parse(JSON.stringify(data)))
        }
        else {
            return res.code(404).send({ result: { message: "Error." } })
        }

    })

    done();
}
module.exports = router
