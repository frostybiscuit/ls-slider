/*
  TODO - fix indicator scroll animation
  //TODO - fix infinite scroll on mobile
  TODO - add visible slides functionality
  TODO - consider accessibility
  TODO - code cleanup
  TODO - setup package.json
*/

type SliderOptions = {
  visibleSlides?: number;
  startingIndex?: number;
  sliderElementClass?: string;
  touchControls?: boolean;
  autoSlide?: boolean;
  interval?: number;
  direction?: SlideDirection;
  previousButton?: string;
  nextButton?: string;
  infinite?: boolean;
  indicators?: boolean;
};

enum SlideDirection {
  Left = "left",
  Right = "right"
}

export class Slider {
  private slider: HTMLElement | Element | null;
  private slide!: HTMLUListElement | Element | null;
  private previousButton!: HTMLButtonElement | null | undefined;
  private nextButton!: HTMLButtonElement | null | undefined;
  private sliderElements: HTMLCollection | NodeListOf<HTMLLIElement> | undefined;
  private indicatorWrapper!: HTMLUListElement | Element | null;
  private options: SliderOptions;
  private interval: number | undefined;
  private currentIndex: number = 0;
  private previousIndex: number = 0;
  private isTouchDevice: boolean;
  private isHoldingTouch: boolean = false;
  private previousScrollPosition: number | undefined = 0;

