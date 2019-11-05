const Slackbot = require("slackbots");
const nodeScreenshot = require("node-server-screenshot");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");

const token = process.env.SLACK_TOKEN;

const bot = new Slackbot({
  token,
  name: "hangry"
});

bot.on("start", function() {
  bot.postMessageToChannel("general", "meow");
});

bot.on("message", function(msg) {
  switch (msg.type) {
    case "message": {
      if (msg.channel[0] === "D" && msg.bot_id === undefined) {
        nodeScreenshot.fromURL(
          "https://www.cobie.de/speisekarte",
          "cobie-speise-karte.png",
          {
            waitMilliseconds: 2000,
            height: 8000,
            width: 1280,
            clip: {
              x: 0,
              y: 6200,
              width: 1280,
              height: 1000
            },
            show: false
          },
          function() {
            const formData = new FormData();
            formData.append(
              "file",
              fs.createReadStream("./cobie-speise-karte.png"),
              "cobie"
            );
            formData.append("token", token);
            formData.append("channels", msg.user);

            fetch("https://slack.com/api/files.upload", {
              method: "POST",
              headers: { "Content-Type": "multipart/form-data" },
              body: formData
            })
              .then(res => {
                console.warn("uploaded", res);
              })
              .catch(e => {
                console.warn("fetch error", e);
              });
          }
        );

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
