init();
// show();

function init() {
    var button;
    button = document.querySelector('.button');
    button.addEventListener('click', show);
    console.log(button);
}

function show() {
    console.log('asdcasdc');
    var value, select, block;
    block = document.querySelector('.image');
    block.classList.remove('hidden');
    value = document.querySelector('.text');
    select = document.querySelector('.select');
    console.log(block);
    console.log(value);
    console.log(select);
}