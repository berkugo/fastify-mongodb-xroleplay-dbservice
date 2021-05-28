const userModel = require('../models/users');

const router = async (fastify, options, done) => {

  fastify.post("/create", options, async (req, reply) => {
    const alreadyExist = await userModel.exists({ userName: req.body.userName })
    if (req.body.userName && req.body.userPass && req.body.characterName && !alreadyExist) {

      const instance = new userModel({
        userName: req.body.userName, userPassword: req.body.userPass,
        characterName: req.body.characterName
      })
      instance.save()
      return reply.send({ result: true })

    } else {

      return reply.code(404).send({ result: { message: "Already created or required params are lack of." } })
    }

  })
  fastify.get('/getall', options, async (req, res) => {
    const data = await userModel.find().exec();
    return res.code(200).send(data);
  });
  fastify.post("/match", options, async (req, res) => {

    const playerExist = await userModel.exists({ userName: req.body.userName })
    if (playerExist && req.body.userName && req.body.userPass) {
      const playerData = await userModel.findOne({ userName: req.body.userName, userPassword: req.body.userPass }).exec()
      return res.code(200).send(playerData)
    }
    else {
      return res.code(404).send({ result: { message: "Error." } })
    }

  })

  fastify.post("/filter", options, async (req, res) => {

    const playerExist = await userModel.exists((JSON.parse(JSON.stringify(req.body))));
    if (playerExist) {
      const playerData = await userModel.find((JSON.parse(JSON.stringify(req.body)))).exec()
      return res.code(200).send(playerData)
    }
    else {
      return res.code(404).send({ result: { message: "Error." } })
    }

  })

  fastify.post("/update", options, async (req, res) => {
    if (req.body.xid || parseInt(req.body.xid) > -1) {
      const playerExist = await userModel.exists({ xid: req.body.xid })
      if (playerExist) {
        const data = await userModel.findOneAndUpdate({ xid: req.body.xid }, req.body.data, {
          new: true,
        });
        return res.code(200).send(data)
      } else {
        return res.code(404).send({ result: { message: "Error." } })
      }
    } else {
      const playerExist = await userModel.exists({ _id: req.body.uuid })
      if (playerExist) {
        const data = await userModel.findOneAndUpdate({ _id: req.body.uuid }, req.body.data, {
          new: true,
        });
        return res.code(200).send(data)
      }
      else {
        return res.code(404).send({ result: { message: "Error." } })
      }
    }
  })

  done()
}
module.exports = router
