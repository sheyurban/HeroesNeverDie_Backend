const app = require("../../index"); // Link to your server file
const request = require("supertest");
const User = require("../user/UserModel");

beforeEach(async () => {
  console.log("beforeEach");
  await User.deleteMany({});
});

afterEach(() => {
  console.log("afterEach");
});

test("öpöpp", async () => {
  await request(app)
    .post("/post/create")
    .send({
      title: "Hanzo Main Guide",
      postedBy: "60951807077e3357f084488d",
      category: "Guide",
      tags: [
        {
          map: "hanamura",
          hero: "hanzo",
        },
      ],
      content: "Awesome content here...",
    })
    .expect(201);
});

// it("Testing to see if Jest works", () => {
//   expect(2).toBe(2);
// });

// it("gets the test endpoint", function (done) {

//   request(app)
//     .get("/post/test")
//     .set("Accept", "application/json")
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .end(function(err, res) {
//       if (err) throw err;
//     });

// });
