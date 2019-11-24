var express = require('express')
var app = express()
var rp = require('request-promise')
let request = require('request');
var getYoutubeVideos = require('./getYoutubeVideos')
let config = require('./config');

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(express.static('./public'))

function getEmotion() {

    return new Promise((resolve, reject) => {

        console.log("Camera opening")
        
        // Enter your mood here
        if(config.camera === false) {
            resolve(config.cameraOffMood);
            return;
        }

        let spawn = require("child_process").spawn; 

        let process = null;
        if(config.python3)
            process = spawn('python3', ["./face_recog.py"] );
        else
            process = spawn('python', ['./face_recog.py']);

        let emotion = null
        process.stdout.on('data', function(data) { 

            emotion = data.toString().trim();

            if(config.debug)
                console.log(emotion, ' emotion detected');

            if(emotion === undefined || emotion === null)
                reject(emotion)
            else
                resolve(emotion)
        })
    })
}

function getSongsList(valence,arousal) {

    return new Promise((resolve, reject) => {
        api_url = "http://musicovery.com/api/V6/playlist.php?&fct=getfrommood&popularitymax=100&popularitymin=10&starttrackid=&date10=true&trackvalence="+valence+"&trackarousal="+arousal+"&resultsnumber=50&listenercountry=us"
        
        request(api_url, (err, respo, body) => {

            if(err) {
                console.log('Could not make Musicovery API Request');
                reject(err)
            }

            resolve(body);
        })
    });
}

function openCamera(request, response){

    getEmotion()
    .then((emotion) => {
        console.log(typeof(emotion))
        console.log(emotion.length)
        // emotion = 'Happy'

        let valence = null
        let arousal = null

        if(emotion === 'Happy') {
            valence = 900000
            arousal = 900000
        } else if(emotion === 'Sad') {
            valence = 200000
            arousal = 200000
        } else if(emotion === 'Angry') {
            valence = 100000
            arousal = 700000
        } else if(emotion === 'Neutral') {
            valence = 700000
            arousal = 200000
        }

        if(config.debug)
            console.log('Valence: ', valence, ', Arousal: ', arousal);

        getSongsList(valence, arousal)
        .then((data) => {

            data = JSON.parse(data);

            if(config.debug)
                console.log('Musicovery API data: ', data);

            let trackList = []
            let tracks = data['tracks']['track'];

            if(config.debug)
                console.log('Musicovery API tracks: ', tracks);
            
            for(let track in tracks) {
                           
                if(tracks[track]['title'] == '' || tracks[track]['artist_display_name'] == '')
				    continue
                var song = tracks[track]['artist_display_name'] + ' ' + tracks[track]['title'];
                trackList.push(song);
            }

            if(config.debug)
                console.log('trackList', trackList);

            getYoutubeVideos.getVideo(trackList)
            .then((videoData) => {

                if(config.debug)
                    console.log(videoData);

                return response.status(200).json({
                    success : true,
                    data : videoData
                })
            })
            .catch((err) => {
                return console.log('Error getting video data from youtube: ', err);
            });
        })
        .catch((err) => {
            return console.log(err)
        });
    })
    .catch((err) => {
        return console.log(err)
    });
}

function fuck(req, res) {


    setTimeout(() => {

        return res.json({
            success: true,
            data: [
                {
                  id: 'uDLgA_YFuuA',
                  title: 'Mark Medlock - Maria Maria (Videoclip)'
                },
                {
                  id: 'QOowQeKyNkQ',
                  title: 'Chris Brown - Don&#39;t Wake Me Up (Official Music Video)'
                },
                { 
                    id: 'BSOhuXgkWcE', 
                    title: 'bomb bae' 
                }
            ]
              
        });

    }, 3000);
}


// app.use('/api', fuck);

app.use('/api', openCamera)

app.listen('5000',function(){
    console.log('server started at http://localhost:5000');
    // openCamera()
})