import { styled } from '@mui/material'

function LogoLoader() {
  return (
    <Container>
      <div className="oring">
        <img
          src="/conteo-logo.svg"
          className="logo-effect"
          width="40%"
          height="40%"
          alt="Conteo Logo"
        />
        <span className="loader-span"></span>
      </div>
    </Container>
  )
}

export default LogoLoader

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;

  .oring {
    position: absolute;
    width: 60px;
    height: 60px;
    border: 3px solid #3c3c3c;
    border-radius: 50%;
    text-align: center;
    display: flex;
    place-items: center;
    place-content: center;
  }
  .oring:before {
    content: '';
    position: absolute;
    width: 110%;
    height: 110%;
    border: 3px solid transparent;
    border-top: 3px solid #1993d0;
    border-right: 3px solid #1993d0;
    border-radius: 50%;
    animation: animateC 2s linear infinite;
  }
  .loader-span {
    display: block;
    position: absolute;
    top: calc(50% - 2px);
    left: 50%;
    width: 50%;
    height: 4px;
    background: transparent;
    /* transform-origin: left; */

    animation: animateB 3s linear infinite;
  }
`
