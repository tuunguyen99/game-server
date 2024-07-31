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