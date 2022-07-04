$(document).ready(function(){

	/* ==========================================================================
     Slider Promo
     ========================================================================== */

    // Слайдер
    const swiperPromoOptions = {
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.slider-promo__pages__in',
            bulletElement: 'li',
            bulletClass: 'slider-promo__pages__bullet',
            bulletActiveClass: 'is-active',
            clickable: true,
        },
    };

    const swiperPromoNight = new Swiper('.slider-promo_night', swiperPromoOptions);
    const swiperPromoDay = new Swiper('.slider-promo_day', swiperPromoOptions);

    // Fix lazysizes
    const promoSlide = $('.slider-promo__slide');
    promoSlide.removeClass('lazyload');
    promoSlide.addClass('lazyload');

    // Пагинация слайдера
    const sliderPromoPages = $('.slider-promo__pages');

    sliderPromoPages.find('.slider-promo__pages__bullet').each(function(){
        $(this).append('<div class="slider-promo__pages__timer"></div>')
    });

    // Ночной/дневной слайдер
    const sliderPromoSwitch = $('.time-of-day');
    const sliderPromoNight = $('.slider-promo_night');
    const sliderPromoDay = $('.slider-promo_day');

    sliderPromoSwitch.click(function(){
       $(this).toggleClass('is-day');
       $('.section-promo').toggleClass('is-day');
       sliderPromoNight.toggleClass('is-active');
       sliderPromoDay.toggleClass('is-active');
    });

    /* ==========================================================================
     Slider Experts Locations
     ========================================================================== */

    let currentLocation = '';
    const expertLocationsElement = document.querySelector('.experts-locations');

    /* ==========================================================================
     Slider Experts Bullets
     ========================================================================== */

    const initExpertsBullets = function (swiper) {
        // Пагинация слайдера
        const bullets = swiper.el.querySelectorAll('.slider-experts__pages__bullet');

        bullets.forEach(function(page){
            const htmlPhoto = '<div class="slider-experts__pages__photo"></div>';
            const htmlTimer = '<div class="slider-experts__pages__timer"></div>';
            page.innerHTML = htmlPhoto + htmlTimer;
        });

        // Отрисовка фотографий на пагинации
        const photos = swiper.el.querySelectorAll('.slider-experts__pages__photo');

        for (let i = 0; i < swiper.slides.length; i++) {
            const slide = swiper.slides[i];
            const photo = slide.querySelector('.card-expert__photo__img');
            const fullPath = photo.dataset.srcset;
            const path = fullPath.slice(0, fullPath.indexOf(' '));
            const bullet = photos[i];
            bullet.style.backgroundImage = 'url(' + path + ')';

            if (currentLocation && slide.dataset && slide.dataset.location) {
                if (currentLocation !== slide.dataset.location) {
                    bullet.closest('.slider-experts__pages__bullet').style.display = 'none';
                } else {
                    bullet.closest('.slider-experts__pages__bullet').style.display = 'block';
                }
            }
        }
    };

    /* ==========================================================================
     Slider Experts Change Location
     ========================================================================== */

    const changeLocation = function (swiper) {
        const currentSlide = swiper.slides[swiper.activeIndex];
        const location = currentSlide ? currentSlide.dataset.location : null;

        if (location) {
            if (currentLocation === '' || currentLocation !== location) {
                currentLocation = location;

                // remove last active class
                const lastActiveLocationEl = expertLocationsElement.querySelector('.item.is-active');
                lastActiveLocationEl.classList.remove('is-active');

                // set active class
                const currentLocationEl = expertLocationsElement.querySelector('[data-location=' + currentLocation + ']');
                currentLocationEl.classList.add('is-active');

                initExpertsBullets(swiper);
            }
        }
    };

    /* ==========================================================================
     Slider Experts
     ========================================================================== */

    const swiperExpertsOption = {
        observer: true,
        ObserveParents: true,
        loop: false,
        speed: 1000,
        slidesPerView: 1,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.slider-experts__pages',
            bulletElement: 'li',
            bulletClass: 'slider-experts__pages__bullet',
            bulletActiveClass: 'is-active',
            clickable: true,
        },
        navigation: {
            nextEl: '.slider-experts .slider-experts__next',
            prevEl: '.slider-experts .slider-experts__prev',
        },
        breakpoints: {
            // when window width is >= 1080px
            1080: {
                slidesPerView: 'auto',
                spaceBetween: 0
            },
        },
        on: {
            init: function (swiper) {
                // Fix lazysizes
                const imgs = swiper.el.querySelectorAll('img');

                imgs.forEach(function(img) {
                    img.classList.remove('lazyload');
                    img.classList.add('lazyload');
                });

                initExpertsBullets(swiper);
                changeLocation(swiper);
            },
            observerUpdate: function (swiper) {
                initExpertsBullets(swiper);
                const index = +swiper.el.dataset.count;
                swipersExperts[index].slideTo(0);
                changeLocation(swiper);
            },
            slideChange: function (swiper) {
                changeLocation(swiper);
            },
        },
    };

    const slidersExperts = document.querySelectorAll('.slider-experts');
    const swipersExperts = [];

    slidersExperts.forEach(function(slider, index) {
        const className = 'slider-experts_' + index;
        slider.classList.add(className);
        slider.dataset.count = index;
        swipersExperts[index] = new Swiper('.'+ className, swiperExpertsOption);
    });

    /* ==========================================================================
     Experts Location Click
     ========================================================================== */

    function getChildIndex(node) {
        return Array.prototype.indexOf.call(node.parentNode.children, node);
    }

    // location click
    document.addEventListener('click', function (event) {
        const item = event.target.closest('.item[data-location]');

        if (item) {
            const { location } = item.dataset;
            const targetSlide = document.querySelector('.swiper-slide[data-location=' + location + ']')
            const targetIndex = getChildIndex(targetSlide);
            swipersExperts[swipersExperts.length - 1].slideTo(targetIndex);
        }
    });


    /* ==========================================================================
     Tabs Experts
     ========================================================================== */

    $('.nav-inline__button').each(function(index){
        const button = $(this);

        button.click(function(){
            if (!button.hasClass('is-active')) {
                $('.nav-inline__button.is-active').removeClass('is-active');
                button.addClass('is-active');
                $('.section-experts__tab.is-active').removeClass('is-active');
                $('.section-experts__tab').eq(index).addClass('is-active');
                swipersExperts[index].destroy();
                setTimeout(function(){
                    swipersExperts[index] = new Swiper('.' + 'slider-experts_' + index, swiperExpertsOption);
                }, 0)
            }
        });
    });

    /* ==========================================================================
     Masonry
     ========================================================================== */

    if (window.matchMedia('(min-width: 601px)').matches) {
        function resizeGridItem(item){
            grid = document.getElementsByClassName("grid-masonry")[0];
            rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            rowSpan = Math.ceil((item.querySelector('.article-preview__in').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
            item.style.gridRowEnd = "span "+rowSpan;
        }

        function resizeAllGridItems(){
            allItems = document.getElementsByClassName("article-preview");
            for(x=0;x<allItems.length;x++){
                resizeGridItem(allItems[x]);
            }
        }

        function resizeInstance(instance){
            item = instance.elements[0];
            resizeGridItem(item);
        }

        window.onload = resizeAllGridItems();
        window.addEventListener("resize", resizeAllGridItems);

        allItems = document.getElementsByClassName("article-preview");
        for(x=0;x<allItems.length;x++){
            imagesLoaded( allItems[x], resizeInstance);
        }
    }

    /* ==========================================================================
        Section About
     ========================================================================== */

    (function () {

        if (window.matchMedia('(min-width: 1080px)').matches) {

            let lastScrollTop = 0;
            const section = document.querySelector('.section-about');
            const sectionIn = section.querySelector('.section-about__out');
            const sectionContent = section.querySelector('.section-about__in');
            const duration = 700;
            const quiet = 500;
            let lastAnimation = 0;
            const gap = 2;
            const animatedFlags = [true, true];

            if (sectionContent.getBoundingClientRect().height + 200 > window.innerHeight) {
                const padding = (sectionContent.getBoundingClientRect().height + 200 - window.innerHeight) / 2;
                section.style.paddingTop = padding - 60 + 'px';
                section.style.paddingBottom = padding + '10px';
            }

            const scrollSection = function (animatedFlag, scrollTopValue) {
                animatedFlag = false;

                $('html,body').animate({
                    scrollTop: scrollTopValue
                }, duration);

                setTimeout(function () {
                    animatedFlag = true;
                }, duration)
            };

            const setSectionClass = function (coef, index) {
                for (let j = 0; j <= animatedFlags.length; j++) {
                    if (j !== index) {
                        sectionIn.classList.remove('is-animated-' + (j + coef));
                    }
                }
                sectionIn.classList.add('is-animated-' + (index + coef));
            };

            const windowScrollHandle = function(){ // or window.addEventListener("scroll"....
                const st = window.pageYOffset || document.documentElement.scrollTop;
                const sectionInPosition = sectionIn.getBoundingClientRect();
                const isScrollDown = st > lastScrollTop;
                const isScrollUp = !isScrollDown;

                const scrollEvent = function (index) {
                    const currentGap = (index === 0) ? 0 : gap;

                    if (
                        (sectionInPosition.top + window.innerHeight * index + currentGap <= 0) &&
                        (sectionInPosition.top + window.innerHeight * (index + 1) >= 0)
                    ) {
                        if (animatedFlags[index]) {
                            const timeNow = new Date().getTime();

                            if (timeNow - lastAnimation >= quiet + duration) {
                                if (isScrollDown) {
                                    setSectionClass(index, 2);
                                    scrollSection(
                                        animatedFlags[index],
                                        section.offsetTop + sectionIn.offsetTop + window.innerHeight * (index + 1)
                                    );
                                } else {
                                    setSectionClass(index, 1);
                                    scrollSection(
                                        animatedFlags[index],
                                        section.offsetTop + sectionIn.offsetTop + window.innerHeight * index + currentGap
                                    );
                                }

                                lastAnimation = timeNow;
                            }
                        }
                    } else {
                        animatedFlags[index] = true;
                    }
                };

                for (let i = 0; i < animatedFlags.length; i++) {
                    scrollEvent(i);
                }

                lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
            };

            window.addEventListener("scroll", windowScrollHandle, false);

            windowScrollHandle();

        }

    })();

    /* ======================================================================== */
});

