import '../extensions/filereader.extension';

export const blobToBase64 = (blob: Blob) => {
    const reader = new FileReader();
    return reader.readAsDataURLPromise(blob);
};