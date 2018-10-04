const parse = require('node-html-parser').parse;
const fs = require('fs');
let request = require("request-promise");

let mainLink = 'http://www.cmsmagazine.ru/creators';
const file = './links.txt';
let finalLinksArray = [];


grabHTML(mainLink)
  .then((html) => {
    console.log('page downloaded');
    const root = parse(html);
    let links = root.querySelectorAll('td.name a');
    console.log(`will open ${links.length} links`);

    for(let i = 0; i < links.length; ++i) {
      extractStudioLink(links[i].attributes.href)
        .then((link) => {
          // finalLinksArray.push(link);
          fs.appendFileSync(file, link + '\n');
        })
    }

  // links.forEach((link) => {
  //
  // })
});

function extractStudioLink(link) {
  console.log('attempt to open link:', link);
  return grabHTML(link)
    .then((html) => {
      console.log(`got html from link: ${link}`);
      // const root = parse(html);
      let finalLink = parse(html).querySelector('.mainInset a');

      if(finalLink) {
        return finalLink.attributes.href
      } else {
        console.log(`can't get href attribute from: ${link}`)
        return '';
      }

    // require('fs').writeFileSync('./page.html', root.toString());
  })
}


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




// request(
//     { uri: 'http://www.cmsmagazine.ru/creators' },
//     function(error, response, body) {
//       if(error) {
//         console.log(`ERROR: ${error}`);
//       }
//         return body;
//     }
// )
