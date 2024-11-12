import { LedPosProps, PromiseStateType } from "./imageProcessingTypes";

const delay = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), time);
  });
};

type ForEachPixelCallbackArgs = { x: number; y: number };
type ForEachPixelCallbackType = (args: ForEachPixelCallbackArgs) => void;

const forEachPixel = ({
  height,
  width,
  callback,
}: {
  height: number;
  width: number;
  callback: ForEachPixelCallbackType;
}) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      callback({ x, y });
    }
  }
};

// https://raw.githubusercontent.com/atomic14/self-organising-leds/40ac412504d0867dfde33adfe9c2e268f5b19a3b/frontend/src/imageProcessing/imageProcessing.tsx
export function getVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  maskArray: Array<boolean>,
) {
  console.group("getVideoFrame");
  const width = video.videoWidth;
  const height = video.videoHeight;
  const context = canvas.getContext("2d");
  // draw the video to the canvas
  context!.drawImage(video, 0, 0, width, height);
  // get the raw image bytes
  const imageData = context!.getImageData(0, 0, width, height);
  // convert to greyscale
  const bytes = new Uint8Array(width * height);
  const doUseMaskArray = maskArray.length === bytes.length;
  console.info({ doUseMaskArray });

  const grayScaleCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    if (doUseMaskArray && maskArray[y * width + x]) {
      bytes[y * width + x] = 0;
      return;
    }
    const r = imageData.data[(y * width + x) * 4];
    const g = imageData.data[(y * width + x) * 4 + 1];
    const b = imageData.data[(y * width + x) * 4 + 2];
    // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    const grey = Math.min(255, 0.299 * r + 0.587 * g + 0.114 * b);
    bytes[y * width + x] = grey;
  };
  forEachPixel({ height, width, callback: grayScaleCallback });

  console.groupEnd();
  return bytes;
}

function blur(
  image: Uint8Array,
  width: number,
  height: number,
  maskArray: Array<boolean>,
): Uint8Array {
  console.group("blur");
  const kernel = [
    0.03426, 0.037671, 0.04101, 0.044202, 0.047168, 0.049832, 0.052124,
    0.053979, 0.055344, 0.05618, 0.056461, 0.05618, 0.055344, 0.053979,
    0.052124, 0.049832, 0.047168, 0.044202, 0.04101, 0.037671, 0.03426,
  ];
  const horizontal = new Uint8Array(width * height);

  const doUseMaskArray = horizontal.length === maskArray.length;

  console.info({ doUseMaskArray });

  const blurHorizontalCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    const row = y * width;

    if (doUseMaskArray && maskArray[row + x]) {
      horizontal[row + x] = 0;
      return;
    }
    let value = 0;
    let divider = 0;
    for (let k = -10; k <= 10; k++) {
      if (k + x >= 0 && k + x < width) {
        value += image[row + x + k] * kernel[k + 10];
        divider += kernel[k + 10];
      }
    }
    horizontal[row + x] = value / divider;
  };

  forEachPixel({ height, width, callback: blurHorizontalCallback });

  const vertical = new Uint8Array(width * height);

  const blurVerticalCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    if (doUseMaskArray && maskArray[y * width + x]) {
      vertical[y * width + x] = 0;
      return;
    }
    let value = 0;
    let divider = 0;
    for (let k = -10; k <= 10; k++) {
      if (k + y >= 0 && k + y < height) {
        value += horizontal[(k + y) * width + x] * kernel[k + 10];
        divider += kernel[k + 10];
      }
    }
    vertical[y * width + x] = value / divider;
  };

  forEachPixel({ height, width, callback: blurVerticalCallback });
  console.groupEnd();
  return vertical;
}

function debugImage(bytes: Uint8Array, canvas: HTMLCanvasElement) {
  const width = canvas.width;
  const height = canvas.height;
  const context = canvas.getContext("2d");
  const imageData = context!.getImageData(0, 0, width, height);

  const debugImageCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    imageData.data[(y * width + x) * 4] = bytes[y * width + x];
    imageData.data[(y * width + x) * 4 + 1] = bytes[y * width + x];
    imageData.data[(y * width + x) * 4 + 2] = bytes[y * width + x];
  };
  forEachPixel({ height, width, callback: debugImageCallback });

  context!.putImageData(imageData, 0, 0);
  return imageData;
}

