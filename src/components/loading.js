import React from "react";
import styled, { keyframes } from "styled-components";

const scaleAnimation = keyframes`
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  } 35% {
    transform: scale3D(0, 0, 1);
  } 
`;

const LoaderContainer = styled.div`
  display: flex;

`;

const CubeContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 15vmax;
  justify-content: center;
  padding-bottom: 1px;
  width: 15vmax;
`;

const Cube = styled.div`
  animation: ${scaleAnimation} 1.3s ${({ index }) => index * 50}ms ease infinite;
  background-color: ${({ color }) => color};
  border-radius: 1px;
  box-shadow: 0 0 2px #000;
  height: 33%;
  width: 33%;
`;

function Loading({ color = "black" }) {
  return (
    <LoaderContainer>
      <CubeContainer>
        {[...Array(9)].map((_, index) => (
          <Cube index={index} color={color} key={`${index}`} />
        ))}
      </CubeContainer>
    </LoaderContainer>
  );
}

export default Loading;