  private readonly CLASS_PREFIX = "ls-";
  private readonly SLIDER_CLASS = `${this.CLASS_PREFIX}slider`;
  private readonly SLIDER_SLIDE_CLASS = `${this.CLASS_PREFIX}slide`;
  private readonly SLIDER_PREVIOUS_BUTTON_CLASS = `${this.CLASS_PREFIX}previous-button`;
  private readonly SLIDER_NEXT_BUTTON_CLASS = `${this.CLASS_PREFIX}next-button`;
  private readonly SLIDER_ELEMENT_CLASS = `${this.CLASS_PREFIX}element`;
  private readonly SLIDER_ELEMENT_ACTIVE_CLASS = `${this.CLASS_PREFIX}active`;
  private readonly SLIDER_INDICATOR_WRAPPER_CLASS = `${this.CLASS_PREFIX}indicator-wrapper`;
  private readonly SLIDER_INDICATOR_CLASS = `${this.CLASS_PREFIX}indicator`;
  private readonly SLIDER_INDICATOR_ACTIVE_CLASS = `${this.CLASS_PREFIX}active`;
  private readonly SLIDER_INITIALIZED_CLASS = `${this.CLASS_PREFIX}initialized`;
  private readonly SLIDER_INITIALIZED_EVENT = `${this.CLASS_PREFIX}initialized`;
  private readonly SLIDER_SLIDE_END_EVENT = `${this.CLASS_PREFIX}slideend`;
  private readonly SLIDER_SWIPE_END_EVENT = `${this.CLASS_PREFIX}swipeend`;
  private readonly SLIDER_TOUCH_CONTROLS_CLASS = `${this.CLASS_PREFIX}touch-controls`;
  private readonly OBSERVER_COLLIDER_CLASS = `${this.CLASS_PREFIX}observer-collider`;
  private readonly DEFAULT_OPTIONS: SliderOptions = {
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

  constructor(target: HTMLElement | null, options: SliderOptions = {}) {
    this.slider = target;
    this.sliderElements = this.slider?.querySelectorAll(":scope > *");
    this.isTouchDevice = this.checkIfTouchDevice();
    this.options = this.DEFAULT_OPTIONS;
    Object.assign(this.options, options);

    if (target) {
      this.applyOptions();
      this.buildMarkup();
      this.setInitializedState();
    }
  }

  private applyOptions(): void {
    if (this.options.touchControls) {
      this.slider?.classList.add(this.SLIDER_TOUCH_CONTROLS_CLASS);
    }
    if (this.options.autoSlide) {
      this.interval = setInterval(() => {
        this.options.direction === SlideDirection.Left ? this.slidePrev() : this.slideNext();
      }, this.options.interval);
    }
  }

  private checkIfTouchDevice(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  private buildMarkup(): void {
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
      this.slider?.insertAdjacentElement("afterbegin", slide);
      this.slide = slide;
      this.sliderElements = this.slide.children;

      if (this.options.infinite) {
        this.slide?.insertAdjacentElement("afterbegin", this.sliderElements?.[this.sliderElements.length - 1] as Element);
        this.slider?.addEventListener(this.SLIDER_INITIALIZED_EVENT, () => {
          this.slideTo(0, SlideDirection.Right);
        });
      }

      this.initSliderEvents();
      this.buildArrows();
      this.buildIndicators();
      this.initTouchControlsObserver();
    }
  }

  private initSliderEvents(): void {
    let debounce: number;
    this.slide?.addEventListener("scroll", () => {
      if (debounce) {
        clearTimeout(debounce);
      }
      debounce = setTimeout(() => {
        this.slider?.dispatchEvent(new Event(this.SLIDER_SLIDE_END_EVENT));
        this.previousScrollPosition = this.slide?.scrollLeft;
      }, 100);
    });

    this.slider?.addEventListener("touchstart", () => {
      this.isHoldingTouch = true;
    });
    this.slider?.addEventListener("touchend", () => {
      this.isHoldingTouch = false;
    });
  }

  private buildArrows(): void {
    const tempElement = document.createElement("div");

    tempElement.innerHTML = this.options.previousButton as string;
    this.slider?.insertAdjacentElement("afterbegin", tempElement.firstChild as Element);
    this.previousButton = this.slider?.querySelector(`.${this.SLIDER_PREVIOUS_BUTTON_CLASS}`);

    tempElement.innerHTML = this.options.nextButton as string;
    this.slider?.insertAdjacentElement("beforeend", tempElement.firstChild as Element);
    this.nextButton = this.slider?.querySelector(`.${this.SLIDER_NEXT_BUTTON_CLASS}`);

    this.initButtonEvents();
  }

  private initButtonEvents(): void {
    this.previousButton?.addEventListener("click", () => {
      this.slidePrev();
      if (this.interval) {
        clearInterval(this.interval);
      }
    });
    this.nextButton?.addEventListener("click", () => {
      this.slideNext();
      if (this.interval) {
        clearInterval(this.interval);
      }
    });
  }

  private buildIndicators(): void {
    if (this.options.indicators && this.sliderElements !== undefined) {
      const indicatorWrapper = document.createElement("ul");
      indicatorWrapper.classList.add(this.SLIDER_INDICATOR_WRAPPER_CLASS);
      for (let index = 0; index < this.sliderElements?.length; index++) {
        const indicator = document.createElement("li");
        indicator.classList.add(this.SLIDER_INDICATOR_CLASS);
        indicator.dataset.index = index.toString();
        if (index === this.currentIndex) {
          indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
        }
        indicatorWrapper.appendChild(indicator);
      }
      this.slider?.insertAdjacentElement("beforeend", indicatorWrapper);
      this.indicatorWrapper = indicatorWrapper;

      this.initIndicatorEvents();
    }
  }

  private initIndicatorEvents(): void {
    const indicators: HTMLCollectionOf<HTMLLIElement> | undefined = this.indicatorWrapper?.children as HTMLCollectionOf<HTMLLIElement>;
    if (indicators) {
      for (const indicator of indicators) {
        indicator.addEventListener("click", () => {
          if (indicator.dataset.index) {
            this.setSlide(parseInt(indicator.dataset.index));
          }
        });
      }

      this.slider?.addEventListener(this.SLIDER_SWIPE_END_EVENT, () => {
        for (const indicator of indicators) {
          if (indicator.dataset.index && parseInt(indicator.dataset.index) === this.currentIndex) {
            indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
          } else {
            indicator.classList.remove(this.SLIDER_INDICATOR_ACTIVE_CLASS);
          }
        }
      });
    }
  }

  private initTouchControlsObserver(): void {
    if (this.options.touchControls && this.isTouchDevice) {
      let initial = true;
      let debounce: number;
      const observer = new IntersectionObserver(entries => {
        if (initial) {
          initial = false;
          return false;
        }
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const slideElement: HTMLLIElement | null = entry.target.closest(`.${this.SLIDER_ELEMENT_CLASS}`);
            if (debounce) {
              clearTimeout(debounce);
            }
            debounce = setTimeout(() => {
              if (slideElement !== null && slideElement.dataset.index !== undefined) {
                this.previousIndex = this.currentIndex;
                this.currentIndex = parseInt(slideElement.dataset.index);
                this.slider?.dispatchEvent(new Event(this.SLIDER_SWIPE_END_EVENT));
                //!PLAYGROUND START
                if (this.options.infinite && this.isTouchDevice) {
                  this.slider?.addEventListener(
                    this.SLIDER_SLIDE_END_EVENT,
                    () => {
                      if (this.isHoldingTouch) {
                        return false;
                      }
                      const direction: SlideDirection = this.previousScrollPosition && this.slide && this.previousScrollPosition < this.slide?.scrollLeft ? SlideDirection.Right : SlideDirection.Left;
                      this.slideTo(this.currentIndex, direction);
                    },
                    { once: true }
                  );
                }
                //!PLAYGROUND END
              }
            }, 100);
          }
        });
      });

