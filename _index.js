const parse = require('node-html-parser').parse;
const fs = require('fs');
let request = require("request-promise");

const mainLink = 'http://www.cmsmagazine.ru/creators/?pn=';
const filePages = './output/studios.txt';
const fileLinks = './output/links.txt';

let studiosArray = [];
let finalLinksArray = [];
let promises = [];

grabHTML(mainLink)
  .then((html) => {
    console.log('got main page');
    let links = parse(html).querySelectorAll('td.name a');
    console.log(`will check ${links.length} links`);

    // go through every studio page
    links.forEach((link) => {
      let studioPage = link.attributes.href;
      promises.push(grabHTML(studioPage));
      studiosArray.push(studioPage);
    })

    // open every page and extract studio link
    Promise.all(promises)
      .then((htmls) => {
        console.log(`\ntotal pages grabbed: ${htmls.length}`);

        // extract links
        htmls.forEach((page) => {
          let finalLink = parse(page).querySelector('.mainInset a');

          if(finalLink) {
            finalLinksArray.push(finalLink.attributes.href);
          } else {
            finalLinksArray.push('');
          }

        })

        console.log(`parsed: ${finalLinksArray.join('\n')}`);

        // store on disk
        fs.writeFileSync(filePages, JSON.stringify(studiosArray, null, 4));
        fs.writeFileSync(fileLinks, JSON.stringify(finalLinksArray, null, 4));
    })

});


function grabHTML(link) {
  return request(
      { uri: link },
      function(error, response, body) {
        if(error) {
          console.log(`ERROR: ${error}`);
        }
          return body;
      }
  )
}