export async function calibrateUsingCamera(
  deviceId: string,
  video: HTMLVideoElement,
  maskArray: Array<boolean>,
  ledIndex: number,
  promiseObj?: PromiseStateType,
) {
  console.group("calibrateUsingCamera");
  const width = video.videoWidth;
  const height = video.videoHeight;
  // create a canvas element to capture video stills
  const canvas = document.getElementById(
    `calibrate${deviceId}`,
  ) as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;

  const sleepA = 1000;
  console.info(`sleepA ${sleepA}`);
  await delay(sleepA);
  // capture a frame with all the LEDs off
  const imageBytesNoLeds = blur(
    getVideoFrame(video, canvas, maskArray),
    width,
    height,
    maskArray,
  );
  debugImage(imageBytesNoLeds, canvas);
  // await api.setLeds(espHost, colors);
  // await delay(200);
  // capture a frame

  if (promiseObj !== undefined && promiseObj !== null) {
    console.info("awaiting custom promise");
    await promiseObj.promise;
    console.info("custom promise resolved");
  } else {
    const sleepB = 5000;
    console.info(`sleepB ${sleepB}`);
    await delay(sleepB);
  }

  const imageBytesOneLed = blur(
    getVideoFrame(video, canvas, maskArray),
    width,
    height,
    maskArray,
  );
  debugImage(imageBytesOneLed, canvas);
  // get the maximum difference between the two images
  let maxDifference = 0;
  for (let i = 0; i < imageBytesNoLeds.length; i++) {
    maxDifference = Math.max(
      maxDifference,
      imageBytesOneLed[i] - imageBytesNoLeds[i],
    );
  }
  // now work out the approximate location of the led
  let xPos = 0;
  let yPos = 0;
  let total = 0;
  const positionCallback = ({ x, y }: ForEachPixelCallbackArgs) => {
    const index = y * width + x;
    const diff = imageBytesOneLed[index] - imageBytesNoLeds[index];
    if (diff > 0.5 * maxDifference) {
      xPos += x * diff;
      yPos += y * diff;
      total += diff;
    }
  };
  forEachPixel({ height, width, callback: positionCallback });

  const ledPosMetaInitial: LedPosProps = {
    x: xPos / total,
    y: yPos / total,
    maxDifference,
    ledIndex,
  };
  // await api.setLeds(espHost, colors);
  // }
  const context = canvas.getContext("2d");
  context!.strokeStyle = "red";
  context!.strokeRect(ledPosMetaInitial.x - 2, ledPosMetaInitial.y - 2, 4, 4);
  const highlightedImageData = context!.getImageData(0, 0, width, height);

  const ledPosMeta: LedPosProps = {
    ...ledPosMetaInitial,
    highlightedImageData,
  };
  console.info({ ledPosMeta, maxDifference, total, ledPosMetaInitial });

  console.groupEnd();
  return ledPosMeta;
}
/*
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import cc from './candycane';
import pos2 from './pos';
// Scene setup
const scene = new THREE.Scene();
const sceneColor = new THREE.Color().setHex(0x112233);
scene.background = sceneColor;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the PNG texture for the cylinder
const textureLoader = new THREE.TextureLoader();
// https://i.sstatic.net/nbCNE.png
//  'https://i0.wp.com/classicmancuts.com/wp-content/uploads/2019/04/barber-pole-background-3-260x200.png?ssl=1',
// https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9d2e978a-9012-4f1c-8857-2006a8e43334/d63ou42-9a2b1769-9485-4366-a1f0-f4badf4044c2.png/v1/fill/w_482,h_471/glitter_rainbow_box_png_by_dashawtygaga_d63ou42-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDcxIiwicGF0aCI6IlwvZlwvOWQyZTk3OGEtOTAxMi00ZjFjLTg4NTctMjAwNmE4ZTQzMzM0XC9kNjNvdTQyLTlhMmIxNzY5LTk0ODUtNDM2Ni1hMWYwLWY0YmFkZjQwNDRjMi5wbmciLCJ3aWR0aCI6Ijw9NDgyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.8YIOjY-85YdAZRim9L76ylw_ulU03J-6F-TG3yMUbBs
textureLoader.load(
  'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png',
  texture => {
    // Create a canvas to sample color data from the texture
    const sampleCanvas = document.getElementById('testCanvas');
    const sampleContext = sampleCanvas.getContext('2d');
    sampleCanvas.width = texture.image.width;
    sampleCanvas.height = texture.image.height;
    sampleContext.drawImage(texture.image, 0, 0);

    const sampleCanvas2 = document.getElementById('testCanvas2');
    const sampleContext2 = sampleCanvas2.getContext('2d');
    sampleCanvas2.width = texture.image.width;
    sampleCanvas2.height = texture.image.height;
    sampleContext2.drawImage(texture.image, 0, 0);

    // Create the cylinder to contain the spheres
    const cylinderHeight = 20;
    const cylinderGeometry = new THREE.CylinderGeometry(
      5,
      5,
      cylinderHeight,
      64,
      1,
      true
    );
    const cylinderMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3, // Make it slightly transparent to see spheres inside
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    scene.add(cylinder);

    // Draw the central line along the cylinder's center axis
    const centerLineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, 10, 0),
    ]);
    const centerLineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const centerLine = new THREE.Line(centerLineGeometry, centerLineMaterial);
    scene.add(centerLine);

    // Function to get color from the texture at (u, v)
    function getTextureColor(u, v) {
      // const x = Math.floor(u * sampleCanvas.width);
      // const y = Math.floor((1 - v) * sampleCanvas.height); // Flip v for canvas coordinates
      const x = Math.floor(u * sampleCanvas.width);
      const y = Math.floor((1 - v) * sampleCanvas.height); // Flip v for canvas coordinates

      console.log({
        x,
        y,
        height: sampleCanvas.height,
        width: sampleCanvas.width,
      });

      sampleContext2.strokeStyle = 'purple';
      sampleContext2.lineWidth = 3;
      sampleContext2.strokeRect(x - 2, y - 2, 4, 4);

      // const pixel = sampleContext.getImageData(x, y, 1, 1).data;
      const pixel = sampleContext.getImageData(
        x,
        y,
        sampleCanvas.width,
        sampleCanvas.height
      ).data;

      return new THREE.Color(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255);
    }

    // Create random spheres inside the cylinder
    const spheres = [];
    const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const pos = [];
    // console.log(pos.length)
    // for (let i = 1; i < 2; i++) {
    // const start = 0;
    // const end = pos2.length;
    const start = 1;
    const end = start + 1;
    for (let i = start; i < end; i++) {
      // Reduced number of spheres for clarity
      // Random position inside cylinder's bounds
      // const angle = Math.random() * 2 * Math.PI;
      // const radius = Math.random() * 5;
      // const height = (Math.random() - 0.5) * cylinderHeight;

      // const x = radius * Math.cos(angle);
      // const x = radius * Math.cos(angle);
      // const y = height;
      // const z = radius * Math.sin(angle);
      const angle = pos2[i].angle;
      const x = pos2[i].x;
      const y = pos2[i].y;
      const z = pos2[i].z;
      pos.push({ x, y, z, angle });

      // Calculate sampling point on the cylinder surface
      const sampleX = 6 * Math.cos(angle); // Cylinder radius * cos(angle)
      const sampleZ = 6 * Math.sin(angle); // Cylinder radius * sin(angle)
      const samplePoint = new THREE.Vector3(sampleX, y, sampleZ);

      // Calculate correct u and v for the texture based on angle and height
      // const u = angle / (2 * Math.PI); // Map angle to [0, 1]
      const offset = 3;
      console.log(Math.acos(-0.5) * angle);
      // const u = Math.atan2(z, x) / (2 * Math.PI);
      console.log({ x, z, y });
      const u =
        (360 - (((Math.atan2(z, x) * 180) / Math.PI + 270) % 360)) / 360;
      // 0.485 too L  = (angle-Math.PI) / (2 * Math.PI - Math.PI);
      // 0.514 seems right = 1 - (angle - Math.PI) / (2 * Math.PI - Math.PI);
      // 0.742 = (angle ) / (2 * Math.PI );
      // 0.257 = 1 - angle / (2 * Math.PI);
      // 0.171 = 1 - (angle+Math.PI) / (2 * Math.PI + Math.PI);
      // 0.828 = (angle+Math.PI) / (2 * Math.PI + Math.PI);
      // -0.514 = (angle - Math.PI*2) / (2 * Math.PI - Math.PI);
      // 0.477 = ((Math.cos(angle) + 1) * Math.PI) / (2 * Math.PI);
      // 0.477 = (Math.cos(angle) + 1) / 2;
      const v = (y + 10) / cylinderHeight; // Map y to [0, 1] for cylinder height of 20

      console.log({ u, v, angle });
      console.log({ angle });
      // Sample color based on the corrected u, v coordinates
      const color = getTextureColor(u, v);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Position the sphere inside the cylinder
      sphere.position.set(x, y, z);
      spheres.push(sphere);
      scene.add(sphere);

      // Draw a line from the sphere to the sample point on the cylinder
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        sphere.position,
        samplePoint,
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
    // console.log(JSON.stringify(pos));
  }
);

// Controls for camera movement
const controls = new OrbitControls(camera, renderer.domElement);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
*/

