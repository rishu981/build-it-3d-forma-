import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { HouseDesign, Room, Wall, Door, Window, FurnitureItem } from '../../types/geometry';

// Material color definitions
const MATERIAL_COLORS: Record<string, string> = {
  plaster_white: '#F5F6F8',
  exposed_brick: '#B25D42',
  concrete: '#A6ADB7',
  timber_slats: '#8D6E53',
  stone_cladding: '#D7D2C8',
  charcoal_render: '#2A303A',
  hardwood: '#C19A6B',
  tile_ceramic: '#E8ECF0',
  marble: '#F0F2F5',
  polished_concrete: '#9BA1A8',
  parquet: '#BA8D63',
  slate: '#505662',
};

// Camera Controller for View Presets
const CameraController: React.FC<{
  target: [number, number, number];
  preset: 'front' | 'top' | 'side' | 'isometric' | 'reset' | null;
}> = ({ target, preset }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!preset) return;

    if (preset === 'top') {
      camera.position.set(target[0], target[1] + 35, target[2] + 0.001);
    } else if (preset === 'front') {
      camera.position.set(target[0], target[1] + 3, target[2] + 30);
    } else if (preset === 'side') {
      camera.position.set(target[0] + 30, target[1] + 3, target[2]);
    } else if (preset === 'isometric' || preset === 'reset') {
      camera.position.set(target[0] + 24, target[1] + 20, target[2] + 24);
    }

    camera.lookAt(target[0], target[1], target[2]);
    if (controlsRef.current) {
      controlsRef.current.target.set(target[0], target[1], target[2]);
      controlsRef.current.update();
    }
  }, [preset, target, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={target}
      maxPolarAngle={Math.PI / 2 - 0.05} // keep above ground
      minDistance={4}
      maxDistance={80}
      makeDefault
    />
  );
};

