interface DataView {
    setString(offset: number, value: string): void;
}

DataView.prototype.setString = function (offset: number, value: string): void {
    const length = value.length;
    for (let index = 0; index < length; index++)
        this.setUint8(offset + index, value.charCodeAt(index));
}

