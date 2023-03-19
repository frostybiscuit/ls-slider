# ls-slider
A lightweight JS/CSS Slider with focus on native mobile touch controls

[![NPM Version](https://badgen.net/npm/v/ls-slider)](https://www.npmjs.com/package/ls-slider)
[![NPM Install Size](https://badgen.net/packagephobia/install/ls-slider)](https://packagephobia.com/result?p=ls-slider)
[![NPM Downloads](https://badgen.net/npm/dt/ls-slider)](https://npmcharts.com/compare/ls-slider?minimal=true)

**This plugin is still in the works and will need some additional adaptions and features before reaching 1.0.0. Please do NOT use this for production in its current state!!**

## Pre-release To-Do's
- [ ] fix indicator scroll animation
- [x] fix infinite scroll on mobile
- [ ] fix initial slide position when infinite are active
- [ ] add visible slides functionality
- [ ] consider accessibility (might be done after initial release)
- [ ] code cleanup

## Post-release To-Do's
- [ ] add lazy loading

## Setup
Either install the npm package via Node.js by running
```console
npm i ls-slider
```
or clone the repository and use the Slider.min.js from the /dist folder.


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