// Individual Room 3D Representation
const Room3D: React.FC<{
  room: Room;
  floorElevation: number;
  isSelected: boolean;
  wireframe: boolean;
  cutaway: boolean;
  showLabels: boolean;
  onSelect: () => void;
}> = ({ room, floorElevation, isSelected, wireframe, cutaway, showLabels, onSelect }) => {
  const roomCenter = [room.x + room.width / 2, floorElevation + 0.05, room.z + room.length / 2] as [
    number,
    number,
    number
  ];

  const floorColor = MATERIAL_COLORS[room.floorMaterial] || '#E8ECF0';
  const wallHeight = cutaway ? 1.0 : room.wallHeight || 3.0;
  const wallThickness = 0.15;

  return (
    <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Floor Slab of Room */}
      <mesh position={[roomCenter[0], floorElevation + 0.02, roomCenter[2]]} receiveShadow>
        <boxGeometry args={[room.width, 0.04, room.length]} />
        <meshStandardMaterial
          color={floorColor}
          roughness={0.4}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* Selected Highlighter Outline */}
      {isSelected && (
        <mesh position={[roomCenter[0], floorElevation + 0.06, roomCenter[2]]}>
          <boxGeometry args={[room.width + 0.1, 0.06, room.length + 0.1]} />
          <meshBasicMaterial color="#426B9C" wireframe transparent opacity={0.8} />
        </mesh>
      )}

      {/* Interior Perimeter Enclosure Walls for this Room */}
      <group>
        {/* North Wall */}
        <mesh
          position={[roomCenter[0], floorElevation + wallHeight / 2, room.z + wallThickness / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[room.width, wallHeight, wallThickness]} />
          <meshStandardMaterial
            color={isSelected ? '#7896B6' : MATERIAL_COLORS[room.wallMaterial] || '#F5F6F8'}
            roughness={0.7}
            wireframe={wireframe}
            transparent={cutaway}
            opacity={cutaway ? 0.6 : 1}
          />
        </mesh>

        {/* South Wall */}
        <mesh
          position={[roomCenter[0], floorElevation + wallHeight / 2, room.z + room.length - wallThickness / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[room.width, wallHeight, wallThickness]} />
          <meshStandardMaterial
            color={isSelected ? '#7896B6' : MATERIAL_COLORS[room.wallMaterial] || '#F5F6F8'}
            roughness={0.7}
            wireframe={wireframe}
            transparent={cutaway}
            opacity={cutaway ? 0.6 : 1}
          />
        </mesh>

        {/* West Wall */}
        <mesh
          position={[room.x + wallThickness / 2, floorElevation + wallHeight / 2, roomCenter[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, wallHeight, room.length]} />
          <meshStandardMaterial
            color={isSelected ? '#7896B6' : MATERIAL_COLORS[room.wallMaterial] || '#F5F6F8'}
            roughness={0.7}
            wireframe={wireframe}
            transparent={cutaway}
            opacity={cutaway ? 0.6 : 1}
          />
        </mesh>

        {/* East Wall */}
        <mesh
          position={[room.x + room.width - wallThickness / 2, floorElevation + wallHeight / 2, roomCenter[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[wallThickness, wallHeight, room.length]} />
          <meshStandardMaterial
            color={isSelected ? '#7896B6' : MATERIAL_COLORS[room.wallMaterial] || '#F5F6F8'}
            roughness={0.7}
            wireframe={wireframe}
            transparent={cutaway}
            opacity={cutaway ? 0.6 : 1}
          />
        </mesh>
      </group>

      {/* 3D Room Label floating in space */}
      {showLabels && (
        <Html position={[roomCenter[0], floorElevation + wallHeight + 0.3, roomCenter[2]]} center distanceFactor={14}>
          <div className="bg-[#1E232B]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium border border-white/20 whitespace-nowrap pointer-events-none shadow-md">
            {room.name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Window 3D Mesh
const Window3D: React.FC<{ win: Window; floorElevation: number }> = ({ win, floorElevation }) => {
  const isRotated = win.rotation === 90 || win.rotation === 270;
  const lengthX = isRotated ? 0.2 : win.width;
  const lengthZ = isRotated ? win.width : 0.2;
  const posY = floorElevation + win.sillHeight + win.height / 2;

  return (
    <group position={[win.position.x, posY, win.position.z]}>
      {/* Translucent Glass Pane */}
      <mesh>
        <boxGeometry args={[lengthX, win.height, lengthZ]} />
        <meshPhysicalMaterial
          color="#A7C7E7"
          transmission={0.85}
          roughness={0.1}
          transparent
          opacity={0.65}
        />
      </mesh>
      {/* Aluminum / Charcoal Frame */}
      <mesh>
        <boxGeometry args={[lengthX + 0.05, win.height + 0.05, lengthZ + 0.05]} />
        <meshStandardMaterial color="#1E232B" roughness={0.3} wireframe />
      </mesh>
    </group>
  );
};

// Door 3D Mesh
const Door3D: React.FC<{ door: Door; floorElevation: number }> = ({ door, floorElevation }) => {
  const isRotated = door.rotation === 90 || door.rotation === 270;
  const lengthX = isRotated ? 0.15 : door.width;
  const lengthZ = isRotated ? door.width : 0.15;
  const posY = floorElevation + door.height / 2;

  return (
    <group position={[door.position.x, posY, door.position.z]}>
      <mesh castShadow>
        <boxGeometry args={[lengthX, door.height, lengthZ]} />
        <meshStandardMaterial color="#8D6E53" roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[isRotated ? 0.1 : door.width / 2 - 0.1, 0, isRotated ? door.width / 2 - 0.1 : 0.1]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Furniture Proxy Block in 3D
const Furniture3D: React.FC<{ item: FurnitureItem; floorElevation: number }> = ({ item, floorElevation }) => {
  return (
    <group
      position={[
        item.position.x + item.width / 2,
        floorElevation + item.height / 2,
        item.position.z + item.length / 2,
      ]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[item.width, item.height, item.length]} />
        <meshStandardMaterial color={item.color || '#4A5568'} roughness={0.8} />
      </mesh>
      {/* Cushion highlight for sofas/beds */}
      <mesh position={[0, item.height / 2 + 0.02, 0]}>
        <boxGeometry args={[item.width * 0.9, 0.04, item.length * 0.9]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Main Scene Component
const Scene: React.FC<{ design: HouseDesign }> = ({ design }) => {
  const {
    showRoof,
    showFurniture,
    showDimensions,
    showRoomLabels,
    wireframeMode,
    cutawayMode,
    cameraPreset,
    selection,
    setSelection,
  } = useDesignStudioStore();

  const plot = design.plot;
  const plotCenterX = plot.width / 2;
  const plotCenterZ = plot.length / 2;
  const floorHeight = 3.2;

  return (
    <>
      <CameraController target={[plotCenterX, 2.5, plotCenterZ]} preset={cameraPreset} />

      {/* Lighting System */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[plotCenterX + 20, 30, plotCenterZ - 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-plotCenterX - 15, 15, -plotCenterZ - 15]} intensity={0.4} />

      {/* CAD Studio Grid */}
      <Grid
        position={[plotCenterX, 0, plotCenterZ]}
        args={[plot.width * 2, plot.length * 2]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#262D38"
        sectionSize={2.0}
        sectionThickness={1.2}
        sectionColor="#3B4452"
        fadeDistance={50}
        fadeStrength={1.5}
      />

      {/* 1. Plot Base & Lawn */}
      <group position={[plotCenterX, -0.02, plotCenterZ]}>
        {/* Plot Lawn */}
        <mesh receiveShadow>
          <boxGeometry args={[plot.width, 0.04, plot.length]} />
          <meshStandardMaterial color="#2B3E32" roughness={0.9} />
        </mesh>
        {/* Plot Boundary Curb */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[plot.width + 0.2, 0.1, plot.length + 0.2]} />
          <meshStandardMaterial color="#1E232B" roughness={0.7} wireframe={wireframeMode} />
        </mesh>
      </group>

      {/* 2. Concrete Plinth / Foundation */}
      <mesh
        position={[plotCenterX, (design.foundationHeight || 0.45) / 2, plotCenterZ]}
        receiveShadow
        castShadow
      >
        <boxGeometry
          args={[
            Math.max(2, plot.width - (plot.setbacks.left + plot.setbacks.right)),
            design.foundationHeight || 0.45,
            Math.max(2, plot.length - (plot.setbacks.front + plot.setbacks.rear)),
          ]}
        />
        <meshStandardMaterial color="#8D949E" roughness={0.8} wireframe={wireframeMode} />
      </mesh>

      {/* 3. Floors & Rooms Geometry */}
      {design.floors.map((floor) => {
        const floorElevation = (design.foundationHeight || 0.45) + floor.floorLevel * floorHeight;

        return (
          <group key={floor.floorLevel}>
            {/* Rooms */}
            {floor.rooms.map((room) => (
              <Room3D
                key={room.id}
                room={room}
                floorElevation={floorElevation}
                isSelected={selection.type === 'room' && selection.id === room.id}
                wireframe={wireframeMode}
                cutaway={cutawayMode}
                showLabels={showRoomLabels}
                onSelect={() => setSelection('room', room.id)}
              />
            ))}

            {/* Doors */}
            {floor.doors.map((door) => (
              <Door3D key={door.id} door={door} floorElevation={floorElevation} />
            ))}

            {/* Windows */}
            {floor.windows.map((win) => (
              <Window3D key={win.id} win={win} floorElevation={floorElevation} />
            ))}

            {/* Furniture */}
            {showFurniture &&
              floor.furniture.map((item) => (
                <Furniture3D key={item.id} item={item} floorElevation={floorElevation} />
              ))}
          </group>
        );
      })}

      {/* 4. Roof Slab / Parapet */}
      {showRoof && !cutawayMode && (
        <group>
          {(() => {
            const topFloorIdx = design.floors.length - 1;
            const roofY = (design.foundationHeight || 0.45) + (topFloorIdx + 1) * floorHeight;
            const usableW = Math.max(4, plot.width - (plot.setbacks.left + plot.setbacks.right));
            const usableL = Math.max(4, plot.length - (plot.setbacks.front + plot.setbacks.rear));

            return (
              <mesh position={[plotCenterX, roofY + 0.1, plotCenterZ]} castShadow receiveShadow>
                <boxGeometry args={[usableW + 0.4, 0.2, usableL + 0.4]} />
                <meshStandardMaterial
                  color="#D7DCE2"
                  roughness={0.6}
                  wireframe={wireframeMode}
                />
              </mesh>
            );
          })()}
        </group>
      )}
    </>
  );
};

export const HouseViewer3D: React.FC = () => {
  const { design } = useDesignStudioStore();

  if (!design) return null;

  return (
    <div className="w-full h-full bg-[#171B22] relative select-none">
      <Canvas
        shadows
        camera={{ position: [design.plot.width + 12, 16, design.plot.length + 12], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        className="w-full h-full"
      >
        <color attach="background" args={['#171B22']} />
        <fog attach="fog" args={['#171B22', 30, 95]} />
        <Scene design={design} />
      </Canvas>
    </div>
  );
};
