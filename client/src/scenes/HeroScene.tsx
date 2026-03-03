import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040810);
    scene.fog = new THREE.FogExp2(0x050c18, 0.018);

    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 500);
    camera.position.set(0, 6, 30);
    camera.lookAt(0, 2, 0);

    scene.add(new THREE.AmbientLight(0x0a1020, 1.8));

    const moon = new THREE.DirectionalLight(0x8ab4d4, 2.5);
    moon.position.set(-30, 60, -20);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.near = 0.1;
    moon.shadow.camera.far = 200;
    moon.shadow.camera.left = -60; moon.shadow.camera.right = 60;
    moon.shadow.camera.top = 60; moon.shadow.camera.bottom = -60;
    scene.add(moon);

    const lantern = new THREE.PointLight(0xd4a030, 6, 28);
    lantern.position.set(0, 9, -4);
    scene.add(lantern);

    const rim = new THREE.PointLight(0x1a4a2a, 4, 40);
    rim.position.set(18, 5, 5);
    scene.add(rim);

    const fill = new THREE.PointLight(0x3a0a08, 3, 35);
    fill.position.set(-18, -2, 10);
    scene.add(fill);

    // OCEAN
    const SEG = 140;
    const oceanGeo = new THREE.PlaneGeometry(200, 200, SEG, SEG);
    oceanGeo.rotateX(-Math.PI / 2);
    const origY = new Float32Array(oceanGeo.attributes.position.count);
    const posArr = oceanGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < origY.length; i++) origY[i] = posArr[i * 3 + 1];

    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x061a2e, emissive: 0x030d1a, emissiveIntensity: 0.4,
      roughness: 0.15, metalness: 0.6,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.receiveShadow = true;
    ocean.position.y = -2;
    scene.add(ocean);

    // SHIP
    const shipGroup = new THREE.Group();
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x18100a, emissive: 0x0a0604, roughness: 0.85, metalness: 0.1 });
    const detailMat = new THREE.MeshStandardMaterial({ color: 0x2a1e10, emissive: 0x100a04, roughness: 0.9, metalness: 0.05 });
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x1a1208, roughness: 0.95 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0x0e1318, emissive: 0x060c10, emissiveIntensity: 0.3, transparent: true, opacity: 0.88, side: THREE.DoubleSide });

    const hullGeo = new THREE.BoxGeometry(10, 3.2, 26);
    const hPos = hullGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < hPos.length / 3; i++) hPos[i * 3] *= 1 - Math.abs(hPos[i * 3 + 2] / 13) * 0.55;
    hullGeo.computeVertexNormals();
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.castShadow = true;
    shipGroup.add(hull);

    const deckGeo = new THREE.BoxGeometry(9.4, 0.5, 24);
    const dPos = deckGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < dPos.length / 3; i++) dPos[i * 3] *= 1 - Math.abs(dPos[i * 3 + 2] / 12) * 0.5;
    deckGeo.computeVertexNormals();
    const deck = new THREE.Mesh(deckGeo, detailMat);
    deck.position.y = 1.85; deck.castShadow = true;
    shipGroup.add(deck);

    const bow = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 4), hullMat);
    bow.rotation.z = Math.PI / 2; bow.rotation.y = Math.PI / 4;
    bow.position.set(0, 0, -15.5);
    shipGroup.add(bow);

    const stern = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 7), detailMat);
    stern.position.set(0, 3.3, 9); stern.castShadow = true;
    shipGroup.add(stern);

    const fore = new THREE.Mesh(new THREE.BoxGeometry(7, 2.2, 5), detailMat);
    fore.position.set(0, 3, -10); fore.castShadow = true;
    shipGroup.add(fore);

    const addMast = (x: number, z: number, h: number) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, h, 8), mastMat);
      m.position.set(x, h / 2 + 2.1, z); m.castShadow = true;
      shipGroup.add(m);
      const n = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.6, 0.6, 8), detailMat);
      n.position.set(x, h + 2.4, z);
      shipGroup.add(n);
    };
    addMast(0, -2, 18); addMast(0, -10, 14); addMast(0, 8, 13);

    const addYard = (z: number, y: number, len: number) => {
      const yd = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, len, 6), mastMat);
      yd.rotation.z = Math.PI / 2; yd.position.set(0, y, z);
      shipGroup.add(yd);
    };
    [[-2,17,14],[-2,12,11],[-2,7.5,8],[-10,13.5,11],[-10,9,9],[8,12,9]].forEach(([z,y,l]) => addYard(z,y,l));

    const addSail = (z: number, yB: number, yT: number, w: number, sag: number) => {
      const sg = new THREE.PlaneGeometry(w, yT - yB, 8, 8);
      const sp = sg.attributes.position.array as Float32Array;
      for (let i = 0; i < sp.length / 3; i++) {
        const u = sp[i * 3] / (w / 2), v = sp[i * 3 + 1] / ((yT - yB) / 2);
        sp[i * 3 + 2] += sag * (1 - u * u) * (1 - v * v * 0.3);
      }
      sg.computeVertexNormals();
      const s = new THREE.Mesh(sg, sailMat);
      s.position.set(0, (yB + yT) / 2, z); s.castShadow = true;
      shipGroup.add(s);
    };
    addSail(-2, 8, 16.5, 12.5, 2.5); addSail(-2, 3.5, 11, 9.5, 2);
    addSail(-10, 4.5, 13, 9.5, 2.2); addSail(-10, 0, 9, 7.5, 1.8); addSail(8, 3.5, 11.5, 8, 2);

    const addRope = (a: THREE.Vector3, b: THREE.Vector3) => {
      const rg = new THREE.BufferGeometry().setFromPoints([a, b]);
      scene.add(new THREE.Line(rg, new THREE.LineBasicMaterial({ color: 0x2a1e10, transparent: true, opacity: 0.7 })));
    };
    addRope(new THREE.Vector3(5,2.2,-10), new THREE.Vector3(0,16,-2));
    addRope(new THREE.Vector3(-5,2.2,-10), new THREE.Vector3(0,16,-2));
    addRope(new THREE.Vector3(4,2.2,-2), new THREE.Vector3(0,20,-2));
    addRope(new THREE.Vector3(-4,2.2,-2), new THREE.Vector3(0,20,-2));
    addRope(new THREE.Vector3(3,2.2,8), new THREE.Vector3(0,15,-2));
    addRope(new THREE.Vector3(-3,2.2,8), new THREE.Vector3(0,15,-2));
    addRope(new THREE.Vector3(0,20,-2), new THREE.Vector3(0,16,-10));
    addRope(new THREE.Vector3(0,16,-10), new THREE.Vector3(0,15,8));

    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 14, 6), mastMat);
    boom.rotation.z = Math.PI * 0.15; boom.position.set(0, 3.5, -17);
    shipGroup.add(boom);

    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.8), new THREE.MeshBasicMaterial({ color: 0x080505, side: THREE.DoubleSide }));
    flag.position.set(1.3, 21.5, -2);
    shipGroup.add(flag);

    shipGroup.position.set(0, 1.5, -8);
    shipGroup.rotation.y = Math.PI * 0.04;
    scene.add(shipGroup);

    // FOG
    const FC = 2200;
    const fPos = new Float32Array(FC * 3), fSpd = new Float32Array(FC), fCol = new Float32Array(FC * 3);
    const pal = [new THREE.Color(0x8ab0c8), new THREE.Color(0x5a8090), new THREE.Color(0xc8d4b8), new THREE.Color(0x3a5060)];
    for (let i = 0; i < FC; i++) {
      const i3 = i * 3;
      fPos[i3] = (Math.random()-0.5)*180; fPos[i3+1] = (Math.random()-0.5)*8+2; fPos[i3+2] = (Math.random()-0.5)*120-10;
      fSpd[i] = 0.003 + Math.random()*0.008;
      const c = pal[Math.floor(Math.random()*4)], b = 0.4+Math.random()*0.4;
      fCol[i3]=c.r*b; fCol[i3+1]=c.g*b; fCol[i3+2]=c.b*b;
    }
    const fogGeo = new THREE.BufferGeometry();
    fogGeo.setAttribute("position", new THREE.BufferAttribute(fPos, 3));
    fogGeo.setAttribute("color", new THREE.BufferAttribute(fCol, 3));
    scene.add(new THREE.Points(fogGeo, new THREE.PointsMaterial({ size: 2.8, vertexColors: true, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })));

    // EMBERS
    const EC = 400;
    const ePos = new Float32Array(EC*3), eVel = new Float32Array(EC*3), eCol = new Float32Array(EC*3);
    for (let i = 0; i < EC; i++) {
      const i3=i*3;
      ePos[i3]=(Math.random()-0.5)*12; ePos[i3+1]=Math.random()*25+5; ePos[i3+2]=(Math.random()-0.5)*8-5;
      eVel[i3]=(Math.random()-0.5)*0.015; eVel[i3+1]=0.01+Math.random()*0.025; eVel[i3+2]=(Math.random()-0.5)*0.015;
      const t=Math.random(); eCol[i3]=0.9+t*0.1; eCol[i3+1]=0.35+t*0.35; eCol[i3+2]=0;
    }
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute("position", new THREE.BufferAttribute(ePos, 3));
    emberGeo.setAttribute("color", new THREE.BufferAttribute(eCol, 3));
    const embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    embers.position.copy(lantern.position);
    scene.add(embers);

    // MOON
    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshBasicMaterial({ color: 0xd4dce8 }));
    moonMesh.position.set(-60,70,-120);
    scene.add(moonMesh);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x8ab4d4, transparent: true, opacity: 0.12, side: THREE.BackSide });
    const moonGlow = new THREE.Mesh(new THREE.SphereGeometry(7.5,32,32), glowMat);
    moonGlow.position.copy(moonMesh.position);
    scene.add(moonGlow);

    const reflMat = new THREE.MeshBasicMaterial({ color: 0x8ab4d4, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
    const reflMesh = new THREE.Mesh(new THREE.PlaneGeometry(12,40), reflMat);
    reflMesh.rotation.x = -Math.PI/2; reflMesh.position.set(-8,-1.9,5);
    scene.add(reflMesh);

    // STARS
    const sPos = new Float32Array(1800*3);
    for (let i=0;i<1800;i++){sPos[i*3]=(Math.random()-0.5)*400;sPos[i*3+1]=Math.random()*150+20;sPos[i*3+2]=(Math.random()-0.5)*400;}
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(sPos,3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.35, color: 0xddeeff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })));

    let tMX=0, tMY=0, cMX=0, cMY=0;
    const onMM = (e: MouseEvent) => { tMX=(e.clientX/window.innerWidth-0.5)*2; tMY=(e.clientY/window.innerHeight-0.5)*2; };
    window.addEventListener("mousemove", onMM);

    const onResize = () => { const w=mount.clientWidth,h=mount.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize", onResize);

    let raf: number, tt=0;
    const tick = () => {
      raf=requestAnimationFrame(tick); tt+=0.01;

      const ov = oceanGeo.attributes.position.array as Float32Array;
      for (let i=0;i<ov.length/3;i++){
        const x=ov[i*3], z=ov[i*3+2];
        ov[i*3+1]=origY[i]+Math.sin(x*0.12+tt*1.2)*0.6+Math.sin(z*0.09+tt*0.9)*0.8+Math.sin((x+z)*0.07+tt*0.7)*0.5+Math.cos(x*0.05-tt*0.5)*0.4;
      }
      oceanGeo.attributes.position.needsUpdate=true;
      oceanGeo.computeVertexNormals();

      shipGroup.position.y=1.5+Math.sin(tt*0.7)*0.35;
      shipGroup.rotation.z=Math.sin(tt*0.5)*0.015;
      shipGroup.rotation.x=Math.sin(tt*0.38)*0.008;
      flag.rotation.y=Math.sin(tt*3.5)*0.4;
      lantern.intensity=6+Math.sin(tt*8.3)*0.8+Math.sin(tt*12.7)*0.5;

      const fp=fogGeo.attributes.position.array as Float32Array;
      for(let i=0;i<FC;i++){fp[i*3]+=fSpd[i];if(fp[i*3]>90)fp[i*3]=-90;}
      fogGeo.attributes.position.needsUpdate=true;

      const ep=emberGeo.attributes.position.array as Float32Array;
      for(let i=0;i<EC;i++){const i3=i*3;ep[i3]+=eVel[i3];ep[i3+1]+=eVel[i3+1];ep[i3+2]+=eVel[i3+2];if(ep[i3+1]>35||Math.random()<0.002){ep[i3]=(Math.random()-0.5)*6;ep[i3+1]=8+Math.random()*3;ep[i3+2]=(Math.random()-0.5)*4;}}
      emberGeo.attributes.position.needsUpdate=true;

      glowMat.opacity=0.10+Math.sin(tt*0.4)*0.04;
      reflMat.opacity=0.14+Math.sin(tt*2.1)*0.06;

      cMX+=(tMX-cMX)*0.04; cMY+=(tMY-cMY)*0.04;
      camera.position.x=cMX*3.5; camera.position.y=6-cMY*2;
      camera.lookAt(0,2,0);

      renderer.render(scene,camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="relative h-screen w-full snap-start overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(4,8,16,0.92) 0%, rgba(4,8,16,0.18) 40%, rgba(4,8,16,0.55) 100%)" }} />

      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 3px)", backgroundSize: "100% 4px" }} />

      <div className="relative z-20 h-full flex flex-col items-center justify-end pb-20 sm:pb-28 text-center px-6">

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          className="w-48 sm:w-72 h-px mb-6"
          style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#8ab4d4] mb-4"
        >
          A Supernatural Fleet Rises
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="font-pirata text-5xl sm:text-7xl md:text-8xl text-[#d4af37] drop-shadow-[0_0_40px_rgba(212,175,55,0.55)] leading-none"
        >
          The Fog Descends
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.82 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="font-cinzel mt-5 max-w-md text-sm sm:text-base text-white/75 leading-relaxed"
        >
          A supernatural fleet rises beyond the horizon.
          <br />
          <span className="text-[#d4af37]/70">The campus will never be the same.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex items-center gap-4 mt-8"
        >
          <div className="w-16 sm:w-24 h-px" style={{ background: "linear-gradient(90deg, transparent, #d4af37)" }} />
          <svg viewBox="0 0 24 24" fill="#d4af37" className="w-4 h-4 opacity-80">
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z" />
          </svg>
          <div className="w-16 sm:w-24 h-px" style={{ background: "linear-gradient(90deg, #d4af37, transparent)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 1, delay: 2.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
          className="mt-8 flex flex-col items-center gap-2 text-[#d4af37]/60"
        >
          <span className="font-cinzel text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <svg viewBox="0 0 20 28" fill="none" stroke="currentColor" strokeWidth="1" className="w-4 h-6">
            <rect x="1" y="1" width="18" height="26" rx="9" />
            <motion.rect
              x="8.5" y="5" width="3" height="6" rx="1.5" fill="currentColor" stroke="none"
              animate={{ y: [5, 13, 5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

      </div>
    </section>
  );
}