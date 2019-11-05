const Slackbot = require("slackbots");
var webshot = require("webshot");
const path = require("path");
const fs = require("fs");
const request = require("request");

const token = process.env.SLACK_TOKEN;

const bot = new Slackbot({
  token,
  name: "hangry"
});

// bot.on("start", function() {
//   bot.postMessageToChannel("general", "meow");
// });

bot.on("message", function(msg) {
  switch (msg.type) {
    case "message": {
      if (msg.channel[0] === "D" && msg.bot_id === undefined) {
        console.log("received message", msg);
        webshot(
          "https://www.cobie.de/speisekarte",
          "cobie-speise-karte.png",
          {
            windowSize: {
              height: 8000,
              width: 1280
            },
            shotSize: {
              height: 1000,
              width: 1280
            },
            shotOffset: {
              left: 0,
              top: 6200
            },
            phantomPath: path.join(__dirname, "vendor/phantomjs/bin/phantomjs")
          },
          function(err) {
            uploadFile({ channels: [msg.user] });
          }
        );

        // nodeScreenshot.fromURL(
        //   "https://www.cobie.de/speisekarte",
        //   "cobie-speise-karte.png",
        //   {
        //     waitMilliseconds: 2000,
        //     height: 8000,
        //     width: 1280,
        //     clip: {
        //       x: 0,
        //       y: 6200,
        //       width: 1280,
        //       height: 1000
        //     },
        //     show: false
        //   },
        //   function(err) {
        //     if (err) {
        //       console.log("error creating screenshot", err);
        //     } else {
        //       console.log("uploading file");
        //       uploadFile({ channels: [msg.user] })
        //         .then(res => {
        //           console.log("file was uploaded", res);
        //         })
        //         .catch(e => {
        //           console.log("file upload failed", e);
        //         });
        //     }
        //   }
        // );

        // bot.postMessage(msg.user, "Here is the hamberger menu", {
        //   as_user: true,
        //   attachments: [
        //     {
        //       fallback: "Hamberger menu",
        //       text: "Cobie Menu (running on heroku)",
        //       image_url:
        //         "https://upload.wikimedia.org/wikipedia/commons/4/41/Thetford_Warren_Lodge_-_geograph.org.uk_-_2377164.jpg",
        //       thumb_url:
        //         "https://upload.wikimedia.org/wikipedia/commons/4/41/Thetford_Warren_Lodge_-_geograph.org.uk_-_2377164.jpg"
        //     }
        //   ]
        // });
      }
      break;
    }

    default:
      break;
  }
});

const uploadFile = options =>
  new Promise((resolve, reject) => {
    const { channels } = options;

    const payload = {
      token,
      file: fs.createReadStream("./cobie-speise-karte.png"),
      channels,
      filetype: "image/png",
      filename: "file",
      title: "file"
    };

    request.post(
      {
        url: "https://slack.com/api/files.upload",
        formData: payload,
        json: true
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode !== 200) {
          reject(body);
        } else if (body.ok !== true) {
          const bodyString = JSON.stringify(body);
          reject(
            new Error(
              `Got non ok response while uploading file -> ${bodyString}`
            )
          );
        } else {
          resolve(body);
        }
      }
    );
  });
