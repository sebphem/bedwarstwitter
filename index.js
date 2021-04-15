const config = require('./config.json');
const twitter = require('twitter-lite');
const client = new twitter(config);

const fs = require('fs');
var mostRecentSize = 0
var fileLocation;
var timesRead = 0
var timesTweeted = 0;
var initialtweet;
var killedBy = [];
var plural;

const readLogFile = async () => {
  var newSize = fs.fstatSync(fileLocation).size
  if (timesRead == 0) {
      mostRecentSize = newSize
      timesRead++
      setTimeout(readLogFile, 10)
  } else if (newSize < mostRecentSize + 1) {
      setTimeout(readLogFile, 10)
  } else {
      fs.read(fileLocation, Buffer.alloc(2056), 0, 2056, mostRecentSize, (err, bytecount, buff) => {
          mostRecentSize += bytecount

          const lines = buff.toString().split(/\r?\n/).slice(0, -1);
          lines.forEach(line => readline(line))
          readLogFile()
      });
  }
}

const readline = async line => {
    if (!line.includes('[Client thread/INFO]: [CHAT]')){
        return;
    }
    if ((line.indexOf("kysiek1234") <= 60) && (line.indexOf("kysiek1234") >= 28) && line.includes("was", "slipped", "got", "\'s heart", "took", "be", "stepped", "squeaked", "got", "slipped", "stumbled", "hit", "howled", "caught",
        "played", "slipped", "died", "fought", "fell", "stumbled", "tangoed", "met", "lost") && !(line.includes("FINAL KILL!")){
        console.log(line)
        let words = line.split(" ")
        let ign = words[ words.length - 1 ];
        killedBy.push(ign);
        let count = 0;
        killedBy.forEach((v) => (v === ign && count++));
        tweet(ign, count)
    }
    if(line.includes("[Client thread/INFO]: [CHAT] kysiek1234 fell into the void.")){
        let ign = "the void"
        killedBy.push(ign);
        let count = 0;
        killedBy.forEach((v) => (v === ign && count++));
        tweet(ign , count);
    }
}

const tweet = async (tweetstring, ticker) => {
    if(ticker == 1) plural = '';
    else plural = 's';
    if(timesTweeted == 0){
        client.post('statuses/update', { status: `kysiek died in ranked bedwars to ${tweetstring} ${ticker} time${plural} \n \n made by kelvin prankz`}).then(result => {
            console.log('You successfully tweeted this : "' + result.text + '"');
            initialtweet = result.id_str;
          }).catch(console.error);
        timesTweeted += 1;
    }
    else{
        await client.post("statuses/update", {
            status: `kysiek died in ranked bedwars to ${tweetstring} ${ticker} time${plural}` ,
            in_reply_to_status_id: initialtweet,
            auto_populate_reply_metadata: true
          });
        timesTweeted += 1;
    }
}

const readLogs = () => {
  fs.open("C:\\Users\\sebas\\.lunarclient\\offline\\1.8\\logs\\latest.log", 'r', (err, fd) => {
      fileLocation = fd
      readLogFile()
  })
}

readLogs()
