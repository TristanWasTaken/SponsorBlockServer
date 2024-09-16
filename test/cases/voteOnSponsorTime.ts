import { config } from "../../src/config";
import { db, privateDB } from "../../src/databases/databases";
import { getHash } from "../../src/utils/getHash";
import { ImportMock } from "ts-mock-imports";
import * as YouTubeAPIModule from "../../src/utils/youtubeApi";
import { YouTubeApiMock } from "../mocks/youtubeMock";
import assert from "assert";
import { client } from "../utils/httpClient";
import { arrayDeepEquals } from "../utils/partialDeepEquals";

const mockManager = ImportMock.mockStaticClass(YouTubeAPIModule, "YouTubeAPI");
const sinonStub = mockManager.mock("listVideos");
sinonStub.callsFake(YouTubeApiMock.listVideos);
const vipUser = "VIPUser";
const randomID2 = "randomID2";
const randomID2Hashed = getHash(randomID2);
const categoryChangeUser = "category-change-user";
const outroSubmitter = "outro-submitter";
const badIntroSubmitter = "bad-intro-submitter";
const hiddenInteractionSubmitter = "hidden-interaction-submitter";
const isoDate = new Date().toISOString();

describe("voteOnSponsorTime", () => {
    before(async () => {
        const now = Date.now();
        const warnVip01Hash = getHash("warn-vip01");
        const warnUser01Hash = getHash("warn-voteuser01");
        const warnUser02Hash = getHash("warn-voteuser02");
        const categoryChangeUserHash = getHash(categoryChangeUser);
        const MILLISECONDS_IN_HOUR = 3600000;
        const warningExpireTime = MILLISECONDS_IN_HOUR * config.hoursAfterWarningExpires;
        const isoDate = new Date().toISOString();

        const insertSponsorTimeQuery = 'INSERT INTO "sponsorTimes" ("videoID", "startTime", "endTime", "votes", "locked", "UUID", "userID", "timeSubmitted", "views", "category", "actionType", "shadowHidden", "hidden", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest", 1, 11, 2, 0, "vote-uuid-0", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest2", 1, 11, 2, 0, "vote-uuid-1", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest2", 1, 11, 10, 0, "vote-uuid-1.5", "testman", 0, 50, "outro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest2", 1, 11, 10, 0, "vote-uuid-1.6", "testman", 0, 50, "interaction", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest3", 20, 33, 10, 0, "vote-uuid-2", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest,test", 1, 11, 100, 0, "vote-uuid-3", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-test3", 1, 11, 2, 0, "vote-uuid-4", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-test3", 7, 22, -3, 0, "vote-uuid-5", "testman", 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-multiple", 1, 11, 2, 0, "vote-uuid-6", "testman", 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-multiple", 20, 33, 2, 0, "vote-uuid-7", "testman", 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["voter-submitter", 1, 11, 2, 0, "vote-uuid-8", getHash("randomID"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["voter-submitter2", 1, 11, 2, 0, "vote-uuid-9", randomID2Hashed, 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["voter-submitter2", 1, 11, 2, 0, "vote-uuid-10", getHash("randomID3"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["voter-submitter2", 1, 11, 2, 0, "vote-uuid-11", getHash("randomID4"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["own-submission-video", 1, 11, 500, 0, "own-submission-uuid", getHash("own-submission-id"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["not-own-submission-video", 1, 11, 500, 0, "not-own-submission-uuid", getHash("somebody-else-id"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["incorrect-category", 1, 11, 500, 0, "incorrect-category", getHash("somebody-else-id"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["incorrect-category-change", 1, 11, 500, 0, "incorrect-category-change", getHash("somebody-else-id"), 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-testtesttest", 1, 11, 2, 0, "warnvote-uuid-0", "testman", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["no-sponsor-segments-video", 1, 11, 2, 0, "no-sponsor-segments-uuid-0", "no-sponsor-segments", 0, 50, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["no-sponsor-segments-video", 1, 11, 2, 0, "no-sponsor-segments-uuid-1", "no-sponsor-segments", 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["no-sponsor-segments-video", 1, 11, 2, 0, "no-sponsor-segments-uuid-2", "no-sponsor-segments", 0, 50, "sponsor", "mute", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["segment-locking-video", 1, 11, 2, 0, "segment-locking-uuid-1", "segment-locking-user", 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["segment-hidden-video", 1, 11, 2, 0, "segment-hidden-uuid-1", "segment-hidden-user", 0, 50, "intro", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 7, 22, 0, 0, "category-change-uuid-1", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 8, 22, 0, 1, "category-change-uuid-2", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 9, 22, 0, 0, "category-change-uuid-3", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 7, 12, 0, 1, "category-change-uuid-4", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 7, 13, 0, 0, "category-change-uuid-5", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 8, 12, 0, 1, "category-change-uuid-6", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 9, 14, 0, 0, "category-change-uuid-7", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-1", 7, 12, 0, 1, "category-change-uuid-8", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-2", 7, 14, 0, 0, "category-warnvote-uuid-0", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["category-change-test-2", 8, 13, 0, 0, "category-banvote-uuid-0", categoryChangeUserHash, 0, 50, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["duration-update", 1, 10, 0, 0, "duration-update-uuid-1", "testman", 0, 0, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["full-video", 1, 10, 0, 0, "full-video-uuid-1", "testman", 0, 0, "sponsor", "full", 0, 0, isoDate]);
        // videoDuration change
        await db.prepare("run", insertSponsorTimeQuery, ["duration-changed", 1, 10, 0, 0, "duration-changed-uuid-1", "testman", 1, 0, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["duration-changed", 1, 11, 0, 0, "duration-changed-uuid-2", "testman", 10, 0, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["duration-changed", 1, 12, 0, 0, "duration-changed-uuid-3", "testman", 20, 0, "sponsor", "skip", 0, 0, isoDate]);
        // add videoDuration to duration-changed-uuid-2
        await db.prepare("run", `UPDATE "sponsorTimes" SET "videoDuration" = 150, "updatedAt" = ? WHERE "UUID" = 'duration-changed-uuid-2'`, [new Date().toISOString()]);
        await db.prepare("run", insertSponsorTimeQuery, ["chapter-video", 1, 10, 0, 0, "chapter-uuid-1", "testman", 0, 0, "chapter", "chapter", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["chapter-video", 1, 10, 0, 0, "non-chapter-uuid-2", "testman", 0, 0, "sponsor", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["chapter-video", 11, 20, 0, 0, "chapter-uuid-2", randomID2Hashed, 0, 0, "chapter", "chapter", 0, 0, isoDate]);
        // segments for testing stricter voting requirements
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "good-outro-submission", getHash(outroSubmitter), 0, 0, "outro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, -2, 0, "bad-intro-submission", getHash(badIntroSubmitter), 0, 0, "intro", "skip", 0, 0, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "hidden-interaction-submission", getHash(hiddenInteractionSubmitter), 0, 0, "interaction", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "testing-outro-skip-1", "testman", 0, 0, "outro", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 22, 25, 0, 0, "testing-outro-skip-2", "testman", 0, 0, "outro", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "testing-outro-mute-1", "testman", 0, 0, "outro", "mute", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 22, 25, 0, 0, "testing-outro-mute-2", "testman", 0, 0, "outro", "mute", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "testing-intro-skip-1", "testman", 0, 0, "intro", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 22, 25, 0, 0, "testing-intro-skip-2", "testman", 0, 0, "intro", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 1, 10, 0, 0, "testing-interaction-skip-1", "testman", 0, 0, "interaction", "skip", 0, 1, isoDate]);
        await db.prepare("run", insertSponsorTimeQuery, ["vote-requirements-video", 22, 25, 0, 0, "testing-interaction-skip-2", "testman", 0, 0, "interaction", "skip", 0, 1, isoDate]);

        const insertWarningQuery = 'INSERT INTO "warnings" ("userID", "issueTime", "issuerUserID", "enabled") VALUES(?, ?, ?, ?)';
        await db.prepare("run", insertWarningQuery, [warnUser01Hash, now, warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser01Hash, (now - 1000), warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser01Hash, (now - 2000), warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser01Hash, (now - 3601000), warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser02Hash, now, warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser02Hash, (now - (warningExpireTime + 1000)), warnVip01Hash,  1]);
        await db.prepare("run", insertWarningQuery, [warnUser02Hash, (now - (warningExpireTime + 2000)), warnVip01Hash,  1]);


        await db.prepare("run", 'INSERT INTO "vipUsers" ("userID", "createdAt") VALUES (?, ?)', [getHash(vipUser), isoDate]);
        await db.prepare("run", 'INSERT INTO "shadowBannedUsers" ("userID") VALUES (?)', [getHash("randomID4")]);

        const insertlockCategoriesQuery = 'INSERT INTO "lockCategories" ("videoID", "userID", "category", "actionType") VALUES (?, ?, ?, ?)';
        await db.prepare("run", insertlockCategoriesQuery, ["no-sponsor-segments-video", "someUser", "sponsor", "skip"]);
        await db.prepare("run", insertlockCategoriesQuery, ["category-change-test-1", "someUser", "preview", "skip"]); // sponsor should stay unlocked
    });
    // constants
    const endpoint = "/api/voteOnSponsorTime";
    const postVote = (userID: string, UUID: string, type: number) => client({
        method: "POST",
        url: endpoint,
        params: {
            userID,
            UUID,
            type
        }
    });
    const postVoteCategory = (userID: string, UUID: string, category: string) => client({
        method: "POST",
        url: endpoint,
        params: {
            userID,
            UUID,
            category
        }
    });

    const getSegmentVotes = (UUID: string) => db.prepare("get", `SELECT "votes" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
    const getSegmentCategory = (UUID: string) => db.prepare("get", `SELECT "category" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
    const getPrivateVoteInfo = (UUID: string) => privateDB.prepare("all", `SELECT * FROM "votes" WHERE "UUID" = ?`, [UUID]);

    it("Should be able to upvote a segment", (done) => {
        const UUID = "vote-uuid-0";
        postVote("randomID", UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 3);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to downvote a segment", (done) => {
        const UUID = "vote-uuid-2";
        postVote(randomID2, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.ok(row.votes < 10);
                const voteInfo = await getPrivateVoteInfo(UUID);
                assert.strictEqual(voteInfo.length, 1);
                assert.strictEqual(voteInfo[0].normalUserID, randomID2Hashed);
                assert.strictEqual(voteInfo[0].type, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to downvote the same segment when voting from a different user on the same IP", (done) => {
        const UUID = "vote-uuid-2";
        postVote("randomID3", UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 9);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to downvote a segment if the user is shadow banned", (done) => {
        const UUID = "vote-uuid-1.6";
        postVote("randomID4", UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 10);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to upvote a segment if the user hasn't submitted yet", (done) => {
        const UUID = "vote-uuid-1";
        postVote("hasNotSubmittedID", UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 2);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to downvote a segment if the user hasn't submitted yet", (done) => {
        const UUID = "vote-uuid-1.5";
        postVote("hasNotSubmittedID", UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 10);
                done();
            })
            .catch(err => done(err));
    });

    it("VIP should be able to completely downvote a segment", (done) => {
        const UUID = "vote-uuid-3";
        postVote(vipUser, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.ok(row.votes <= -2);
                done();
            })
            .catch(err => done(err));
    });

    it("should be able to completely downvote your own segment (segment unlocked)", (done) => {
        const UUID = "own-submission-uuid";
        postVote("own-submission-id", UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.ok(row.votes <= -2);
                done();
            })
            .catch(err => done(err));
    });

    it("should not be able to completely downvote somebody elses segment", (done) => {
        const UUID = "not-own-submission-uuid";
        postVote(randomID2, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 499);
                done();
            })
            .catch(err => done(err));
    });

    it("should be able to completely downvote chapter using malicious", (done) => {
        const UUID = "chapter-uuid-1";
        postVote(randomID2, UUID, 30)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, -2);
                done();
            })
            .catch(err => done(err));
    });

    it("should not be able to completely downvote non-chapter using malicious", (done) => {
        const UUID = "non-chapter-uuid-2";
        postVote(randomID2, UUID, 30)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to vote for a category and it should add your vote to the database", (done) => {
        const UUID = "vote-uuid-4";
        postVoteCategory(randomID2, UUID, "intro")
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                const categoryRows = await db.prepare("all", `SELECT votes, category FROM "categoryVotes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(row.category, "sponsor");
                assert.strictEqual(categoryRows.length, 2);
                assert.strictEqual(categoryRows[0].votes, 1);
                assert.strictEqual(categoryRows[0].category, "intro");
                assert.strictEqual(categoryRows[1].votes, 1);
                assert.strictEqual(categoryRows[1].category, "sponsor");
                done();
            })
            .catch(err => done(err));
    });

    it("Should not able to change to an invalid category", (done) => {
        const UUID = "incorrect-category";
        postVoteCategory(randomID2, UUID, "fakecategory")
            .then(async res => {
                assert.strictEqual(res.status, 400);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "sponsor");
                done();
            })
            .catch(err => done(err));
    });

    it("Should not able to change to highlight category", (done) => {
        const UUID = "incorrect-category";
        postVoteCategory(randomID2, UUID, "highlight")
            .then(async res => {
                assert.strictEqual(res.status, 400);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "sponsor");
                done();
            })
            .catch(err => done(err));
    });

    it("Should not able to change to chapter category", (done) => {
        const UUID = "incorrect-category";
        postVoteCategory(randomID2, UUID, "chapter")
            .then(async res => {
                assert.strictEqual(res.status, 400);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "sponsor");
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to change your vote for a category and it should add your vote to the database(segment unlocked, nextCatgeory unlocked)", (done) => {
        const UUID = "vote-uuid-4";
        postVoteCategory(randomID2, UUID, "outro")
            .then(async res => {
                assert.strictEqual(res.status, 200, "Status code should be 200");
                const submissionRow = await getSegmentCategory(UUID);
                const categoryRows = await db.prepare("all", `SELECT votes, category FROM "categoryVotes" WHERE "UUID" = ?`, [UUID]);
                let introVotes = 0;
                let outroVotes = 0;
                let sponsorVotes = 0;
                for (const row of categoryRows) {
                    if (row?.category === "intro") introVotes += row?.votes;
                    if (row?.category === "outro") outroVotes += row?.votes;
                    if (row?.category === "sponsor") sponsorVotes += row?.votes;
                }
                assert.strictEqual(submissionRow.category, "sponsor");
                assert.strictEqual(categoryRows.length, 3);
                assert.strictEqual(introVotes, 0);
                assert.strictEqual(outroVotes, 1);
                assert.strictEqual(sponsorVotes, 1);
                done();
            })
            .catch(err => done(err));
    });


    it("Should not be able to change your vote to an invalid category", (done) => {
        const UUID = "incorrect-category-change";
        const vote = (inputCat: string, assertCat: string, callback: Mocha.Done) => {
            postVoteCategory(randomID2, UUID, inputCat)
                .then(async () => {
                    const row = await getSegmentCategory(UUID);
                    assert.strictEqual(row.category, assertCat);
                    callback();
                })
                .catch(err => done(err));
        };
        vote("sponsor", "sponsor", () => {
            vote("fakeCategory", "sponsor", done);
        });
    });

    it("Submitter should be able to vote for a category and it should immediately change (segment unlocked, nextCatgeory unlocked, notVip)", (done) => {
        const userID = categoryChangeUser;
        const UUID = "category-change-uuid-1";
        const category = "sponsor";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, category);
                done();
            })
            .catch(err => done(err));
    });

    it("Submitter's vote on the category should not work (segment locked, nextCatgeory unlocked, notVip)", (done) => {
        const userID = categoryChangeUser;
        const UUID = "category-change-uuid-2";
        const category = "sponsor";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "intro");
                done();
            })
            .catch(err => done(err));
    });

    it("Submitter's vote on the category should not work (segment unlocked, nextCatgeory locked, notVip)", (done) => {
        const userID = categoryChangeUser;
        const UUID = "category-change-uuid-3";
        const category = "preview";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "intro");
                done();
            })
            .catch(err => done(err));
    });

    it("Submitter's vote on the category should not work (segment locked, nextCatgeory locked, notVip)", (done) => {
        const userID = categoryChangeUser;
        const UUID = "category-change-uuid-4";
        const category = "preview";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "intro");
                done();
            })
            .catch(err => done(err));
    });

    it("Vip should be able to vote for a category and it should immediately change (segment unlocked, nextCatgeory unlocked, Vip)", (done) => {
        const userID = vipUser;
        const UUID = "category-change-uuid-5";
        const category = "sponsor";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, category);
                done();
            })
            .catch(err => done(err));
    });

    it("Vip should be able to vote for a category and it should immediately change (segment locked, nextCatgeory unlocked, Vip)", (done) => {
        const userID = vipUser;
        const UUID = "category-change-uuid-6";
        const category = "sponsor";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, category);
                done();
            })
            .catch(err => done(err));
    });

    it("Vip should be able to vote for a category and it should immediately change (segment unlocked, nextCatgeory locked, Vip)", (done) => {
        const userID = vipUser;
        const UUID = "category-change-uuid-7";
        const category = "preview";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, category);
                done();
            })
            .catch(err => done(err));
    });

    it("Vip should be able to vote for a category and it should immediately change (segment locked, nextCatgeory locked, Vip)", (done) => {
        const userID = vipUser;
        const UUID = "category-change-uuid-8";
        const category = "preview";
        postVoteCategory(userID, UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, category);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to vote for a category of a segment (Too many warning)", (done) => {
        const UUID = "category-warnvote-uuid-0";
        const category = "preview";
        postVoteCategory("warn-voteuser01", UUID, category)
            .then(res => {
                assert.strictEqual(res.status, 403);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to vote for a category as a shadowbanned user, but it shouldn't add your vote to the database", (done) => {
        const UUID = "category-banvote-uuid-0";
        const category = "preview";
        postVoteCategory("randomID4", UUID, category)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                const categoryRows = await db.prepare("all", `SELECT votes, category FROM "categoryVotes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(row.category, "intro");
                assert.strictEqual(categoryRows.length, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to category-vote on an invalid UUID submission", (done) => {
        const UUID = "invalid-uuid";
        postVoteCategory("randomID3", UUID, "intro")
            .then(res => {
                assert.strictEqual(res.status, 404);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to category-vote on a full video segment", (done) => {
        const UUID = "full-video-uuid-1";
        postVoteCategory("randomID3", UUID, "selfpromo")
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it('Non-VIP should not be able to upvote "dead" submission', (done) => {
        const UUID = "vote-uuid-5";
        postVote(randomID2, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 403);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, -3);
                done();
            })
            .catch(err => done(err));
    });

    it('Non-VIP should not be able to downvote "dead" submission', (done) => {
        const UUID = "vote-uuid-5";
        postVote(randomID2, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, -3);
                done();
            })
            .catch(err => done(err));
    });

    it('VIP should be able to upvote "dead" submission', (done) => {
        const UUID = "vote-uuid-5";
        postVote(vipUser, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.ok(row.votes > -3);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to upvote a segment (Too many warning)", (done) => {
        const UUID = "warnvote-uuid-0";
        postVote("warn-voteuser01", UUID, 1)
            .then(res => {
                assert.strictEqual(res.status, 403);
                done();
            })
            .catch(err => done(err));
    });

    it("Non-VIP should not be able to downvote on a segment with no-segments category", (done) => {
        const UUID = "no-sponsor-segments-uuid-0";
        postVote("randomID", UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 2);
                done();
            })
            .catch(err => done(err));
    });

    it("Non-VIP should be able to upvote on a segment with no-segments category", (done) => {
        const UUID = "no-sponsor-segments-uuid-0";
        postVote("randomID", UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 3);
                done();
            })
            .catch(err => done(err));
    });

    it("Non-VIP should not be able to category vote on a segment with no-segments category", (done) => {
        const UUID = "no-sponsor-segments-uuid-0";
        postVoteCategory("randomID", UUID, "outro")
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentCategory(UUID);
                assert.strictEqual(row.category, "sponsor");
                done();
            })
            .catch(err => done(err));
    });

    it("VIP upvote should lock segment", (done) => {
        const UUID = "segment-locking-uuid-1";
        postVote(vipUser, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await db.prepare("get", `SELECT "locked" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(row.locked, 1);
                done();
            })
            .catch(err => done(err));
    });

    it("VIP downvote should unlock segment", (done) => {
        const UUID = "segment-locking-uuid-1";
        postVote(vipUser, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await db.prepare("get", `SELECT "locked" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(row.locked, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("VIP upvote should unhide segment", (done) => {
        const UUID = "segment-hidden-uuid-1";
        postVote(vipUser, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await db.prepare("get", `SELECT "hidden" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(row.hidden, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to undo-vote a segment", (done) => {
        const UUID = "vote-uuid-2";
        postVote(randomID2, UUID, 20)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 10);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to vote with type 10", (done) => {
        const UUID = "segment-locking-uuid-1";
        postVote(vipUser, UUID, 10)
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to vote with type 11", (done) => {
        const UUID = "segment-locking-uuid-1";
        postVote(vipUser, UUID, 11)
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to update stored videoDuration with VIP upvote", (done) => {
        const UUID = "duration-update-uuid-1";
        postVote(vipUser, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const { videoDuration } = await db.prepare("get", `SELECT "videoDuration" FROM "sponsorTimes" WHERE "UUID" = ?`, [UUID]);
                assert.strictEqual(videoDuration, 500);
                done();
            });
    });

    it("Should hide changed submission on any downvote", (done) => {
        const UUID = "duration-changed-uuid-3";
        const videoID = "duration-changed";
        postVote(randomID2, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const hiddenSegments = await db.prepare("all", `SELECT "UUID" FROM "sponsorTimes" WHERE "videoID" = ? AND "hidden" = 1`, [videoID]);
                assert.strictEqual(hiddenSegments.length, 2);
                const expected = [{
                    "UUID": "duration-changed-uuid-1",
                }, {
                    "UUID": "duration-changed-uuid-2",
                }];
                arrayDeepEquals(hiddenSegments, expected);
                done();
            });
    });

    it("Should be able to downvote segment with ajacent actionType lock", (done) => {
        const UUID = "no-sponsor-segments-uuid-2";
        postVote(randomID2, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 1);
                done();
            });
    });

    it("Should not be able to revive full video segment as non-vip", (done) => {
        const UUID = "full-video-uuid-1";
        postVote("VIPUser", UUID, 0).then(() => {
            postVote("randomID3", UUID, 1)
                .then(async res => {
                    assert.strictEqual(res.status, 200);
                    const row = await getSegmentVotes(UUID);
                    assert.strictEqual(row.votes, -2);
                    done();
                })
                .catch(err => done(err));
        });
    });

    it("Should be able to upvote a segment if the user has submitted that in category", (done) => {
        const UUID = "testing-outro-skip-1";
        postVote(outroSubmitter, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to downvote a segment if the user has submitted that in category", (done) => {
        const UUID = "testing-outro-skip-2";
        postVote(outroSubmitter, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, -1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to upvote a segment if the user has submitted that in category but different action", (done) => {
        const UUID = "testing-outro-mute-1";
        postVote(outroSubmitter, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to downvote a segment if the user has submitted that in category but different action", (done) => {
        const UUID = "testing-outro-mute-2";
        postVote(outroSubmitter, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, -1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to upvote a segment if the user's only submission of that category was downvoted", (done) => {
        const UUID = "testing-intro-skip-1";
        postVote(badIntroSubmitter, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to downvote a segment if the user's only submission of that category was downvoted", (done) => {
        const UUID = "testing-intro-skip-2";
        postVote(badIntroSubmitter, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to upvote a segment if the user's only submission of that category was hidden", (done) => {
        const UUID = "testing-interaction-skip-1";
        postVote(hiddenInteractionSubmitter, UUID, 1)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 0);
                done();
            })
            .catch(err => done(err));
    });

    it("Should not be able to downvote a segment if the user's only submission of that category was hidden", (done) => {
        const UUID = "testing-interaction-skip-2";
        postVote(hiddenInteractionSubmitter, UUID, 0)
            .then(async res => {
                assert.strictEqual(res.status, 200);
                const row = await getSegmentVotes(UUID);
                assert.strictEqual(row.votes, 0);
                done();
            })
            .catch(err => done(err));
    });
});
