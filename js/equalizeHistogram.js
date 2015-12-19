// http://stackoverflow.com/questions/12114643/how-can-i-perform-in-browser-contrast-stretching-normalization

/**
* Equalizes the histogram of an unsigned 1-channel image with values
* in range [0, 255]. Corresponds to the equalizeHist OpenCV function.
*
* @param {Array} src 1-channel source image
* @param {Array} [dst] 1-channel destination image. If omitted, the
* result is written to src (faster)
* @return {Array} Destination image
*/
const equalizeHistogram = function(src, inMax, outMax) {
    var srcLength = src.length;
    var dst = []

    // Compute histogram and histogram sum:
    var hist = new Float32Array(inMax + 1);
    var sum = 0;
    for (var i = 0; i < srcLength; ++i) {
        ++hist[~~src[i]];
        ++sum;
    }

    // Compute integral histogram:
    var prev = hist[0];
    for (var i = 1; i < inMax + 1; ++i) {
        prev = hist[i] += prev;
    }

    // Equalize image:
    var norm = outMax / sum;
    for (var i = 0; i < srcLength; ++i) {
        dst[i] = hist[~~src[i]] * norm;
    }
    return dst;
}

module.exports = equalizeHistogram
