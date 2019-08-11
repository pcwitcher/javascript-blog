'use strict'

/*document.getElementById('test-button').addEventListener('click', function () {
    const links = document.querySelectorAll('.titles a');
    console.log('links:', links);
});*/

const links = document.querySelectorAll('.titles a');

for (let link of links) {
    console.log(link);
}