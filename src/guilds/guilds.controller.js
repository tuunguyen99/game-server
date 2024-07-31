const Guild = require('./guilds.models');
const User = require('../users/users.models');

async function newGuild(payload) {
    const userOfMiraiID = await User.findOne({ miraiId: payload.user.userId });
    if (userOfMiraiID == null)
        throw new Error('Dont have account in game');
    const guild = new Guild({
        guildId: payload._id,
        guildAddress: payload.address,
        name: req.body.name,
        owner: payload.user.userId,
        users: [payload.user.userId]
    });
    userOfMiraiID.guild = guild._id;
    await Promise.all([guild.save(), userOfMiraiID.save()]);
}

async function userJoinLeftGuild(payload, isJoin) {
    const userOfMiraiID = await User.findOne({ miraiId: payload.user.userId });
    if (userOfMiraiID == null)
        throw new Error('Dont have account in game');
    const guild = await Guild.findOne({ guildId: payload.guildId });
    if (guild == null)
        throw new Error('Guild not found');
    if (isJoin)
        guild.users.push(payload.user.userId);
    else
        guild.users.pull(payload.user.userId);
    userOfMiraiID.guild = guild._id;
    await Promise.all([guild.save(), userOfMiraiID.save()]);
}

exports.webHook = async (req, res) => {
    console.log(req.body);
    switch (req.body.key) {
        case 'newGuild':
            await newGuild(JSON.parse(req.body.value));
            break;
        case 'userJoinGuild':
        case 'userRejoinGuild':
            await userJoinLeftGuild(JSON.parse(req.body.value), true);
            break;
        case 'userLeftGuild':
        case 'userBurnSlot':
            await userJoinLeftGuild(JSON.parse(req.body.value), false);
            break;
        default:
            break;
    }
    res.send(200);
};