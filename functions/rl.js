const version = "2.0.0";
const Ratelimits = require("../static/models/ratelimits");

module.exports = class Store {
    constructor({ reset, limit }) {
        if (isNaN(limit) || isNaN(reset)) {
            throw new Error("Limit and Reset values must be valid integers");
        }
        Object.assign(this, {
            limit: parseInt(limit),
            reset_after: parseInt(reset),
        });
    }

    async reset(id) {
        await Ratelimits.findOneAndDelete({
            discriminator: id,
        })
            .lean()
            .exec();
    }

    async canUse(id) {
        let data = await this._ensure(id);

        if (!data) {
            return true;
        }

        return data.count < this.limit;
    }

    async getData(id) {
        let data = await this._ensure(id);

        if (!data) {
            return null;
        }

        const count = data.count;
        const next_reset = data.next_reset;

        return {
            count,
            next_reset,
        };
    }

    async increment(id) {
        let data = await this._ensure(id);

        if (!data) {
            await Ratelimits.create({
                _id: require("../functions/genSnowflake.js")(),
                discriminator: id,
                count: 1,
                next_reset: Date.now() + this.reset_after,
            });

            return;
        }

        await Ratelimits.findOneAndUpdate(
            {
                discriminator: id,
            },
            {
                $set: {
                    count: data.count + 1,
                    next_reset: data.next_reset,
                },
            },
        )
            .lean()
            .exec();
    }

    async _ensure(id) {
        let data = await Ratelimits.findOne({
            discriminator: id,
        })
            .lean()
            .exec();

        if (!data || data.next_reset <= Date.now()) {
            await this.reset(id);

            return null;
        }

        return data;
    }

    static get version() {
        return version;
    }
};
