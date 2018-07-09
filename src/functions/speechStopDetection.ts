export const speechStopDetection = (stream: MediaStream, {
    threshold,
    interval
}: { threshold: number, interval: number }): Promise<void> => new Promise((resolve, reject) => {
    try {
        let running = true;
        let speaking = false;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const analyser = source.context.createAnalyser();
        const speakingHistory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.1;
        const fftBins = new Float32Array(analyser.fftSize);
        source.connect(analyser);

        const getMaxVolume = (a, f) => {
            let maxVol = -Infinity;
            a.getFloatFrequencyData(f);
            for (var i = 4, ii = f.length; i < ii; i++) {
                if (f[i] > maxVol && f[i] < 0) {
                    maxVol = f[i];
                }
            }
            return maxVol;
        };

        const fn = setInterval(() => {
            if (!running) {
                clearInterval(fn);
            } else {
                const currentVol = getMaxVolume(analyser, fftBins);
                let history = 0;
                if (currentVol > threshold && !speaking) {
                    for (let i = speakingHistory.length - 3; i < speakingHistory.length; i++) {
                        history += speakingHistory[i];
                    }
                    if (history >= 2) {
                        speaking = true;
                    }
                } else if (currentVol < threshold && speaking) {
                    for (var j = 0; j < speakingHistory.length; j++) {
                        history += speakingHistory[j];
                    }
                    if (history === 0) {
                        running = false;
                        speaking = false;
                        resolve();
                    }
                }
                speakingHistory.shift();
                speakingHistory.push(currentVol > threshold ? 1 : 0);
            }
        }, interval);


    } catch (error) {
        reject(error);
    }
});