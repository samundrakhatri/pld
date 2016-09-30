const random_ua = require('random-ua');

module.exports = class Payload {

    static forClipDetails(courseDetails) {
        return courseDetails.map(function (module) {
            let courseKey = module.id.split('|');
            return module.clips.map(function (clip, clipIndex) {
                return {
                    author: courseKey[1],//"richard-warburton",
                    clipIndex: clipIndex,
                    courseName: courseKey[0],
                    includeCaptions: false,
                    locale: "en",
                    mediaType: "mp4",
                    moduleName: courseKey[2],
                    quality: "1280x720",
                };
            });

        })
    }

    static generateHeaders(extendedHeader) {
        return Object.assign({}, {
            'User-Agent': random_ua.generate(),
            'Origin': "https://app.pluralsight.com"

        }, extendedHeader || {});
    }
}