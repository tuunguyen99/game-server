const axios = require('axios');

exports.profile = async (req, res) => {
    res.send({
        status:true,
        data:{
            userId:req.user._id
        }
    });
};

exports.updateProfile = async (req, res) => {
    const user = req.user;
    user.name=req.body.name;
    await user.save();
    res.send(user);
};

exports.updateHighScore = async (req, res) => {
    const user = req.user;
    user.highscore=req.body.highscore
    await user.save();
    res.send(user);
};

exports.linkMiraiId = async (req, res) => {
    const userId = req.user._id;
    const miraiId = req.body.miraiId;
    const clientId = process.env.CLIENT_ID;
    axios.put(`${process.env.SHARDS_API_URL}/v1/user-mirai/add-mirai`, {
        userId,
        miraiId,
        clientId
    }, {
        headers: {
            'api-key': process.env.API_KEY
        }
    }).then((response) => {
        console.log('[Link Mirai Id] Response status: ', response.status);
        res.status(200).send(response.data);
    }).catch((error) => {
        res.status(500).send(`Error: ${error}`);
    });
}