/*
const posStr = `[{"x":-3.53394287327649,"y":8.988981774031162,"z":0.12001614880990699,"angle":3.1076447249188472},{"x":-0.11841758285919553,"y":7.696635386261694,"z":-2.6436806379793287,"angle":4.667626205618536},{"x":2.8606501862046287,"y":6.590287065894134,"z":-0.3797148145671996,"angle":6.1512195003203365},{"x":-3.175340509189533,"y":5.157314748911412,"z":-2.118522445903429,"angle":3.729950288420145},{"x":1.2257296972085094,"y":4.869317038305234,"z":-4.2592740657465,"angle":4.992596497611538},{"x":2.897902302175029,"y":4.083208692643603,"z":-0.9590669865468154,"angle":5.963579349872515},{"x":3.3042247190813527,"y":-3.559564286746384,"z":1.814905347811083,"angle":0.502281144478352},{"x":0.36888966374095816,"y":-8.250699980337647,"z":-1.2153757029744365,"angle":5.007071114690303},{"x":-1.1801086467084094,"y":-4.249014753068772,"z":0.02702143122632445,"angle":3.1186992442254073},{"x":1.6516890032587337,"y":-8.2751089306648,"z":4.19593714343603,"angle":1.1957846405204868},{"x":0.1879710929332401,"y":0.48777197115444704,"z":-0.8318045194615498,"angle":4.934635899186858},{"x":1.1133496636638107,"y":-4.2999889347527676,"z":-0.7887438814567755,"angle":5.66681588180912},{"x":-2.9191401204624676,"y":8.054348071090502,"z":3.0077631024626714,"angle":2.3412429421890604},{"x":0.10054663673260601,"y":5.4972395370593885,"z":2.9766213462306186,"angle":1.5370303855603564},{"x":-0.7560746768864547,"y":4.3090789450926925,"z":-3.4473978732782617,"angle":4.496489762263787},{"x":0.6025880868740524,"y":8.488994008083338,"z":-0.5291778506720834,"angle":5.562559850524209},{"x":-2.7077987030459645,"y":-6.457842825425959,"z":-3.76179671510965,"angle":4.08848760167275},{"x":1.1371927275469498,"y":6.161670031146289,"z":2.006709434222094,"angle":1.0552256750810178},{"x":-2.412992145143051,"y":1.4654282503451244,"z":3.941323270888315,"angle":2.1201592000973},{"x":-0.6220113780025613,"y":-7.799173433113316,"z":-0.6297745620242926,"angle":3.933192424026758}]`;
const pos = JSON.parse(posStr);

export default pos;

*/
