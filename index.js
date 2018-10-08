const parse = require('node-html-parser').parse;
const fs = require('fs');
let request = require("request-promise");

const mainLink = 'http://www.cmsmagazine.ru/creators/?pn=';
const filePages = './output/studios.txt';
const fileLinks = './output/links.txt';

let pages = [];
let finalLinks = [];

let pageLinks = grabPages();
// grabLinks(pageLinks);


async function grabPages() {
  console.log('grabPages called');

  let studioLinks = [];

  for(let i = 0; i < 3; i++) {
    let page = await grabHTML(mainLink + i);
    pages.push(page);
    console.log('grabbed', i);
  }

  console.log(`got main pages: ${pages.length}\n`);

    // parse links of every page
  pages.forEach((page, index) => {
    console.log('foreach PAGE', index);
    studioLinks[index] = parse(page).querySelectorAll('td.name a');
    console.log(`will check ${studioLinks[index].length} links`);
  });


  // open every link
  for(let i = 0; i < studioLinks.length; i++) {
    let page = studioLinks[i];
    finalLinks[i] = [];
    console.log('grab page:', i);

    for(let j = 0; j < studioLinks[i].length; j++) {
      let htmlObject = page[j];
        // get link on studio page
      let link = htmlObject.attributes.href;
      let studioHTML = await grabHTML(link);
      let finalLink = parse(studioHTML).querySelector('.mainInset a');

      if(finalLink) {
        finalLinks[i].push(finalLink.attributes.href);
      } else {
        finalLinks[i].push('');
      }

      console.log('grabbed link', finalLinks[i][j]);
    }
    console.log('page grabbed', finalLinks[i].length);
  }

  console.log('done, write will be there');


}


// async function grabLinks(pageLinks) {
//   console.log('grab links called');
//
//     // open every link
//     for(let i = 0; i < pageLinks.length; i++) {
//       let page = pageLinks[i];
//       finalLinks[i] = [];
//       console.log('grab page:', pageIndex);
//
//       for(let j = 0; j < pageLinks.length; j++) {
//         let htmlObject = page[j];
//           // get link on studio page
//         let link = htmlObject.attributes.href;
//         let studioHTML = await grabHTML(link);
//         let finalLink = parse(studioHTML).querySelector('.mainInset a');
//         finalLinks[i][j].push(finalLink);
//         console.log('grabbed link', finalLink);
//       }
//       console.log('page grabbed', finalLinks[i].length);
//     }
//
//     console.log('done, write will be there');
//
// }


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


//
//
// async function grabLinks(pageLinks) {
//     // open every link
//   pageLinks.forEach((page, pageIndex) => {
//     finalLinks[pageIndex] = [];
//     console.log('grab page:', pageIndex);
//
//     page.forEach((htmlObject, linkIndex) => {
//         // get link on studio page
//       let link = htmlObject.attributes.href;
//       let studioHTML = await grabHTML(link);
//       let finalLink = parse(studioHTML).querySelector('.mainInset a');
//       finalLinks[pageIndex].push(finalLink);
//       console.log('grabbed link', finalLink);
//     })
//
//     console.log('page grabbed', finalLinks[pageIndex].length);
//
//   });
//
// }
