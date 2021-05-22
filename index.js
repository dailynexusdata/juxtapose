//https://www.npmjs.com/package/juxtaposejs

const jux = document.getElementById("jux");

class Jux {
  root = null;
  top = null;
  base = null;
  curridx = -10;
  ctx2 = null;
  i2 = null;
  imgs = null;
  height = 0;
  width = 0;
  slider = null;

  loaded = {};

  constructor(
    id,
    srcs,
    height,
    width,
    outputHeight = height,
    outputWidth = width
  ) {
    this.root = document.getElementById(id);
    this.root.id = "JUXroot";
    this.root.style.height = `${outputHeight}px`;
    this.root.style.position = "relative";
    this.top = document.createElement("div");
    this.top.id = "JUXtop";
    this.base = document.createElement("div");
    this.base.id = "JUXbase";

    this.imgs = srcs;
    this.first = true;
    this.height = height;
    this.width = width;
    this.oheight = outputHeight;
    this.owidth = outputWidth;

    srcs.forEach((img, i) => {
      const i2 = new Image();
      i2.src = img;

      i2.onload = () => {
        this.loaded[i] = i2;
        console.log(`Loaded ${i}`);

        if (i === 0) {
          this.insertBase(0);
        }
      };
    });
  }

  display(val, single = false) {
    const idx1 = Math.floor(val / this.width);
    const pct = (val % this.width) / this.width;

    console.log(idx1, pct);
    if (single) {
      this.insertBase(idx1);
      this.update(0);

      // arghhhh
    } else if (this.curridx === idx1) {
      this.update(pct);
      return;
    } else if (this.curridx + 1 === idx1) {
      // this.root.innerHTML = "";
      console.log("%cMOVING", "color: red;");
      this.insertBase(idx1);
      this.insertTop(idx1 + 1);
    } else if (this.curridx === idx1 + 1) {
      // this.root.innerHTML = "";
      this.insertBase(idx1);
      this.insertTop(idx1 + 1);
      this.update(1);
    } else if (this.first) {
      this.first = false;
      this.insertBase(idx1);
      this.insertTop(idx1 + 1);
    } else {
      // skipped over values
    }

    this.curridx = idx1;
  }

  update(pct) {
    const showPct = 1 - pct;
    if (this.ctx2) {
      this.ctx2.clearRect(0, 0, this.owidth * showPct, this.oheight);

      if (this.i2) {
        this.ctx2.drawImage(
          this.i2,
          this.width * showPct,
          0,
          this.width,
          this.height,
          this.owidth * showPct,
          0,
          this.owidth,
          this.oheight
        );
      }
    }
  }

  insertTop(idx) {
    this.top.remove();
    this.top = document.createElement("canvas");
    this.top.setAttribute("id", "JUXtop");
    this.top.style.position = "absolute";
    this.root.appendChild(this.top);

    // this.top.appendChild(rightImageCanvas);

    // return;
    const ctx2 = this.top.getContext("2d");

    const i2 = this.loaded[idx];

    this.top.setAttribute("width", this.owidth);
    this.top.setAttribute("height", this.oheight);
    this.ctx2 = ctx2;
    this.i2 = i2;
  }

  insertBase(idx) {
    // this.base.innerHTML = "";
    // const leftImageCanvas = document.createElement("canvas");
    this.base.remove();
    this.base = document.createElement("canvas");
    this.base.setAttribute("id", "JUXbase");
    this.base.style.position = "absolute";
    this.root.appendChild(this.base);
    const ctx1 = this.base.getContext("2d");

    this.base.setAttribute("width", this.owidth);
    this.base.setAttribute("height", this.oheight);
    ctx1.drawImage(
      this.loaded[idx],
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      this.owidth,
      this.oheight
    );
  }

  getTotalWidth() {
    // return this.imgs.length - 1;
    return this.width * (this.imgs.length - 1);
  }

  addSlider(tag) {
    const input = document.createElement("input");
    input.setAttribute("value", 0);
    input.setAttribute("min", 0);
    input.setAttribute("max", this.getTotalWidth());
    input.setAttribute("type", "range");

    input.addEventListener("input", (event) => {
      this.display(+event.target.value);
    });

    tag.appendChild(input);
    this.slider = input;
  }

  addDots(div) {
    const container = document.createElement("div");
    div.style.width = `${20 * this.imgs.length}px`;
    for (let i = 0; i < this.imgs.length; ++i) {
      const circ = document.createElement("div");
      circ.setAttribute("class", "juxCirc");
      circ.addEventListener("click", () => {
        this.display(i * this.width, true);
        this.slider.value = i * this.width;
        this.curridx = i;
      });
      container.appendChild(circ);
    }
    container.style.display = "flex";
    container.style.height = "22px";
    container.style.width = "100%";
    container.style.padding = "5px";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    div.appendChild(container);
  }
}

// const imgs = ["img1.jpg", "img2.jpg", "img3.jpg"];

// imgs.forEach((i) => {
//   const img = document.createElement("IMG");
//   img.src = i;
//   img.width = 600;
//   img.height = 400;

//   jux.appendChild(img);
// });

// const j = new Jux(
//   "jux",
//   ["test/img1.png", "test/img2.png", "test/img3.png"],
//   300,
//   400
// );
// j.display(0, 1);

const j = new Jux(
  "jux",
  [
    "campus/c1.png",
    "campus/c2.png",
    "campus/c3.png",
    "campus/c4.png",
    "campus/c5.png",
    "campus/c6.png",
  ],
  601,
  834,
  300,
  400
);

const slider = document.getElementById("slider");
const dots = document.getElementById("dots");
// slider.addEventListener("input", function () {
//   j.display(+this.value);
//   // j.display(0, Math.min(399, this.value));
// });

j.addSlider(slider);
j.addDots(dots);

console.log(
  window.frameElement
    ? "embedded in iframe or object"
    : "not embedded or cross-origin"
);

if (false) {
  const a = document.getElementById("embed");
  a.href = "dailynexus.com";

  const source = document.createElement("p");
  source.innerHTML = "Daily Nexus Chart View Here";
  a.appendChild(source);
} else {
  // show embed funciotn - or always make availabe ?
}
