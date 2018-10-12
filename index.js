const parse = require('node-html-parser').parse;
const fs = require('fs');
let request = require("request-promise");

const mainLink = 'http://www.cmsmagazine.ru/creators/?pn=';

const outputDir = './output'
const filePages = `/studios.txt`;
const fileLinks = '/links.txt';

let pages = [];
let finalLinks = []; // final array of extracted links
let pagesLinks = []; // final array of pages links

grabPages();

async function grabPages() {
  console.log('started...');

  let studioLinks = [];

    // go through all pages and grab html
  for(let i = 0; i < 1; i++) {
    let page = await grabHTML(mainLink + (i + 1));
    pages.push(page);
    console.log('grabbed:', mainLink + (i + 1));
  }

  console.log(`got main pages: ${pages.length}\n`);

    // parse links of every page
  pages.forEach((page, index) => {
    studioLinks[index] = parse(page).querySelectorAll('td.name a');
    console.log(`page: ${index} - ${studioLinks[index].length} links`);
  });

  console.log('\nextracting links started...');

  // open every link
  for(let i = 0; i < studioLinks.length; i++) {
    let page = studioLinks[i];
    console.log('grab page:', i);

    for(let j = 0; j < studioLinks[i].length; j++) {
      let htmlObject = page[j];
      let finalLink;
      let studioHTML;

        // get link on studio page
      let link = htmlObject.attributes.href;
      pagesLinks.push(link);

      try {
        studioHTML = await grabHTML(link);
        finalLink = parse(studioHTML).querySelector('.mainInset a');
      } catch(e) {
        console.log('error while parsing link: ', link);
      }

      finalLink = (finalLink) ? finalLink.attributes.href : ''
      finalLinks.push(finalLink);

      // console.log(finalLink);
      await sleep(10);
    }
    console.log('done:', i);
    await sleep(500);
  }

  console.log('\nfinished');
  console.log('links:', finalLinks.length);
  console.log('pages:', pagesLinks.length);


  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }

  // store on disk
  fs.writeFileSync(`${outputDir}${filePages}`, JSON.stringify(pagesLinks, null, 4).replace(/[\"\,]/g, ''));
  fs.writeFileSync(`${outputDir}${fileLinks}`, JSON.stringify(finalLinks, null, 4).replace(/[\"\,]/g, ''));
  console.log('Saved!');
  console.log(`Check out \n${outputDir}\n\t${filePages}\n\t${fileLinks}`);

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

function sleep(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  })
}

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
