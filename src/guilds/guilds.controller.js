const Guild = require('./guilds.models');
const User = require('../users/users.models');
const axios = require('axios');

async function newGuild(payload) {
    const userOfMiraiID = await User.findOne({ _id: payload.owner.userId });
    if (userOfMiraiID == null)
        throw new Error('Guild owner does not have account in game');
    const guild = new Guild({
        guildId: payload._id,
        guildAddress: payload.address,
        name: payload.name,
        owner: payload.owner.userId,
        users: [payload.owner.userId],
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

exports.syncCreatedGuild = async (req, res) => {
    const response = await axios.get(
        `${process.env.SHARDS_API_URL}/v1/guilds/sync/${process.env.CLIENT_ID}`
    );
    const allGuilds = response.data.data;
    const savedGuilds = [];
    // Save all guilds to DB
    await Promise.all(
        allGuilds.map(async (guild) => {
            const guildId = guild.guildId;
            const isGuildExist = await Guild.findOne({ guildId });
            if (!isGuildExist) {
                const newGuild = new Guild(guild);
                console.log('Saving guild: ', newGuild);
                await newGuild.save();
                savedGuilds.push(newGuild);
            }
        })
    );
    res.status(200).send({
        savedGuilds,
        count: savedGuilds.length,
    });
}

async function changeGuildOwner(payload) {
    const guildId = payload._id;
    const guild = await Guild.findOne({ guildId });
    if (guild == null)
        throw new Error('Guild not found');

    const oldOwnerId = payload.oldOwner.userId;
    const newOwnerId = payload.newOwner.userId;

    if (guild.owner !== oldOwnerId) {
       throw new Error('Wrong owner');
    }

    guild.owner = newOwnerId;
    await guild.save();
    return true;
}

exports.webHook = async (req, res) => {
    console.log(req.body);
    switch (req.body.key) {
        case 'newGuild':
            await newGuild(JSON.parse(req.body.value));
            break;
        case 'userJoinGuild':
            await userJoinLeftGuild(JSON.parse(req.body.value), true);
            break;
        case 'userRejoinGuild':
            await userJoinLeftGuild(JSON.parse(req.body.value), true);
            break;
        case 'userLeftGuild':
        case 'userBurnSlot':
            await userJoinLeftGuild(JSON.parse(req.body.value), false);
            break;
        case 'changeOwnerGuild':
            await changeGuildOwner(JSON.parse(req.body.value));
            break;
        default:
            break;
    }
    res.send(200);
};