const request = require('request');
const FileCookieStore = require('tough-cookie-filestore');
const toughCookie = require('tough-cookie');
const Payload = require('./src/Payload');
const cookiejar = new toughCookie.CookieJar();
const Cookie = toughCookie.Cookie;

const pluralSightApi = {
    login: 'https://app.pluralsight.com/id?'
};
const authenticationPayloads = {
    username: 'samundra.khatri@introcept.co',
    password: 'introcept'
};

let cookieJar = request.jar(new FileCookieStore('cookies.json'));

const pluralRequest = request.defaults({
    jar: cookieJar
});

pluralRequest.post({
    url: pluralSightApi.login,
    form: authenticationPayloads,
    jar: true,
    headers: Payload.generateHeaders()
}, (error, httpResponse) => {
    if (error) {
        console.log("Unable to connect to host " + pluralSightApi.login);
        return;
    }

    var cookie = httpResponse.headers['set-cookie'].map(Cookie.parse);
     pluralRequest.get('https://app.pluralsight.com/learner/content/courses/java-fundamentals-collections',
        function (error, httpResponse, body) {
            "use strict";
            if (error) {
                return console.log('Unable to fetch api\'s ');
            }

            body = JSON.parse(body);
            let modules = body.modules;
            const payloadToFetchClipDetails = Payload.forClipDetails(modules);

            const clipRequest = pluralRequest.post({
                url: 'https://app.pluralsight.com/video/clips/viewclip',
                form: payloadToFetchClipDetails[0][0],
                headers: Payload.generateHeaders({
                    'Cookie': cookie.join('; ')
                }),
            }, function (error, httpResponse, body) {
                // console.log(httpResponse)
                console.log(body)
            });
        });
});