      this.slider?.addEventListener(this.SLIDER_INITIALIZED_EVENT, () => {
        this.slide?.querySelectorAll(`.${this.OBSERVER_COLLIDER_CLASS}`)?.forEach(element => {
          observer.observe(element);
        });
      });
    }
  }

  private setInitializedState() {
    if (this.sliderElements !== undefined) {
      const images: NodeListOf<HTMLImageElement> | undefined = this.slide?.querySelectorAll("img");
      const amountOfImages = images?.length;
      let imagesLoaded = 0;
      images?.forEach(image => {
        if (image.complete) {
          imagesLoaded++;
        } else {
          image.addEventListener("load", () => {
            imagesLoaded++;
            if (imagesLoaded === amountOfImages) {
              this.slider?.classList.add(this.SLIDER_CLASS, this.SLIDER_INITIALIZED_CLASS);
              this.slider?.dispatchEvent(new Event(this.SLIDER_INITIALIZED_EVENT));
            }
          });
        }
      });
    }
  }

  private slideNext(): void {
    this.previousIndex = this.currentIndex;
    if (this.currentIndex === (this.sliderElements?.length ?? 1) - 1) {
      if (this.options.infinite) {
        this.currentIndex = 0;
      } else {
        this.nextButton && (this.nextButton.disabled = true);
      }
    } else {
      this.previousButton && !this.options.infinite && (this.previousButton.disabled = false);
      this.currentIndex++;
    }
    this.slideTo(this.currentIndex, SlideDirection.Right);
  }

  private slidePrev(): void {
    this.previousIndex = this.currentIndex;
    if (this.currentIndex === 0) {
      if (this.options.infinite) {
        this.currentIndex = (this.sliderElements?.length ?? 1) - 1;
      } else {
        this.previousButton && (this.previousButton.disabled = true);
      }
    } else {
      this.nextButton && !this.options.infinite && (this.nextButton.disabled = false);
      this.currentIndex--;
    }
    this.slideTo(this.currentIndex, SlideDirection.Left);
  }

  private setSlide(index: number): void {
    let direction: SlideDirection = this.previousScrollPosition && this.slide && this.previousScrollPosition < this.slide?.scrollLeft ? SlideDirection.Right : SlideDirection.Left;
    if (this.previousIndex + 1 === this.sliderElements?.length && index === 0) {
      direction = SlideDirection.Right;
    } else if (this.previousIndex === 0 && index + 1 === this.sliderElements?.length) {
      direction = SlideDirection.Left;
    }
    this.previousIndex = this.currentIndex;
    this.currentIndex = index;
    this.slideTo(this.currentIndex, direction);
  }

  private slideTo(index: number, slideDirection: SlideDirection): void {
    if (this.sliderElements !== undefined) {
      for (const element of this.sliderElements) {
        element.classList.remove(this.SLIDER_ELEMENT_ACTIVE_CLASS);
      }

      if (this.options.infinite) {
        if ((slideDirection === SlideDirection.Right && this.previousIndex < index) || (index === 0 && this.previousIndex === this.sliderElements.length - 1)) {
          this.slide?.insertAdjacentElement("beforeend", this.sliderElements?.[0] as Element);
        } else if ((slideDirection === SlideDirection.Left && this.previousIndex > index) || (index === this.sliderElements.length - 1 && this.previousIndex === 0)) {
          this.slide?.insertAdjacentElement("afterbegin", this.sliderElements?.[this.sliderElements.length - 1] as Element);
        }
      }

      if (this.options.indicators) {
        const indicators: HTMLCollectionOf<HTMLLIElement> | undefined = this.indicatorWrapper?.children as HTMLCollectionOf<HTMLLIElement>;
        if (indicators !== undefined) {
          for (const indicator of indicators) {
            if (indicator.dataset.index && parseInt(indicator.dataset.index) === this.currentIndex) {
              indicator.classList.add(this.SLIDER_INDICATOR_ACTIVE_CLASS);
            } else {
              indicator.classList.remove(this.SLIDER_INDICATOR_ACTIVE_CLASS);
            }
          }
        }
      }

      const targetSlide = this.slide?.querySelector(`.${this.SLIDER_ELEMENT_CLASS}[data-index="${index}"]`);
      requestAnimationFrame(() => {
        targetSlide?.scrollIntoView();
        targetSlide?.classList.add(this.SLIDER_ELEMENT_ACTIVE_CLASS);
      });
    }
  }
}
