var search = require('youtube-search');

//AIzaSyCMKEg03LntrfSCOKjaxO_W0LF7-FcoqtM

var opts = {
    maxResults: 1,
    key: 'AIzaSyCS1zWJxaSyLyysoTmRZhBZvyzX_gu3r4k'
};

function getOneVideoId(query) {

    return new Promise((resolve, reject) => {


        search(query, opts, function(err, results) {
            if(err) {
                console.log(err)
                reject(err)
            }
            else {
                //results = JSON.parse(results)
                // console.log('idhr h', results)
                let id = results[0]['id']
                let title = results[0]['title']
                res = {
                    id : id,
                    title : title
                }
    
                resolve(res)
            }
        })


    })
}

function getVideo(trackArray){

    return new Promise((resolve22, reject22) => {


        // let result = []
        // let promises = []
        // for(let i in trackArray) {

        // TODO Remove
        //     if(i == 2) {
        //         break;
        //     }

        //     let pro = getOneVideoId(trackArray[i]).then((res) => {
        //         result.push(res)
        //     }).catch((err) => {
        //         console.log('Getting VideoID Error: ', err);
        //     });

        //     promises.push(pro)
        // }

        // Promise.all(promises)
        // .then(() => {
            // console.log('idddddddddddds', result)
            // return result

            let fakeData = [ 
                { 
                    id: 'uDLgA_YFuuA',
                    title: 'Mark Medlock - Maria Maria (Videoclip)' 
                }, { 
                    id: 'QOowQeKyNkQ',
                    title: 'Chris Brown - Don&#39;t Wake Me Up (Official Music Video)' 
                }, {
                    id: 'BSOhuXgkWcE',
                    title: 'bomb bae'
                }
            ];

            resolve22(fakeData);

            // resolve22(result)
        // }).catch((err) => {

        //     console.log('Promise All Resolve Error: ', err);
        //     // return []
        //     reject22(err);
        // });
    
    
    });

    // getOneVideoId(trackArray[0])
    // .then((s) => console.log(s))
    // .catch(err => console.log(err));
        //     let urls = []
    //     //for(let track in trackArray){
    
    //         search(trackArray[0], opts, function(err, results) {
    //             if(err){
    //                 console.log(err)
    //             }
    //             else{
    //                 //results = JSON.parse(results)
    //                 console.log(results)
    //                 let id = results[0]['id']
    //                 let title = results[0]['title']
    //                 urls.push({
    //                     id : id,
    //                     title : title
    //                 })
    //             }
    //         });
    //     // }        
    // })


}

module.exports = {
	getVideo
}