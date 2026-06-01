

export default function decorate(block) {
    // This function is called when the block is added to the page
    // You can add any initialization code here if needed

    // adding classes to the children of the herocard block and 
    // assigning ids to the first two children
    const herocardChildren = document.querySelectorAll('.herocard > div');
    const classNames = ['pcp', 'hcp'];
    herocardChildren.forEach((child, index) => {
        child.classList.add('card');
        child.setAttribute('id', classNames[index]);
    });

    // Adding specific classes to the first 6 divs within each card and 
    // grouping the first two divs into a new div with class "card-title-heading-group"
    const cardClasses = ['card-title', 'card-heading', 'empty', 'card-image-content', 'card-accordion-heading', 'card-accordion-pills'];

    herocardChildren.forEach((child) => {
        const childElements = child.querySelectorAll('div');
        childElements.forEach((element, index) => {
            element.classList.add(cardClasses[index]);
        });
    });

    herocardChildren.forEach((child, index) => {
        var cardTitleHeadingElement = document.createElement('div');
        cardTitleHeadingElement.setAttribute('id', `card-title-heading-group-${index}`);
        cardTitleHeadingElement.classList.add('card-title-heading-group');

        // Query within this card's context only
        const cardTitle = child.querySelector('.card-title');
        const cardHeading = child.querySelector('.card-heading');

        if (cardTitle) cardTitleHeadingElement.appendChild(cardTitle);
        if (cardHeading) cardTitleHeadingElement.appendChild(cardHeading);

        child.insertBefore(cardTitleHeadingElement, child.firstChild);

    });

    // Adding Diagonal Arrow Up SVG
    let diagonalArrowUpSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    diagonalArrowUpSvg.setAttribute("width", "25");
    diagonalArrowUpSvg.setAttribute("height", "25");
    diagonalArrowUpSvg.setAttribute("viewBox", "0 0 25 25");
    diagonalArrowUpSvg.setAttribute("fill", "none");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M23.9978 0H25.0228V18.45H22.9728V3.49781L2.17172 24.2989L1.44781 25.0228L0 23.575L0.723906 22.8511L21.525 2.05H6.57281V0H23.9978Z");
    // path.setAttribute("d", "M31.7814 8.19995H32.8064V26.6499H30.7564V11.6978L9.95529 32.4989L9.23138 33.2228L7.78357 31.7749L8.50748 31.051L29.3086 10.25H14.3564V8.19995H31.7814Z");
    path.setAttribute("fill", "black");
    diagonalArrowUpSvg.appendChild(path);

    document.querySelectorAll('.card-heading p').forEach((heading) => {
        heading.appendChild(diagonalArrowUpSvg.cloneNode(true));
    });

    // Adding Chevron SVG (collapsed)
    let chevronSvgUp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevronSvgUp.setAttribute("width", "39");
    chevronSvgUp.setAttribute("height", "37");
    chevronSvgUp.setAttribute("viewBox", "0 0 39 37");
    chevronSvgUp.setAttribute("fill", "none");
    let path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M19.4999 8.65063L18.8113 9.28746L6.13635 21.0095L5.44775 21.6463L6.82494 22.92L7.51354 22.2832L19.4999 11.1979L31.4863 22.2832L32.1749 22.92L33.5521 21.6463L32.8635 21.0095L20.1885 9.28746L19.4999 8.65063Z");
    path1.setAttribute("fill", "#0E4D47");
    chevronSvgUp.appendChild(path1);

    document.querySelectorAll('.card-accordion-heading').forEach((heading) => {
        heading.appendChild(chevronSvgUp.cloneNode(true));
    });

    // Adding click event listeners to the accordion headings to 
    // toggle the visibility of the pills and rotate the chevron
    const accordionHeadingPCP = document.querySelector('#pcp .card-accordion-heading');
    accordionHeadingPCP.addEventListener('click', () => {
        const accordionPills = document.querySelector('#pcp .card-accordion-pills');
        const isActive = accordionPills.classList.toggle('active');
        const chevron = accordionHeadingPCP.querySelector('svg');
        if (chevron) {
            chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });

    const accordionHeadingHCP = document.querySelector('#hcp .card-accordion-heading');
    accordionHeadingHCP.addEventListener('click', () => {
        const accordionPills = document.querySelector('#hcp .card-accordion-pills');
        const isActive = accordionPills.classList.toggle('active');
        const chevron = accordionHeadingHCP.querySelector('svg');
        if (chevron) {
            chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });
}
