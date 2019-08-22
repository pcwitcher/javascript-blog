'use strict';

const opt = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  articleTagsSelector: '.post-tags .list',
  titleListSelector: '.titles',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-',
  articleAuthorSelector: '.post-author',
  authorsListSelector: '.authors'
};

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  this.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = this.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');

};





function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */

  const titleList = document.querySelector(opt.titleListSelector);
  titleList.innerHTML = '';

  /* [DONE] for each article */

  const articles = document.querySelectorAll(opt.articleSelector + customSelector);

  let html = '';

  for (let article of articles) {

    /* [DONE] get the article id */

    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */

    const articleTitle = article.querySelector(opt.titleSelector).innerHTML;

    /* [DONE] create HTML of the link */

    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* [DONE] insert link into titleList */

    html = html + linkHTML;

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
  }
  for (let tag in tags) {
    /*console.log(tag + ' is used ' + tags[tag] + ' times');*/
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);

  return opt.cloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagsList = article.querySelector(opt.articleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;

      } else {

        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    let allTagsHTML = '';
    /* [NEW] START LOOP: for each tag in alltags: */
    for (let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */

      const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href = "#tag-' + tag + '" > ' + tag + ' </a></li > ';
      //console.log('tagLinkHTML:', tagLinkHTML);
      allTagsHTML += tagLinkHTML;
    }
    tagList.innerHTML = allTagsHTML;
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
    /* END LOOP: for every article: */
  }
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  //const link = this.querySelector('a[href^="#tag-"]');
  const href = this.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll(href);
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll(opt.articleTagsSelector);
  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function calculateAuthorsParams(authors) {
  const params = {
    max: 0,
    min: 999999
  };
  for (let author in authors) {
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if (authors[author] > params.max) {
      params.max = authors[author];
    }
  }
  for (let author in authors) {
    /*console.log(tag + ' is used ' + tags[tag] + ' times');*/
    if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }
  return params;
}

function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor(percentage * (opt.cloudClassCount - 1) + 1);

  return opt.cloudClassPrefix + classNumber;
}

function generateAuthors() {
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opt.articleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const authorsList = article.querySelector(opt.articleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags author data-tags attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTML = '<a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';
    /* [NEW] check if this link is NOT already in allAuthors */
    if (!Object.prototype.hasOwnProperty.call(allAuthors, articleAuthor)) {
      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* add generated code to html variable */
    html = html + linkHTML;
    /* insert HTML of all the links into the tags wrapper */
    authorsList.innerHTML = html;

  }
  const authorList = document.querySelector(opt.authorsListSelector);

  const authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorsParams:', authorsParams);

  /* [NEW] create variable for all links HTML code */
  let allAuthorsHTML = '';

  /* [NEW] START LOOP: for each author in allAuthors: */
  for (let author in allAuthors) {
    /* [NEW] generate code of a link and add it to allAuthorsHTML */
    const authorLinkHTML = '<li><a class="' + calculateAuthorClass(allAuthors[author], authorsParams) + '" href="#author-' + author + '">' + author + '</a></li> ';

    allAuthorsHTML += authorLinkHTML;
  }
  /* [NEW] END LOOP: for each author in allAuthors: */

  /* [NEW] add html from allAuthorsHTML to authorList */
  authorList.innerHTML = allAuthorsHTML;

}

generateAuthors();



function authorClickHandler(event) {

  event.preventDefault();

  const clickedElement = this;

  const href = this.getAttribute('href');

  const author = href.replace('#author-', '');

  generateTitleLinks('[data-author="' + author + '"]');
}



function addClickListenersToAuthors() {

  const links = document.querySelectorAll('.post-author a');

  for (let link of links) {

    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();
