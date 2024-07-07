const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const port = process.env.PORT || 3600;
const validUrl = require('valid-url');

const parseUrl = function(url) {
    url = decodeURIComponent(url);
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'http://' + url;
    }

    return url;
};

app.get('/', function(req, res) {
    const urlToScreenshot = parseUrl(req.query.url);
    const elmToScreenshot = req.query.id;

    if (validUrl.isWebUri(urlToScreenshot)) {
        console.log('Screenshotting elm div#' + elmToScreenshot + ' on ' + urlToScreenshot);

        const page_orientation = req.query.page_orientation;
        const paper_size = req.query.paper_size;

        (async() => {

            let browser;
            try {
                browser = await puppeteer.launch({
										headless: true,
										executablePath: '/usr/bin/google-chrome',
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });

                const page = await browser.newPage();
                await page.emulateMediaType('print');
                await page.setCacheEnabled(false);
                await page.setViewport({ width: 1024, height: 768, deviceScaleFactor: 2 });
                await page.goto(urlToScreenshot, { timeout: 30000, waitUntil: 'networkidle0' });
                //await page.waitFor(250);
                /*await page.pdf({
                    format: paper_size,
                    landscape: (page_orientation === 'Landscape'),
                    margin: { top: 36, right: 36, bottom: 20, left: 36 },
                    printBackground: true
                }).then(function(buffer) {
                    res.setHeader('Content-Disposition', 'attachment;filename="export.pdf"');
                    res.setHeader('Content-Type', 'application/pdf');
                    res.send(buffer)
                });*/

                const mapElement = await page.waitForSelector(`div#${elmToScreenshot}`);
                await mapElement.screenshot().then(function(dataUrl) {
                    res.setHeader('Content-Type', 'image/png');
                    res.send(dataUrl)
                });
            } catch (err) {
                console.log(err.message);
            } finally {
                if (browser) {
                    browser.close();
                }
            }

        })();
    } else {
        res.send('Invalid url: ' + urlToScreenshot);
    }

});

app.listen(port, function() {
    console.log('App listening on port ' + port)
});
