import { db } from "../../src/databases/databases";
import { partialDeepEquals } from "../utils/partialDeepEquals";
import assert from "assert";
import { client } from "../utils/httpClient";

describe("getSkipSegments", () => {
    const endpoint = "/api/skipSegments";
    before(async () => {
        const query = 'INSERT INTO "sponsorTimes" ("videoID", "startTime", "endTime", "votes", "locked", "UUID", "userID", "timeSubmitted", "views", "category", "actionType", "service", "videoDuration", "hidden", "shadowHidden", "description") VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.prepare("run", query, ["getSkipSegmentID0", 1, 11, 1, 0, "uuid01", "testman", 0, 50, "sponsor", "skip", "YouTube", 100, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID0", 12, 14, 2, 0, "uuid02", "testman", 0, 50, "sponsor", "mute", "YouTube", 100, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID0", 20, 33, 2, 0, "uuid03", "testman", 0, 50, "intro", "skip", "YouTube", 101, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID1", 1, 11, 2, 0, "uuid10", "testman", 0, 50, "sponsor", "skip", "PeerTube", 120, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID2", 1, 11, 2, 1, "uuid20", "testman", 0, 50, "sponsor", "skip", "YouTube", 140, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID3", 1, 11, 2, 0, "uuid30", "testman", 0, 50, "sponsor", "skip", "YouTube", 200, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID3", 7, 22, -3, 0, "uuid31", "testman", 0, 50, "sponsor", "skip", "YouTube", 300, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentMultiple", 1, 11, 2, 0, "uuid40", "testman", 0, 50, "intro", "skip", "YouTube", 400, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentMultiple", 20, 33, 2, 0, "uuid41", "testman", 0, 50, "intro", "skip", "YouTube", 500, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentLocked", 20, 33, 2, 1, "uuid50", "testman", 0, 50, "intro", "skip", "YouTube", 230, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentLocked", 20, 34, 100000, 0, "uuid51", "testman", 0, 50, "intro", "skip", "YouTube", 190, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID6", 20, 34, 100000, 0, "uuid60", "testman", 0, 50, "sponsor", "skip", "YouTube", 190, 1, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 60, 70, 2, 0, "requiredSegmentVid1", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 60, 70, -2, 0, "requiredSegmentVid2", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 80, 90, -2, 0, "requiredSegmentVid3", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 80, 90, 2, 0, "requiredSegmentVid4", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 60, 70, 0, 0, "requiredSegmentVid-hidden", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 1, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentVid", 80, 90, 0, 0, "requiredSegmentVid-shadowhidden", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 1, ""]);
        await db.prepare("run", query, ["chapterVid", 60, 80, 2, 0, "chapterVid-1", "testman", 0, 50, "chapter", "chapter", "YouTube", 0, 0, 0, "Chapter 1"]);
        await db.prepare("run", query, ["chapterVid", 70, 75, 2, 0, "chapterVid-2", "testman", 0, 50, "chapter", "chapter", "YouTube", 0, 0, 0, "Chapter 2"]);
        await db.prepare("run", query, ["chapterVid", 71, 75, 2, 0, "chapterVid-3", "testman", 0, 50, "chapter", "chapter", "YouTube", 0, 0, 0, "Chapter 3"]);
        await db.prepare("run", query, ["requiredSegmentHashVid", 10, 20, -2, 0, "1d04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["requiredSegmentHashVid", 20, 30, -2, 0, "1ebde8e8ae03096b6c866aa2c8cc7ee1d720ca1fca27bea3f39a6a1b876577e71", "testman", 0, 50, "sponsor", "skip", "YouTube", 0, 0, 0, ""]);
        await db.prepare("run", query, ["getSkipSegmentID0", 1, 12, 1, 0, "uuid01-spot", "testman", 0, 50, "sponsor", "skip", "Spotify", 100, 0, 0, ""]);
        return;
    });

    it("Should be able to get a time by category 1", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: "sponsor" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                assert.strictEqual(data[0].segment[0], 1);
                assert.strictEqual(data[0].segment[1], 11);
                assert.strictEqual(data[0].category, "sponsor");
                assert.strictEqual(data[0].UUID, "uuid01");
                assert.strictEqual(data[0].votes, 1);
                assert.strictEqual(data[0].locked, 0);
                assert.strictEqual(data[0].videoDuration, 100);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category and action type", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: "sponsor", actionType: "mute" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                const expected = [{
                    segment: [12, 14],
                    category: "sponsor",
                    UUID: "uuid02",
                    videoDuration: 100
                }];
                assert.ok(partialDeepEquals(data, expected));
                assert.strictEqual(data.length, 1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category and getSkipSegmentMultiple action types", (done) => {
        client.get(`${endpoint}?videoID=getSkipSegmentID0&category=sponsor&actionType=mute&actionType=skip`)
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                    videoDuration: 100
                }, {
                    UUID: "uuid02"
                }];
                assert.strictEqual(data.length, 2);
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category and getSkipSegmentMultiple action types (JSON array)", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: "sponsor", actionTypes: `["mute","skip"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                    videoDuration: 100
                }, {
                    UUID: "uuid02"
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category for a different service 1", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID1", category: "sponsor", service: "PeerTube" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid10",
                    videoDuration: 120
                }];
                assert.ok(partialDeepEquals(data, expected));
                assert.strictEqual(data.length, 1);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category 2", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: "intro" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid03"
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by categories array", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", categories: `["sponsor"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                    videoDuration: 100
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by categories array 2", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", categories: `["intro"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid03",
                    videoDuration: 101
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should return 404 if all submissions are hidden", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID6" } })
            .then(res => {
                assert.strictEqual(res.status, 404);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get getSkipSegmentMultiple times by category", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentMultiple",  categories: `["intro"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    segment: [1, 11],
                    category: "intro",
                    UUID: "uuid40",
                }, {
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid41",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get getSkipSegmentMultiple times by getSkipSegmentMultiple categories", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", categories: `["sponsor", "intro"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                }, {
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid03",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be possible to send unexpected query parameters", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", fakeparam: "hello", category: "sponsor" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Low voted submissions should be hidden", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID3", category: "sponsor" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid30",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should return 404 if no segment found", (done) => {
        client.get(endpoint, { params: { videoID: "notarealvideo" } })
            .then(res => {
                assert.strictEqual(res.status, 404);
                done();
            })
            .catch(err => done(err));
    });

    it("Should return 400 if bad categories argument", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", categories: `[not-quoted,not-quoted]` } })
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able send a comma in a query param", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID2", category: "sponsor" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid20",
                    votes: 2,
                    locked: 1
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should always get getSkipSegmentLocked segment", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentLocked", category: "intro" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid50",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get getSkipSegmentMultiple categories with repeating parameters", (done) => {
        client.get(`${endpoint}?category=sponsor&category=intro`, { params: { videoID: "getSkipSegmentID0" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                }, {
                    segment: [20, 33],
                    category: "intro",
                    UUID: "uuid03",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get, categories param overriding repeating category", (done) => {
        client.get(`${endpoint}?videoID=getSkipSegmentID0&categories=["sponsor"]&category=intro`)
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                const expected = [{
                    segment: [1, 11],
                    category: "sponsor",
                    UUID: "uuid01",
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get specific segments with requiredSegments", (done) => {
        const required2 = "requiredSegmentVid2";
        const required3 = "requiredSegmentVid3";
        client.get(endpoint, { params: { videoID: "requiredSegmentVid", requiredSegments: `["${required2}","${required3}"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: required2,
                }, {
                    UUID: required3,
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get specific segments with repeating requiredSegment", (done) => {
        const required2 = "requiredSegmentVid2";
        const required3 = "requiredSegmentVid3";
        client.get(`${endpoint}?videoID=requiredSegmentVid&requiredSegment=${required2}&requiredSegment=${required3}`)
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: required2,
                }, {
                    UUID: required3,
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get overlapping chapter segments if very different", (done) => {
        client.get(`${endpoint}?videoID=chapterVid&category=chapter&actionType=chapter`)
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: "chapterVid-1",
                    description: "Chapter 1"
                }, {
                    UUID: "chapterVid-2",
                    description: "Chapter 2"
                }];
                const expected2 = [{
                    UUID: "chapterVid-1",
                    description: "Chapter 1"
                }, {
                    UUID: "chapterVid-3",
                    description: "Chapter 3"
                }];

                assert.ok(partialDeepEquals(data, expected, false) || partialDeepEquals(data, expected2));
                done();
            })
            .catch(err => done(err));
    });

    it("Should get 400 if no videoID passed in", (done) => {
        client.get(endpoint)
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get requiredSegment by partial", (done) => {
        const required1 = "1d04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa";
        const required2 = "1ebde8e8ae03096b6c866aa2c8cc7ee1d720ca1fca27bea3f39a6a1b876577e71";
        client.get(`${endpoint}?videoID=requiredSegmentHashVid&requiredSegment=${required1.slice(0,8)}&requiredSegment=${required2.slice(0,8)}`)
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: required1,
                }, {
                    UUID: required2,
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get hidden segments with requiredSegments", (done) => {
        const required3 = "requiredSegmentVid3";
        const requiredHidden = "requiredSegmentVid-hidden";
        client.get(endpoint, { params: { videoID: "requiredSegmentVid", requiredSegments: `["${requiredHidden}","${required3}"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: requiredHidden,
                }, {
                    UUID: required3,
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get shadowhidden segments with requiredSegments", (done) => {
        const required2 = "requiredSegmentVid2";
        const requiredShadowHidden = "requiredSegmentVid-shadowhidden";
        client.get(endpoint, { params: { videoID: "requiredSegmentVid", requiredSegments: `["${required2}","${requiredShadowHidden}"]` } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 2);
                const expected = [{
                    UUID: required2,
                }, {
                    UUID: requiredShadowHidden,
                }];
                assert.ok(partialDeepEquals(data, expected));
                done();
            })
            .catch(err => done(err));
    });

    it("Should get 400 for invalid category type", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: 1 } })
            .then(res => {
                assert.strictEqual(res.status, 400);
                done();
            })
            .catch(err => done(err));
    });

    it("Should be able to get a time by category for spotify service", (done) => {
        client.get(endpoint, { params: { videoID: "getSkipSegmentID0", category: "sponsor", service: "spotify" } })
            .then(res => {
                assert.strictEqual(res.status, 200);
                const data = res.data;
                assert.strictEqual(data.length, 1);
                assert.strictEqual(data[0].segment[0], 1);
                assert.strictEqual(data[0].segment[1], 12);
                assert.strictEqual(data[0].category, "sponsor");
                assert.strictEqual(data[0].UUID, "uuid01-spot");
                assert.strictEqual(data[0].votes, 1);
                assert.strictEqual(data[0].locked, 0);
                assert.strictEqual(data[0].videoDuration, 100);
                done();
            })
            .catch(err => done(err));
    });
});
