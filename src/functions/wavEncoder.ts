import '../extensions/dataview.extension';
import { ConfigConstraints } from './config.constraint';

export const wavEncoder = ({
    sampleRate,
    numChannels,
    bufferSize
}: ConfigConstraints): (dataviews: DataView[]) => Blob => {
    let numSamples = 0;
    return (dataViews: DataView[]) => {
        numSamples = dataViews.length * bufferSize;
        const dataSize = numChannels * numSamples * 2;
        const view = new DataView(new ArrayBuffer(44));
        view.setString(0, 'RIFF');
        view.setUint32(4, dataSize, true);
        view.setString(8, 'WAVE');
        view.setString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 4, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        view.setString(36, 'data');
        view.setUint32(40, dataSize, true);
        dataViews.unshift(view);
        const blob = new Blob(dataViews, {
            type: 'audio/wav'
        });
        return blob;
    };
};
