import { db } from "../../src/databases/databases";
import { getHash } from "../../src/utils/getHash";
import assert from "assert";
import { client } from "../utils/httpClient";

describe("getUserInfo Free Chapters", () => {
    const endpoint = "/api/userInfo";

    const newQualifyUserID = "getUserInfo-Free-newQualify";
    const vipQualifyUserID = "getUserInfo-Free-VIP";
    const repQualifyUserID = "getUserInfo-Free-RepQualify";
    const oldQualifyUserID = "getUserInfo-Free-OldQualify";
    const postOldQualify = 1600000000000;
    const isoDate = new Date().toISOString();

    before(async () => {
        const sponsorTimesQuery = 'INSERT INTO "sponsorTimes" ("videoID", "startTime", "endTime", "votes", "UUID", "userID", "timeSubmitted", views, category, "actionType", "reputation", "shadowHidden", "updatedAt") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.prepare("run", sponsorTimesQuery, ["getUserInfoFree", 1, 2, 0, "uuid-guif-0", getHash(repQualifyUserID), postOldQualify, 0, "sponsor", "skip", 20, 0, isoDate]);
        await db.prepare("run", sponsorTimesQuery, ["getUserInfoFree", 1, 2, 0, "uuid-guif-1", getHash(oldQualifyUserID), 0, 0, "sponsor", "skip", 0, 0, isoDate]); // submit at epoch
        await db.prepare("run", sponsorTimesQuery, ["getUserInfoFree", 1, 2, 0, "uuid-guif-2", getHash(newQualifyUserID), postOldQualify, 0, "sponsor", "skip", 0, 0, isoDate]);

        await db.prepare("run", `INSERT INTO "vipUsers" ("userID", "createdAt") VALUES (?, ?)`, [getHash(vipQualifyUserID), isoDate]);
    });

    const getUserInfo = (userID: string) => client.get(endpoint, { params: { userID, value: "freeChaptersAccess" } });

    it("Should get free access under new rule (newQualify)", (done) => {
        getUserInfo(newQualifyUserID)
            .then(res => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.data.freeChaptersAccess, true);
                done();
            })
            .catch(err => done(err));
    });

    it("Should get free access (VIP)", (done) => {
        getUserInfo(vipQualifyUserID)
            .then(res => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.data.freeChaptersAccess, true);
                done();
            })
            .catch(err => done(err));
    });

    it("Should get free access (rep)", (done) => {
        getUserInfo(repQualifyUserID)
            .then(res => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.data.freeChaptersAccess, true);
                done();
            })
            .catch(err => done(err));
    });

    it("Should get free access (old)", (done) => {
        getUserInfo(oldQualifyUserID)
            .then(res => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.data.freeChaptersAccess, true);
                done();
            })
            .catch(err => done(err));
    });
});
