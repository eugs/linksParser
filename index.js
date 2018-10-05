const parse = require('node-html-parser').parse;
const fs = require('fs');
let request = require("request-promise");

const mainLink = 'http://www.cmsmagazine.ru/creators/?pn=';
const filePages = './output/studios.txt';
const fileLinks = './output/links.txt';

let studiosArray = [];
let finalLinksArray = [];
let promises = [];

let pagesSets = [];

  for(let i = 0; i < 2; i++) {
    promises.push(grabHTML(mainLink+i));
  }

  Promise.all(promises)

    .then((pages) => {
      console.log(`got main pages: ${pages.length}`);
      let pageLinks = [];

        // parse links of every page
      pages.forEach((page, index) => {
        console.log('foreach PAGE', index);

        pageLinks[index] = parse(page).querySelectorAll('td.name a');
        console.log(`will check ${pageLinks[index].length} links`);
      });

      return pageLinks;
    })

    .then((allPagesLinks) => {
      let actions = [];

      // push every link into array of promises
      allPagesLinks.forEach((pageLinks) => {
        actions = pageLinks.map((htmlObject) => {
          // console.log('try to grab', htmlObject.attributes.href)
          let link = htmlObject.attributes.href;
          actions.push(grabHTML(link));
        })
      })

      console.log('actions collected:', actions.length);

      return Promise.all(actions);
    })
    .then((finalArray) => {
      console.log('finalArray', finalArray.length);
      // store on disk

    })

// grabHTML(mainLink)
//   .then((html) => {
//
//     // go through every studio page
//     links.forEach((link) => {
//       let studioPage = link.attributes.href;
//       promises.push(grabHTML(studioPage));
//       studiosArray.push(studioPage);
//     })
//
//     // open every page and extract studio link
//     Promise.all(promises)
//       .then((htmls) => {
//         console.log(`\ntotal pages grabbed: ${htmls.length}`);
//
//         // extract links
//         htmls.forEach((page) => {
//           let finalLink = parse(page).querySelector('.mainInset a');
//
//           if(finalLink) {
//             finalLinksArray.push(finalLink.attributes.href);
//           } else {
//             finalLinksArray.push('');
//           }
//
//         })
//
//         console.log(`parsed: ${finalLinksArray.join('\n')}`);
//
//         // store on disk
//         fs.writeFileSync(filePages, JSON.stringify(studiosArray, null, 4));
//         fs.writeFileSync(fileLinks, JSON.stringify(finalLinksArray, null, 4));
//     })

  // })
  .catch((err) => {
    // console.log(`ERROR: ${err}`);
  })


function grabHTML(link) {
  return request(
      { uri: link },
      function(error, response, body) {
        if(error) {
          return error;
        }
          return body;
      }
  )
}
