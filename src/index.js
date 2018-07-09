/* jshint undef: true, unused: false, esversion: 6 */
/* globals HTMLAudioElement*/

(function (window) {

    const btnRecord = document.querySelector('button#btnRecord');
    const btnStop = document.querySelector('button#btnStop');
    const chkSpeechEnd = document.querySelector('input#enableSpeechEnd');
    const audios = document.querySelector('ul.list-group');

    let stop = null;
    let isRecording = false;
    const encoder = window.Wavcoder.wavEncoder({
        bufferSize: 4096,
        sampleRate: 44100,
        numChannels: 1
    });

    btnRecord.onclick = () => {
        btnRecord.disabled = true;
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        }).then(stream => {
            isRecording = true;
            stop = window.Wavcoder.recorder(stream, {
                bufferSize: 4096,
                numChannels: 1
            });
            if (chkSpeechEnd.checked) {
                window.Wavcoder.speechStopDetection(stream, {
                    threshold: -60,
                    interval: 70
                }).then(() => {
                    if (isRecording) {
                        btnStop.click();
                    }
                });
            }
            btnStop.disabled = false;
        });
    };

    btnStop.onclick = () => {
        if (stop) {
            btnStop.disabled = true;
            const result = window.Wavcoder.pipe(stop, encoder, window.Wavcoder.blobToBase64)({});
            result.then(base64 => {
                audios.innerHTML = `<li class="list-group-item"><audio src="${base64}" controls></audio></li>${audios.innerHTML}`;
                btnRecord.disabled = false;
                stop = null;
            });
        }
    };

})(window);