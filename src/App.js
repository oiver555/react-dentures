import React, {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  Suspense,
} from "react";
import {
  Environment,
  Html,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";
import { useDrag, } from "react-use-gesture";

export default function App(props) {
  const { nodes } = useGLTF("./gltf/Teeth_Rig.gltf");
  const rootCtrl = useRef();
  const tongue = useRef();
  const { scene } = useThree();

  const [htmlData, setHtmlData] = useState({
    location: [0, 0, 0],
    text: "",
    visible: false,
  });
  const [hover, setHover] = useState({
    tongue: false,
    bottomGum: false,
    topGum: false,
    bottomLeftCanine: false,
    bottomLeftFirstIncisor: false,
    bottomLeftFirstMolar: false,
    bottomLeftFirstPremolar: false,
    bottomLeftSecondIncisor: false,
    bottomLeftSecondMolar: false,
    bottomLeftSecondPremolar: false,
    bottomLeftThirdMolar: false,
    bottomRightCanine: false,
    bottomRightFirstIncisor: false,
    bottomRightFirstMolar: false,
    bottomRightFirstPremolar: false,
    bottomRightSecondIncisor: false,
    bottomRightSecondMolar: false,
    bottomRightSecondPremolar: false,
    bottomRightThirdMolar: false,
    topLeftCanine: false,
    topLeftCentralIncisor: false,
    topLeftFirstMolar: false,
    topLeftFirstPremolar: false,
    topLeftLateralIncisor: false,
    topLeftSecondMolar: false,
    topLeftSecondPremolar: false,
    topLeftThirdMolar: false,
    topRightCanine: false,
    topRightCentralIncisor: false,
    topRightFirstMolar: false,
    topRightFirstPremolar: false,
    topRightLateralIncisor: false,
    topRightSecondMolar: false,
    topRightSecondPremolar: false,
    topRightThirdMolar: false,
  });
  const [colorTex, glossTex, norTex,  ] = useTexture([
    "/textures/TeethTongueSet_GEN2_COLOR.png",
    "/textures/TeethTongueSet_GEN2_GLOSS.png",
    "/textures/TeethTongueSet_GEN2_NORMAL.png",
    "/textures/TeethTongueSet_GEN2_Saliva_MASK.png",
    "/textures/TeethTongueSet_GEN2_Saliva_NORMAL.png",
  ]);
  colorTex.flipY = false;
  norTex.flipY = false;
  glossTex.flipY = false;
  colorTex.colorSpace = THREE.SRGBColorSpace;
  const [rotationTeeth, rotationCtrl] = useSpring(() => ({
    from: { rotate: 0 },
    to: { rotate: 6.25 },
    config: {
      duration: 10000,
      precision: 0.0000001,
    },
    loop: true, // Reset the animation when it reaches the end
    immediate: false,
    pause: true,
  }));
  useLayoutEffect(() => {
    tongue.current?.updateMorphTargets();
  });
  const rotationBind = useDrag(
    ({
      down,
      delta: [deltaX, deltaY],
      offset: [ox, oy],
      direction: [dx, dy],
    }) => {
      stopRotation();
      const topGumJnt = scene.getObjectByName("top_jaw_1_jnt");
      const teethGroup = scene.getObjectByName("teeth_group");

      // HANDLES TOP GUM ROTATION
      if (
        topGumJnt.rotation.z + deltaY * -0.009 > -0.745 &&
        topGumJnt.rotation.z + deltaY * -0.009 < -0.345 &&
        hover.topGum
      ) {
        topGumJnt.rotation.z = topGumJnt.rotation.z + deltaY * -0.009;
      }
      // HANDLES MODEL ROTATION
      teethGroup.rotation.y = teethGroup.rotation.y + deltaX * 0.01;
    }
  );

  const tongueBind = useDrag(({ delta: [deltaX, deltaY], down }) => {
    if (down) {
      tongue.current.morphTargetInfluences[0] = [1, 0, 0, 0, 1];
    }
    console.log(tongue.current);
  });
  const rotationBottomJawBind = useDrag(({ delta: [deltaX, deltaY] }) => {
    stopRotation();
    const teethGroup = scene.getObjectByName("teeth_group");

    // HANDLES MODEL ROTATION
    teethGroup.rotation.y = teethGroup.rotation.y + deltaX * 0.01;
  });

  const mainMat = new THREE.MeshStandardMaterial({
    map: colorTex,
    normalScale: new THREE.Vector2(2, 2),
    normalMap: norTex,
    opacity: 1,
    transparent: true,
    metalness: 0.1,
    metalnessMap: glossTex,
    roughnessMap: glossTex,
    roughness: 0.5,
    envMapIntensity: 1,
  });
  const selectionMat = new THREE.MeshStandardMaterial({
    color: "gold",
    opacity: 1,
    transparent: true,
  });

  useEffect(() => {
    startRotation();
  }, []);

  const startRotation = () => {
    setHtmlData({ text: "", location: [0, 0, 0], visible: false });
    // rotationCtrl.start();
    // rotationCtrl.resume();
  };
  const stopRotation = () => {
    rotationCtrl.pause();
  };
  const select = (target) => {
    const hoverKeys = Object.keys(hover);
    const newHoverData = hoverKeys.reduce((aggr, curr, index) => {
      target === curr ? (aggr[curr] = true) : (aggr[curr] = false);
      return aggr;
    }, {});

    setHover(newHoverData);
  };

  const deSelectAll = () => {
    setHtmlData({ text: "", location: [0, 0, 0], visible: false });
    setHover({
      tongue: false,
      bottomGum: false,
      topGum: false,
      bottomLeftCanine: false,
      bottomLeftFirstIncisor: false,
      bottomLeftFirstMolar: false,
      bottomLeftFirstPremolar: false,
      bottomLeftSecondIncisor: false,
      bottomLeftSecondMolar: false,
      bottomLeftSecondPremolar: false,
      bottomLeftThirdMolar: false,
      bottomRightCanine: false,
      bottomRightFirstIncisor: false,
      bottomRightFirstMolar: false,
      bottomRightFirstPremolar: false,
      bottomRightSecondIncisor: false,
      bottomRightSecondMolar: false,
      bottomRightSecondPremolar: false,
      bottomRightThirdMolar: false,
      topLeftCanine: false,
      topLeftCentralIncisor: false,
      topLeftFirstMolar: false,
      topLeftFirstPremolar: false,
      topLeftLateralIncisor: false,
      topLeftSecondMolar: false,
      topLeftSecondPremolar: false,
      topLeftThirdMolar: false,
      topRightCanine: false,
      topRightCentralIncisor: false,
      topRightFirstMolar: false,
      topRightFirstPremolar: false,
      topRightLateralIncisor: false,
      topRightSecondMolar: false,
      topRightSecondPremolar: false,
      topRightThirdMolar: false,
    });
  };

  useEffect(() => {
    rootCtrl.current = scene.getObjectByName("root");
  }, [scene]);

  return (
    <animated.group {...props} dispose={null} rotation-y={rotationTeeth.rotate}>
      <Suspense>
        <Environment files="/textures/photo_studio.hdr" />
      </Suspense>
      <animated.group name={"teeth_group"}>
        <primitive object={nodes.root} />
        {htmlData.visible && (
          <Html
            pointerEvents="none"
            zIndexRange={[0, 0]}
            center
            position={htmlData.location}
            as="div"
            sprite
            style={{
              pointerEvents: "none",
              textWrap: "nowrap",
              fontSize: "15px",
              background: "rgba(255,255,255,.5)",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {htmlData.text}
          </Html>
        )}
        <group position={[0, -160.84, -5.088]}>
          <skinnedMesh
            {...rotationBottomJawBind()}
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomGum");
              stopRotation();
            }}
            onPointerLeave={(e) => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Gum",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.Bottom_Gum.geometry}
            material={hover.bottomGum ? selectionMat : mainMat}
            skeleton={nodes.Bottom_Gum.skeleton}
          />

          {/* <skinnedMesh
          geometry={nodes.Bottom_Saliva.geometry}
          material={mainMat}
          skeleton={nodes.Bottom_Saliva.skeleton}
        /> */}
          <skinnedMesh
            name={"Tongue"}
            {...tongueBind()}
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("tongue");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "tongue",
                location: e.point,
                visible: true,
              });
            }}
            ref={tongue}
            material={hover.tongue ? selectionMat : mainMat}
            geometry={nodes.Tongue.geometry}
            skeleton={nodes.Tongue.skeleton}
          />
          <skinnedMesh
            {...rotationBind()}
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topGum");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Gum",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.Top_Gum.geometry}
            material={hover.topGum ? selectionMat : mainMat}
            skeleton={nodes.Top_Gum.skeleton}
          />
          {/* <skinnedMesh
          geometry={nodes.Top_Saliva.geometry}
          material={mainMat}
          skeleton={nodes.Top_Saliva.skeleton}
        /> */}

          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftCanine");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftCanine");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left Canine",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_canine.geometry}
            material={hover.bottomLeftCanine ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_canine.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left First Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_first_incisor.geometry}
            material={hover.bottomLeftFirstIncisor ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_first_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left First Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_first_molar.geometry}
            material={hover.bottomLeftFirstMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_first_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftFirstPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left First Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_first_premolar.geometry}
            material={hover.bottomLeftFirstPremolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_first_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left Second Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_second_incisor.geometry}
            material={hover.bottomLeftSecondIncisor ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_second_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left Second Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_second_molar.geometry}
            material={hover.bottomLeftSecondMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_second_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftSecondPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left Second Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_second_premolar.geometry}
            material={hover.bottomLeftSecondPremolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_second_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftThirdMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomLeftThirdMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Left Third Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_left_third_molar.geometry}
            material={hover.bottomLeftThirdMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_left_third_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightCanine");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightCanine");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right Canine",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_canine.geometry}
            material={hover.bottomRightCanine ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_canine.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right First Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_first_incisor.geometry}
            material={hover.bottomRightFirstIncisor ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_first_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right First Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_first_molar.geometry}
            material={hover.bottomRightFirstMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_first_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightFirstPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right First Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_first_premolar.geometry}
            material={hover.bottomRightFirstPremolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_first_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right Second Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_second_incisor.geometry}
            material={hover.bottomRightSecondIncisor ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_second_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right Second Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_second_molar.geometry}
            material={hover.bottomRightSecondMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_second_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightSecondPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right Second Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_second_premolar.geometry}
            material={hover.bottomRightSecondPremolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_second_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightThirdMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("bottomRightThirdMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Bottom Right Third Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.bottom_right_third_molar.geometry}
            material={hover.bottomRightThirdMolar ? selectionMat : mainMat}
            skeleton={nodes.bottom_right_third_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftCanine");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftCanine");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Canine",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_canine.geometry}
            material={hover.topLeftCanine ? selectionMat : mainMat}
            skeleton={nodes.top_left_canine.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftCentralIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftCentralIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Central Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_central_incisor.geometry}
            material={hover.topLeftCentralIncisor ? selectionMat : mainMat}
            skeleton={nodes.top_left_central_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftFirstMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftFirstMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left First Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_first_molar.geometry}
            material={hover.topLeftFirstMolar ? selectionMat : mainMat}
            skeleton={nodes.top_left_first_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftFirstPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftFirstPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left First Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_first_premolar.geometry}
            material={hover.topLeftFirstPremolar ? selectionMat : mainMat}
            skeleton={nodes.top_left_first_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftLateralIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftLateralIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Lateral Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_lateral_incisor.geometry}
            material={hover.topLeftLateralIncisor ? selectionMat : mainMat}
            skeleton={nodes.top_left_lateral_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftSecondMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftSecondMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Second Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_second_molar.geometry}
            material={hover.topLeftSecondMolar ? selectionMat : mainMat}
            skeleton={nodes.top_left_second_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftSecondPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftSecondPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Second Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_seoond_premolar.geometry}
            material={hover.topLeftSecondPremolar ? selectionMat : mainMat}
            skeleton={nodes.top_left_seoond_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftThirdMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topLeftThirdMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Left Third Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_left_third_molar.geometry}
            material={hover.topLeftThirdMolar ? selectionMat : mainMat}
            skeleton={nodes.top_left_third_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightCanine");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightCanine");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Canine",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_canine.geometry}
            material={hover.topRightCanine ? selectionMat : mainMat}
            skeleton={nodes.top_right_canine.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightCentralIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightCentralIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Central Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_central_incisor.geometry}
            material={hover.topRightCentralIncisor ? selectionMat : mainMat}
            skeleton={nodes.top_right_central_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightFirstMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightFirstMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right First Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_first_molar.geometry}
            material={hover.topRightFirstMolar ? selectionMat : mainMat}
            skeleton={nodes.top_right_first_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightFirstPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightFirstPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right First Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_first_premolar.geometry}
            material={hover.topRightFirstPremolar ? selectionMat : mainMat}
            skeleton={nodes.top_right_first_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightLateralIncisor");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightLateralIncisor");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Lateral Incisor",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_lateral_incisor.geometry}
            material={hover.topRightLateralIncisor ? selectionMat : mainMat}
            skeleton={nodes.top_right_lateral_incisor.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightSecondMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightSecondMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Second Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_second_molar.geometry}
            material={hover.topRightSecondMolar ? selectionMat : mainMat}
            skeleton={nodes.top_right_second_molar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightSecondPremolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightSecondPremolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Second Premolar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_seoond_premolar.geometry}
            material={hover.topRightSecondPremolar ? selectionMat : mainMat}
            skeleton={nodes.top_right_seoond_premolar.skeleton}
          />
          <skinnedMesh
            onPointerEnter={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightThirdMolar");
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              stopRotation();
              select("topRightThirdMolar");
            }}
            onPointerLeave={() => {
              startRotation();
              deSelectAll();
            }}
            onClick={(e) => {
              e.stopPropagation();
              setHtmlData({
                text: "Top Right Third Molar",
                location: e.point,
                visible: true,
              });
            }}
            geometry={nodes.top_right_third_molar.geometry}
            material={hover.topRightThirdMolar ? selectionMat : mainMat}
            skeleton={nodes.top_right_third_molar.skeleton}
          />
        </group>
      </animated.group>
    </animated.group>
  );
}

useGLTF.preload("./gltf/Teeth_Rig.gltf");