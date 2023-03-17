import { Slider } from "./dist/Slider.js";

const sliders = document.querySelectorAll(".ls-slider");
if (sliders.length) {
  sliders.forEach(sliderElement => {
    new Slider(sliderElement, { infinite: true });
  });
}
