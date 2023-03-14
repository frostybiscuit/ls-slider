/*
  TODO - fix indicator scroll animation
  //TODO - fix infinite scroll on mobile
  TODO - add visible slides functionality
  TODO - consider accessibility
  TODO - code cleanup
  TODO - setup package.json
*/
var SlideDirection;
(function (SlideDirection) {
    SlideDirection["Left"] = "left";
    SlideDirection["Right"] = "right";
})(SlideDirection || (SlideDirection = {}));
export class Slider {
    constructor(target, options = {}) {
        var _a;
        this.currentIndex = 0;
        this.previousIndex = 0;
        this.isHoldingTouch = false;
        this.previousScrollPosition = 0;
        this.CLASS_PREFIX = "ls-";
        this.SLIDER_CLASS = `${this.CLASS_PREFIX}slider`;
        this.SLIDER_SLIDE_CLASS = `${this.CLASS_PREFIX}slide`;
        this.SLIDER_PREVIOUS_BUTTON_CLASS = `${this.CLASS_PREFIX}previous-button`;
        this.SLIDER_NEXT_BUTTON_CLASS = `${this.CLASS_PREFIX}next-button`;
        this.SLIDER_ELEMENT_CLASS = `${this.CLASS_PREFIX}element`;
        this.SLIDER_ELEMENT_ACTIVE_CLASS = `${this.CLASS_PREFIX}active`;
        this.SLIDER_INDICATOR_WRAPPER_CLASS = `${this.CLASS_PREFIX}indicator-wrapper`;
        this.SLIDER_INDICATOR_CLASS = `${this.CLASS_PREFIX}indicator`;
        this.SLIDER_INDICATOR_ACTIVE_CLASS = `${this.CLASS_PREFIX}active`;
        this.SLIDER_INITIALIZED_CLASS = `${this.CLASS_PREFIX}initialized`;
        this.SLIDER_INITIALIZED_EVENT = `${this.CLASS_PREFIX}initialized`;
        this.SLIDER_SLIDE_END_EVENT = `${this.CLASS_PREFIX}slideend`;
        this.SLIDER_SWIPE_END_EVENT = `${this.CLASS_PREFIX}swipeend`;
        this.SLIDER_TOUCH_CONTROLS_CLASS = `${this.CLASS_PREFIX}touch-controls`;
        this.OBSERVER_COLLIDER_CLASS = `${this.CLASS_PREFIX}observer-collider`;
        this.DEFAULT_OPTIONS = {
            visibleSlides: 1,
            startingIndex: 0,
            sliderElementClass: "",
            touchControls: true,
            autoSlide: false,
            interval: 5000,
            direction: SlideDirection.Right,
            previousButton: `<button class="${this.SLIDER_PREVIOUS_BUTTON_CLASS}"></button>`,
            nextButton: `<button class="${this.SLIDER_NEXT_BUTTON_CLASS}"></button>`,
            infinite: false,
            indicators: true
        };
        this.slider = target;
        this.sliderElements = (_a = this.slider) === null || _a === void 0 ? void 0 : _a.querySelectorAll(":scope > *");
        this.isTouchDevice = this.checkIfTouchDevice();
        this.options = this.DEFAULT_OPTIONS;
        Object.assign(this.options, options);
        if (target) {
            this.applyOptions();
            this.buildMarkup();
            this.setInitializedState();
        }
    }
    applyOptions() {
        var _a;
        if (this.options.touchControls) {
            (_a = this.slider) === null || _a === void 0 ? void 0 : _a.classList.add(this.SLIDER_TOUCH_CONTROLS_CLASS);
        }
        if (this.options.autoSlide) {
            this.interval = setInterval(() => {
                this.options.direction === SlideDirection.Left ? this.slidePrev() : this.slideNext();
            }, this.options.interval);
        }
    }
    checkIfTouchDevice() {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
    buildMarkup() {
        var _a, _b, _c, _d;
        if (this.sliderElements !== undefined) {
            const slide = document.createElement("ul");
            slide.classList.add(this.SLIDER_SLIDE_CLASS);
            let index = 0;
            for (const element of this.sliderElements) {
                const wrapper = document.createElement("li");
                wrapper.className = `${this.SLIDER_ELEMENT_CLASS} ${this.options.sliderElementClass}`;
                wrapper.dataset.index = `${index}`;
                if (index === this.options.startingIndex) {
                    wrapper.classList.add(this.SLIDER_ELEMENT_ACTIVE_CLASS);
                }
                wrapper.appendChild(element);
                if (this.options.touchControls) {
                    const observerCollider = document.createElement("div");
                    observerCollider.classList.add(this.OBSERVER_COLLIDER_CLASS);
                    wrapper.appendChild(observerCollider);
                }
                slide.insertAdjacentElement("beforeend", wrapper);
                index++;
            }
            (_a = this.slider) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("afterbegin", slide);
            this.slide = slide;
            this.sliderElements = this.slide.children;
            if (this.options.infinite) {
                (_b = this.slide) === null || _b === void 0 ? void 0 : _b.insertAdjacentElement("afterbegin", (_c = this.sliderElements) === null || _c === void 0 ? void 0 : _c[this.sliderElements.length - 1]);
                (_d = this.slider) === null || _d === void 0 ? void 0 : _d.addEventListener(this.SLIDER_INITIALIZED_EVENT, () => {
                    this.slideTo(0, SlideDirection.Right);
                });
            }
            this.initSliderEvents();
            this.buildArrows();
            this.buildIndicators();
            this.initTouchControlsObserver();
        }
    }
    initSliderEvents() {
        var _a, _b, _c;
        let debounce;
        (_a = this.slide) === null || _a === void 0 ? void 0 : _a.addEventListener("scroll", () => {
            if (debounce) {
                clearTimeout(debounce);
            }
            debounce = setTimeout(() => {
                var _a, _b;
                (_a = this.slider) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event(this.SLIDER_SLIDE_END_EVENT));
                this.previousScrollPosition = (_b = this.slide) === null || _b === void 0 ? void 0 : _b.scrollLeft;
            }, 100);
        });
        (_b = this.slider) === null || _b === void 0 ? void 0 : _b.addEventListener("touchstart", () => {
            this.isHoldingTouch = true;
        });
        (_c = this.slider) === null || _c === void 0 ? void 0 : _c.addEventListener("touchend", () => {
            this.isHoldingTouch = false;
        });
    }
    buildArrows() {
        var _a, _b, _c, _d;
        const tempElement = document.createElement("div");
        tempElement.innerHTML = this.options.previousButton;
        (_a = this.slider) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("afterbegin", tempElement.firstChild);
        this.previousButton = (_b = this.slider) === null || _b === void 0 ? void 0 : _b.querySelector(`.${this.SLIDER_PREVIOUS_BUTTON_CLASS}`);
        tempElement.innerHTML = this.options.nextButton;
        (_c = this.slider) === null || _c === void 0 ? void 0 : _c.insertAdjacentElement("beforeend", tempElement.firstChild);
        this.nextButton = (_d = this.slider) === null || _d === void 0 ? void 0 : _d.querySelector(`.${this.SLIDER_NEXT_BUTTON_CLASS}`);
        this.initButtonEvents();
    }
    initButtonEvents() {
        var _a, _b;
        (_a = this.previousButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.slidePrev();
            if (this.interval) {
                clearInterval(this.interval);
            }
        });
        (_b = this.nextButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            this.slideNext();
            if (this.interval) {
                clearInterval(this.interval);
            }
        });
    }
    buildIndicators() {
        var _a, _b;
        if (this.options.indicators && this.sliderElements !== undefined) {
            const indicatorWrapper = document.createElement("ul");
            indicatorWrapper.classList.add(this.SLIDER_INDICATOR_WRAPPER_CLASS);
            for (let index = 0; index < ((_a = this.sliderElements) === null || _a === void 0 ? void 0 : _a.length); index++) {
                const indicator = document.createElement("li");
                indicator.classList.add(this.SLIDER_INDICATOR_CLASS);
                indicator.dataset.index = index.toString();
                if (index === this.currentIndex) {
                    indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
                }
                indicatorWrapper.appendChild(indicator);
            }
            (_b = this.slider) === null || _b === void 0 ? void 0 : _b.insertAdjacentElement("beforeend", indicatorWrapper);
            this.indicatorWrapper = indicatorWrapper;
            this.initIndicatorEvents();
        }
    }
    initIndicatorEvents() {
        var _a, _b;
        const indicators = (_a = this.indicatorWrapper) === null || _a === void 0 ? void 0 : _a.children;
        if (indicators) {
            for (const indicator of indicators) {
                indicator.addEventListener("click", () => {
                    if (indicator.dataset.index) {
                        this.setSlide(parseInt(indicator.dataset.index));
                    }
                });
            }
            (_b = this.slider) === null || _b === void 0 ? void 0 : _b.addEventListener(this.SLIDER_SWIPE_END_EVENT, () => {
                for (const indicator of indicators) {
                    if (indicator.dataset.index && parseInt(indicator.dataset.index) === this.currentIndex) {
                        indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
                    }
                    else {
                        indicator.classList.remove(this.SLIDER_INDICATOR_ACTIVE_CLASS);
                    }
                }
            });
        }
    }
    initTouchControlsObserver() {
        var _a;
        if (this.options.touchControls && this.isTouchDevice) {
            let initial = true;
            let debounce;
            const observer = new IntersectionObserver(entries => {
                if (initial) {
                    initial = false;
                    return false;
                }
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const slideElement = entry.target.closest(`.${this.SLIDER_ELEMENT_CLASS}`);
                        if (debounce) {
                            clearTimeout(debounce);
                        }
                        debounce = setTimeout(() => {
                            var _a, _b;
                            if (slideElement !== null && slideElement.dataset.index !== undefined) {
                                this.previousIndex = this.currentIndex;
                                this.currentIndex = parseInt(slideElement.dataset.index);
                                (_a = this.slider) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event(this.SLIDER_SWIPE_END_EVENT));
                                //!PLAYGROUND START
                                if (this.options.infinite && this.isTouchDevice) {
                                    (_b = this.slider) === null || _b === void 0 ? void 0 : _b.addEventListener(this.SLIDER_SLIDE_END_EVENT, () => {
                                        var _a;
                                        if (this.isHoldingTouch) {
                                            return false;
                                        }
                                        const direction = this.previousScrollPosition && this.slide && this.previousScrollPosition < ((_a = this.slide) === null || _a === void 0 ? void 0 : _a.scrollLeft) ? SlideDirection.Right : SlideDirection.Left;
                                        this.slideTo(this.currentIndex, direction);
                                    }, { once: true });
                                }
                                //!PLAYGROUND END
                            }
                        }, 100);
                    }
                });
            });
            (_a = this.slider) === null || _a === void 0 ? void 0 : _a.addEventListener(this.SLIDER_INITIALIZED_EVENT, () => {
                var _a, _b;
                (_b = (_a = this.slide) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`.${this.OBSERVER_COLLIDER_CLASS}`)) === null || _b === void 0 ? void 0 : _b.forEach(element => {
                    observer.observe(element);
                });
            });
        }
    }
    setInitializedState() {
        var _a;
        if (this.sliderElements !== undefined) {
            const images = (_a = this.slide) === null || _a === void 0 ? void 0 : _a.querySelectorAll("img");
            const amountOfImages = images === null || images === void 0 ? void 0 : images.length;
            let imagesLoaded = 0;
            images === null || images === void 0 ? void 0 : images.forEach(image => {
                if (image.complete) {
                    imagesLoaded++;
                }
                else {
                    image.addEventListener("load", () => {
                        var _a, _b;
                        imagesLoaded++;
                        if (imagesLoaded === amountOfImages) {
                            (_a = this.slider) === null || _a === void 0 ? void 0 : _a.classList.add(this.SLIDER_CLASS, this.SLIDER_INITIALIZED_CLASS);
                            (_b = this.slider) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event(this.SLIDER_INITIALIZED_EVENT));
                        }
                    });
                }
            });
        }
    }
    slideNext() {
        var _a, _b;
        this.previousIndex = this.currentIndex;
        if (this.currentIndex === ((_b = (_a = this.sliderElements) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 1) - 1) {
            if (this.options.infinite) {
                this.currentIndex = 0;
            }
            else {
                this.nextButton && (this.nextButton.disabled = true);
            }
        }
        else {
            this.previousButton && !this.options.infinite && (this.previousButton.disabled = false);
            this.currentIndex++;
        }
        this.slideTo(this.currentIndex, SlideDirection.Right);
    }
    slidePrev() {
        var _a, _b;
        this.previousIndex = this.currentIndex;
        if (this.currentIndex === 0) {
            if (this.options.infinite) {
                this.currentIndex = ((_b = (_a = this.sliderElements) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 1) - 1;
            }
            else {
                this.previousButton && (this.previousButton.disabled = true);
            }
        }
        else {
            this.nextButton && !this.options.infinite && (this.nextButton.disabled = false);
            this.currentIndex--;
        }
        this.slideTo(this.currentIndex, SlideDirection.Left);
    }
    setSlide(index) {
        var _a, _b, _c;
        let direction = this.previousScrollPosition && this.slide && this.previousScrollPosition < ((_a = this.slide) === null || _a === void 0 ? void 0 : _a.scrollLeft) ? SlideDirection.Right : SlideDirection.Left;
        if (this.previousIndex + 1 === ((_b = this.sliderElements) === null || _b === void 0 ? void 0 : _b.length) && index === 0) {
            direction = SlideDirection.Right;
        }
        else if (this.previousIndex === 0 && index + 1 === ((_c = this.sliderElements) === null || _c === void 0 ? void 0 : _c.length)) {
            direction = SlideDirection.Left;
        }
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;
        this.slideTo(this.currentIndex, direction);
    }
    slideTo(index, slideDirection) {
        var _a, _b, _c, _d, _e, _f;
        if (this.sliderElements !== undefined) {
            for (const element of this.sliderElements) {
                element.classList.remove(this.SLIDER_ELEMENT_ACTIVE_CLASS);
            }
            if (this.options.infinite) {
                if ((slideDirection === SlideDirection.Right && this.previousIndex < index) || (index === 0 && this.previousIndex === this.sliderElements.length - 1)) {
                    (_a = this.slide) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("beforeend", (_b = this.sliderElements) === null || _b === void 0 ? void 0 : _b[0]);
                }
                else if ((slideDirection === SlideDirection.Left && this.previousIndex > index) || (index === this.sliderElements.length - 1 && this.previousIndex === 0)) {
                    (_c = this.slide) === null || _c === void 0 ? void 0 : _c.insertAdjacentElement("afterbegin", (_d = this.sliderElements) === null || _d === void 0 ? void 0 : _d[this.sliderElements.length - 1]);
                }
            }
            if (this.options.indicators) {
                const indicators = (_e = this.indicatorWrapper) === null || _e === void 0 ? void 0 : _e.children;
                if (indicators !== undefined) {
                    for (const indicator of indicators) {
                        if (indicator.dataset.index && parseInt(indicator.dataset.index) === this.currentIndex) {
                            indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
                        }
                        else {
                            indicator.classList.remove(this.SLIDER_INDICATOR_ACTIVE_CLASS);
                        }
                    }
                }
            }
            const targetSlide = (_f = this.slide) === null || _f === void 0 ? void 0 : _f.querySelector(`.${this.SLIDER_ELEMENT_CLASS}[data-index="${index}"]`);
            requestAnimationFrame(() => {
                targetSlide === null || targetSlide === void 0 ? void 0 : targetSlide.scrollIntoView();
                targetSlide === null || targetSlide === void 0 ? void 0 : targetSlide.classList.add(this.SLIDER_ELEMENT_ACTIVE_CLASS);
            });
        }
    }
}
//# sourceMappingURL=Slider.js.map