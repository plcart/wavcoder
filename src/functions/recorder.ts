import { ConfigConstraints } from './config.constraint';

export const recorder = (stream: MediaStream, {
    bufferSize,
    numChannels
}: ConfigConstraints): () => DataView[] => {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = source.context.createScriptProcessor(bufferSize, 1, numChannels);
    let data: DataView[] = [];
    source.connect(processor);
    processor.connect(source.context.destination);
    processor.onaudioprocess = e => {
        const buffer = e.inputBuffer.getChannelData(0);
        const length = buffer.length;
        const view = new DataView(new ArrayBuffer(length * 2));
        let offset = 0;
        for (let i = 0; i < length; ++i) {
            let chunk = buffer[i] * 0x7fff;
            view.setInt16(offset, chunk < 0 ? Math.max(chunk, -0x8000) : Math.min(chunk, 0x7fff), true);
            offset += 2;
        }
        data.push(view);
    };
    return () => {
        source.disconnect();
        processor.disconnect();
        return data;
    };
}