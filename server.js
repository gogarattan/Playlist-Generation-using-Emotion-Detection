var express = require('express')
var app = express()
var rp = require('request-promise')
let request = require('request');
var getYoutubeVideos = require('./getYoutubeVideos')

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(express.static('./public'))

var emotion = null

function getEmotion() {

    return new Promise((res, rej) => {

        console.log("Camera opened")
        var spawn = require("child_process").spawn; 
        var process = spawn('python',["./face_recog.py"] );

        process.stdout.on('data', function(data) { 
            console.log(data.toString())
            emotion = data.toString() 

            if(emotion == undefined)
            rej(emotion)
            else
            res(emotion)
        })
    })
}

function getSongsList(valence,arousal) {

    return new Promise((resolve, reject) => {
        api_url = "http://musicovery.com/api/V6/playlist.php?&fct=getfrommood&popularitymax=100&popularitymin=10&starttrackid=&date10=true&trackvalence="+valence+"&trackarousal="+arousal+"&resultsnumber=50&listenercountry=us"
        
        request(api_url, (err, respo, body) => {

            if(err) {
                console.log('could make musiccovery rqst');
                reject(err)
            }

            resolve(body);
        })
    });
}

function openCamera(req,res){

    getEmotion()
    .then((emotion) => {
        console.log(emotion)
        emotion = 'Happy'

        valence = 0
        arousal = 0

        if(emotion == 'Happy')
        {
            valence = 900000
            arousal = 900000
        }
        else if(emotion == 'Sad')
        {
            valence = 200000
            arousal = 200000
        }
        else if(emotion == 'Angry')
        {
            valence = 100000
            arousal = 700000
        }
        else if(emotion == 'Neutral')
        {
            valence = 700000
            arousal = 200000
        }

        getSongsList(valence, arousal)
        .then((data) => {

            data = JSON.parse(data);
            // console.log('data', data);
            var trackList = []
            var tracks = data['tracks']['track']
            for(var track in tracks){
                
                if(track['title'] == '' || track['artist_display_name'] == '')
				    continue
                var song = tracks[track]['artist_display_name'] + ' ' + tracks[track]['title'];
                // trackList += song
                trackList.push(song);
            }

            // console.log(trackList);

            getYoutubeVideos.getVideo(trackList)
            .then((videoData) => {
                console.log(videoData)
                res.json({
                    success : true,
                    data : videoData
                })
            })
            .catch((err) => {
                console.log('Error getting video data from youtube: ', err);
            });
        })
        .catch((err) => {
            console.log(err)
        });
    })
    .catch((err) => {
        console.log(err)
    });
}

app.use('/api', openCamera)

app.listen('5000',function(){
    console.log('server started at http://localhost:5000');
    // openCamera()
})