const Slackbot = require("slackbots");
const nodeScreenshot = require("node-server-screenshot");

const bot = new Slackbot({
  token: "xoxb-2489948426-814714724753-tLHVPWcfHxdnyWG5i1Nkec6C",
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
            //an image of google.com has been saved at ./test.png
          }
        );

        bot.postMessage(msg.user, "Here is the hamberger menu", {
          as_user: true,
          attachments: [
            {
              fallback: "Hamberger menu",
              text: "Cobie Menu",
              image_url:
                "https://upload.wikimedia.org/wikipedia/commons/4/41/Thetford_Warren_Lodge_-_geograph.org.uk_-_2377164.jpg",
              thumb_url:
                "https://upload.wikimedia.org/wikipedia/commons/4/41/Thetford_Warren_Lodge_-_geograph.org.uk_-_2377164.jpg"
            }
          ]
        });
      }
      break;
    }

    default:
      break;
  }
});
