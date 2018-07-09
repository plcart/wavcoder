interface FileReader {
    readAsDataURLPromise(blob: Blob): Promise<string>;
}

FileReader.prototype.readAsDataURLPromise = function (blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        this.readAsDataURL(blob);
        this.onloadend = e => {
            resolve(this.result);
        };
        this.onerror = (ev) => {
            reject(ev);
        };
    });
};