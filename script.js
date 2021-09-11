const video = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/model'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/model'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/model'),
    faceapi.nets.faceExpressionNet.loadFromUri('/model')

]).then(startvideo)

function startvideo()
{
    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject= stream ,
        err => console.error(err)
    )

}

startvideo();



// event listner for the video when the web cam is loaded

video.addEventListener('play' , () =>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);


    const displaySize = {width:video.width,height:video.height}


    faceapi.matchDimensions(canvas , displaySize);

    setInterval(async () => {

        const detection = await faceapi.detectAllFaces(video , new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        const resizeDetections = faceapi.resizeResults(detection, displaySize);

        canvas.getContext('2d').clearRect(0,0,canvas.width , canvas.height);

        faceapi.draw.drawDetections(canvas , resizeDetections);

        faceapi.draw.drawFaceLandmarks(canvas , resizeDetections);

        faceapi.draw.drawFaceExpressions(canvas , resizeDetections);

    },100)



})