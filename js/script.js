// Carousel Functionality
const carousel = document.querySelector('.carousel-images');
const images = document.querySelectorAll('.carousel-images img');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentIndex = 0;
const slideInterval = 5000; // Increased to 5 seconds to let users enjoy the transition

// Create indicator dots
images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        currentIndex = index;
        updateCarousel(true);
        slideTimer = setInterval(autoSlide, slideInterval);
    });
    indicatorsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel(userInitiated = false) {
    const width = images[0].clientWidth;
    
    // Smooth transition
    carousel.style.transform = `translateX(-${currentIndex * width}px)`;
    
    // Update active states
    images.forEach((img, index) => {
        img.classList.toggle('active', index === currentIndex);
        if (Math.abs(index - currentIndex) <= 1) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0.85';
        }
    });

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function autoSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
}

// Set up auto sliding
let slideTimer = setInterval(autoSlide, slideInterval);

// Event listeners with improved transition handling
carousel.addEventListener('mouseenter', () => {
    clearInterval(slideTimer);
});

carousel.addEventListener('mouseleave', () => {
    slideTimer = setInterval(autoSlide, slideInterval);
});

nextButton.addEventListener('click', () => {
    clearInterval(slideTimer);
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel(true);
    slideTimer = setInterval(autoSlide, slideInterval);
});

prevButton.addEventListener('click', () => {
    clearInterval(slideTimer);
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel(true);
    slideTimer = setInterval(autoSlide, slideInterval);
});

// Initial setup
updateCarousel();
window.addEventListener('resize', updateCarousel);