/* ==========================================================================
    Google Map
 ========================================================================== */

function initMap() {
    const styles = [
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        }
    ];

    let centerCoords;

    if (window.matchMedia('(min-width: 768px)').matches) {
        centerCoords = { lat: 25.20750260703014, lng: 55.15687516874079 };
    } else {
        centerCoords = { lat: 25.166775088648198, lng: 55.21894313872452 };
    }

    // создать карту
    const map = new google.maps.Map(document.getElementById("gmap"), {
        center: centerCoords,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: styles,
    });

    // пусть к иконкам
    const iconBase = "../_asset/img/";
    // типы иконок
    const icons = {
        pin: {
            icon: iconBase + "pin.svg",
            iconActive: iconBase + "pin-active.svg",
        },
    };
    // список меток
    const locations = [
        {
            position: { lat: 25.134023490889906, lng: 55.190409522191715 },
        },
        {
            position: { lat: 25.166775088648198, lng: 55.21894313872452 },
        },
        {
            position: { lat: 25.2104302045315, lng: 55.25188917018509 },
        },
    ];

    // слайдер
    const sliderMap = document.querySelector('.slider-map');
    const currentSlideEl = sliderMap.querySelector('[data-current]');
    const totalSlideEl = sliderMap.querySelector('[data-total]');
    const setCurrentIndexSlider = function (current) {
        currentSlideEl.textContent = current;
    };
    const setTotalIndexSlider = function (total) {
        totalSlideEl.textContent = total;
    };

    const swiperMap = new Swiper('.slider-map', {
        loop: false,
        navigation: {
            nextEl: '.slider-map .slider-arr_next',
            prevEl: '.slider-map .slider-arr_prev',
        },
        on: {
            init: function (swiper) {
                const totalIndex = swiper.slides.length;
                setCurrentIndexSlider(1);
                setTotalIndexSlider(totalIndex);
            },
            slideChange: function (swiper) {
                const currentIndex = swiper.activeIndex + 1;
                setCurrentIndexSlider(currentIndex);
            },
        },
    });

    // Fix lazysizes
    const sliderImgs = sliderMap.querySelectorAll('.slider-map__slide__photo img');
    sliderImgs.forEach(function(img){
        img.classList.remove('lazyload');
        img.classList.add('lazyload');
    });

    // текущая активная метка
    let currentMarker;

    // сменить активную метку
    const setActiveMarker = function (marker, index) {
        currentMarker.setIcon(icons.pin.icon);
        currentMarker = marker;

        marker.setIcon(icons.pin.iconActive);
        swiperMap.slideTo(index);
    };

    // создание меток из списка транспорта
    for (let i = 0; i < locations.length; i++) {
        locations[i].object = new google.maps.Marker({
            position: locations[i].position,
            icon: icons.pin.icon,
            map: map,
        });

        if (i === 0) {
            currentMarker = locations[i].object;
            currentMarker.setIcon(icons.pin.iconActive);
        }

        locations[i].object.addListener("click", function () {
            setActiveMarker(this, i);
        });
    }

    // события слайдера
    swiperMap.on('slideChange', function (swiper) {
        const index = swiper.activeIndex;
        const marker = locations[index].object;
        setActiveMarker(marker, index);
    });

}








