const Guild = require('./guilds.models');
const User = require('../users/users.models');

async function newGuild(payload) {
    const userOfMiraiID = await User.findOne({ _id: payload.user.userId });
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
    const userOfMiraiID = await User.findOne({ _id: payload.user.userId });
    if (userOfMiraiID == null)
        throw new Error('Dont have account in game');
    const guild = await Guild.findOne({ guildId: payload.guildId });
    if (guild == null)
        throw new Error('Guild not found');
    if (isJoin) {
        guild.users.push(payload.user.userId);
        userOfMiraiID.guild = guild._id;
    } else {
        guild.users.pull(payload.user.userId);
        // TODO: Add this when we have `guildId` in User collection
        // userOfMiraiID.guildId = null;
    }
    await Promise.all([guild.save(), userOfMiraiID.save()]);
}

exports.validateKickMember = async (req, res) => {
    const userId = req.query.userId;
    const guildId = req.query.guildId;

    // Check guild exist
    const guild = await Guild.findOne({ guildId });
    if (!guild) {
        res.status(200).send({
            status: false,
            error: `Given guild id not exists: ${guildId}`,
        });
        return;
        // throw new Error(`Given guild id not exists: ${guildId}`);
    }

    // Check userId in guild
    if (!guild.users.includes(userId)) {
        res.status(200).send({
            status: false,
            error: `User ${userId} does not exist in guild ${guildId}`,
        });
        return;
        // throw new Error(`User ${userId} does not exist in guild ${guildId}`);
    }

    // Check userId != GO
    if (userId === guild.owner.toString()) {
        res.status(200).send({
            status: false,
            error: `User ${userId} is the owner of guild ${guildId}, cannot kick`,
        });
        return;
        // throw new Error(`User ${userId} is the owner of guild ${guildId}, cannot kick`);
    }

    res.status(200).send({
        status: true,
        data: {
            isValidKickMember: true
        }
    });
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