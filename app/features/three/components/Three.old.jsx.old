import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import pos2 from "./pos";
import { useEffect } from "react";

export default function Three() {
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const sceneColor = new THREE.Color().setHex(0x112233);
    scene.background = sceneColor;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
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
      "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/petrikeckman/phpE4U0RQ.png",
      (texture) => {
        // Create a canvas to sample color data from the texture
        const sampleCanvas = document.getElementById("testCanvas");
        const sampleContext = sampleCanvas.getContext("2d");
        sampleCanvas.width = texture.image.width;
        sampleCanvas.height = texture.image.height;
        sampleContext.drawImage(texture.image, 0, 0);

        const sampleCanvas2 = document.getElementById("testCanvas2");
        const sampleContext2 = sampleCanvas2.getContext("2d");
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
          true,
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
        const centerLineMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff00,
        });
        const centerLine = new THREE.Line(
          centerLineGeometry,
          centerLineMaterial,
        );
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

          sampleContext2.strokeStyle = "purple";
          sampleContext2.lineWidth = 3;
          sampleContext2.strokeRect(x - 2, y - 2, 4, 4);

          // const pixel = sampleContext.getImageData(x, y, 1, 1).data;
          const pixel = sampleContext.getImageData(
            x,
            y,
            sampleCanvas.width,
            sampleCanvas.height,
          ).data;

          return new THREE.Color(
            pixel[0] / 255,
            pixel[1] / 255,
            pixel[2] / 255,
          );
        }

        // Create random spheres inside the cylinder
        const spheres = [];
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const pos = [];
        // console.log(pos.length)
        // for (let i = 1; i < 2; i++) {
        const start = 0;
        const end = pos2.length;
        // const start = 1;
        // const end = start + 1;
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
      },
    );

    // Controls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement);

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  });

  return (
    <>
      <canvas id="testCanvas" />
      <canvas id="testCanvas2" />
    </>
  );
}
