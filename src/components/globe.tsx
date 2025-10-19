"use client";

import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useRef, useState } from "react";
import GlobeComponent from "react-globe.gl";
interface RotatingGlobeProps {

}

const RotatingGlobe: React.FC<RotatingGlobeProps> = () => {
  const globeEl = useRef<any>(null);
  const { user, loading } = useContext(AuthContext)

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = loading ? 0 : 5;
    }
  }, [loading]);

  return (
    <div className="w-1/2 h-full flex justify-end items-center">
      <div className="w-full h-full max-w-full max-h-full">
        <GlobeComponent
          ref={globeEl}
          globeImageUrl={user ? "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg" : "https://unpkg.com/three-globe/example/img/earth-night.jpg"}
          backgroundColor="rgba(0,0,0,0)"
          width={750}    // optional fixed width
          height={750}   // optional fixed height
        />
      </div>
    </div>

  );
};

export default RotatingGlobe;
