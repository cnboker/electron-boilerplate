async function scrollBottom(page){

    const innerWidth = await page.evaluate(_ => { return window.innerWidth} );
    const innerHeight = await page.evaluate(_ => { return window.innerHeight} );
    const mouse = page.mouse
    await mouse.move(innerWidth/2, innerHeight/2);

    await page.waitFor(500);

    // Scroll Window
    page.evaluate(_ => {
        window.scrollBy(0, innerHeight);
    });     
};

module.exports = scrollBottom;