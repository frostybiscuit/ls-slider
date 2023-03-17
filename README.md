# ls-slider
A lightweight JS/CSS Slider with focus on native mobile touch controls

## Pre-release To-Do's
- [ ] fix indicator scroll animation
- [x] fix infinite scroll on mobile
- [ ] fix initial slide position when infinite are active
- [ ] add visible slides functionality
- [ ] consider accessibility (might be done after initial release)
- [ ] code cleanup

## Setup
ls-slider is initialized by passing the elements and options to a JS class.
For example:

```ts
import Slider from "ls-slider";

const slider = document.querySelector(".slider-element");
const options = { infinite: true };

new Slider(slider, options);
```

## Options
### visibleSlides
| Type | Default | Description |
| :--- | :--- | :--- |
| Number | 1 | The amount of slides that should be visible in the slider |

### startingIndex
| Type | Default | Description |
| :--- | :--- | :--- |
| Number | 0 | The slide index that will initially be displayed |

### sliderElementClass
| Type | Default | Description |
| :--- | :--- | :--- |
| String | "" | A class that will be added to the individual slider elements next to `ls-element` |

### touchControls
| Type | Default | Description |
| :--- | :--- | :--- |
| Boolean | true | This enables native touch controls, which allow native swiping to switch slides. This setting will only affect touch devices |

### autoSlide
| Type | Default | Description |
| :--- | :--- | :--- |
| Boolean | false | Toggle for automatic sliding |

### interval
| Type | Default | Description |
| :--- | :--- | :--- |
| Number | 5000 | Interval for the automatic sliding in **ms** |

### direction
| Type | Default | Description |
| :--- | :--- | :--- |
| SlideDirection ("left", "right") | SlideDirection.Right ("right") | The direction of the automatic slide |

### previousButton
| Type | Default | Description |
| :--- | :--- | :--- |
| String | "" | `<button class="ls-previous-button"></button>` |

### nextButton
| Type | Default | Description |
| :--- | :--- | :--- |
| String | "" | `<button class="ls-next-button"></button>` |

### infinite
| Type | Default | Description |
| :--- | :--- | :--- |
| Boolean | false | Toggle for infinite styling |

### indicators
| Type | Default | Description |
| :--- | :--- | :--- |
| Boolean | true | Toggle for indicators |
