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
declare enum SlideDirection {
    Left = "left",
    Right = "right"
}
export declare class Slider {
    private slider;
    private slide;
    private previousButton;
    private nextButton;
    private sliderElements;
    private indicatorWrapper;
    private options;
    private interval;
    private currentIndex;
    private previousIndex;
    private isTouchDevice;
    private isHoldingTouch;
    private previousScrollPosition;
    private readonly CLASS_PREFIX;
    private readonly SLIDER_CLASS;
    private readonly SLIDER_SLIDE_CLASS;
    private readonly SLIDER_PREVIOUS_BUTTON_CLASS;
    private readonly SLIDER_NEXT_BUTTON_CLASS;
    private readonly SLIDER_ELEMENT_CLASS;
    private readonly SLIDER_ELEMENT_ACTIVE_CLASS;
    private readonly SLIDER_INDICATOR_WRAPPER_CLASS;
    private readonly SLIDER_INDICATOR_CLASS;
    private readonly SLIDER_INDICATOR_ACTIVE_CLASS;
    private readonly SLIDER_INITIALIZED_CLASS;
    private readonly SLIDER_INITIALIZED_EVENT;
    private readonly SLIDER_SLIDE_END_EVENT;
    private readonly SLIDER_SWIPE_END_EVENT;
    private readonly SLIDER_TOUCH_CONTROLS_CLASS;
    private readonly OBSERVER_COLLIDER_CLASS;
    private readonly DEFAULT_OPTIONS;
    constructor(target: HTMLElement | null, options?: SliderOptions);
    private applyOptions;
    private checkIfTouchDevice;
    private buildMarkup;
    private initSliderEvents;
    private buildArrows;
    private initButtonEvents;
    private buildIndicators;
    private initIndicatorEvents;
    private initTouchControlsObserver;
    private setInitializedState;
    private slideNext;
    private slidePrev;
    private setSlide;
    private slideTo;
}
export {};
