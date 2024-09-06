import { Box, styled } from '@mui/material'

type Logo = {
  width?: number | string
  height?: number | string
}

const ConteoLogo = (props: Logo) => (
  <Container
    className="logo-container"
    sx={{
      width: { sm: props.width ?? '80px' },
      height: { sm: props.height ?? '80px' },
      position: 'relative',
    }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      }}
      viewBox="0 0 3124.99 3124.99"
      {...props}>
      <defs>
        <clipPath id="id0">
          <path d="M2090.38 1418.2c-224.31-12.45-406.5-244.82-406.5-546.82 0-1439.86 2056.19 645.37-26 645.37-27.3 0-49.63-30.04-49.63-66.76 0-2420.41 825.77-12.72 482.13-31.79z" />
        </clipPath>
        <clipPath id="id3">
          <path d="M780.09 1403.14c347.85-14.35 630.37-282.22 630.37-630.37 0-1659.85-3188.54 743.98 40.31 743.98 42.33 0 76.96-34.63 76.96-76.96 0-2790.22-1280.52-14.66-747.65-36.65z" />
        </clipPath>
        <mask id="id1">
          <linearGradient
            id="id2"
            x1={1235.89}
            x2={1235.89}
            y1={1219.02}
            y2={368.9}
            gradientUnits="userSpaceOnUse">
            <stop
              offset={0}
              style={{
                stopOpacity: 0,
                stopColor: 'white',
              }}
            />
            <stop
              offset={1}
              style={{
                stopOpacity: 1,
                stopColor: 'white',
              }}
            />
          </linearGradient>
          <path
            d="M1230.68 323.37h651.78v1219.84h-651.78z"
            style={{
              fill: 'url(#id2)',
            }}
          />
        </mask>
        <mask id="id4">
          <linearGradient
            id="id5"
            x1={1129.61}
            x2={1129.61}
            y1={1229.24}
            y2={179.05}
            gradientUnits="userSpaceOnUse">
            <stop
              offset={0}
              style={{
                stopOpacity: 0,
                stopColor: 'white',
              }}
            />
            <stop
              offset={1}
              style={{
                stopOpacity: 1,
                stopColor: 'white',
              }}
            />
          </linearGradient>
          <path
            d="M1124.4 133.53h651.78v1219.84H1124.4z"
            style={{
              fill: 'url(#id5)',
            }}
          />
        </mask>
        <style>
          {'.fil2{fill:none}.fil3{fill:#1993d0}.fil0{fill:#53afdc}'}
        </style>
      </defs>
      <g id="Layer_x0020_1">
        <g id="_2288710492608">
          <path
            d="M2090.38 1418.2c-224.31-12.45-406.5-244.82-406.5-546.82 0-1439.86 2056.19 645.37-26 645.37-27.3 0-49.63-30.04-49.63-66.76 0-2420.41 825.77-12.72 482.13-31.79z"
            className="fil0"
          />
          <g
            style={{
              clipPath: 'url(#id0)',
            }}>
            <path
              d="M1235.89 328.58h641.36v1209.43h-641.36z"
              style={{
                mask: 'url(#id1)',
                fill: '#0a3148',
              }}
            />
          </g>
          <path
            d="M2090.38 1418.2c-224.31-12.45-406.5-244.82-406.5-546.82 0-1439.86 2056.19 645.37-26 645.37-27.3 0-49.63-30.04-49.63-66.76 0-2420.41 825.77-12.72 482.13-31.79z"
            className="fil2"
          />
          <path
            d="M2344.9 1721.85c-347.85 14.35-630.37 282.22-630.37 630.37 0 1659.85 3188.54-743.98-40.31-743.98-42.33 0-76.96 34.63-76.96 76.96 0 2790.22 1280.52 14.66 747.65 36.65zM780.09 1403.14c347.85-14.35 630.37-282.22 630.37-630.37 0-1659.85-3188.54 743.98 40.31 743.98 42.33 0 76.96-34.63 76.96-76.96 0-2790.22-1280.52-14.66-747.65-36.65z"
            className="fil3"
          />
          <g
            style={{
              clipPath: 'url(#id3)',
            }}>
            <path
              d="M1129.61 138.74h641.36v1209.43h-641.36z"
              style={{
                mask: 'url(#id4)',
                fill: '#0f5277',
              }}
            />
          </g>
          <path
            d="M780.09 1403.14c347.85-14.35 630.37-282.22 630.37-630.37 0-1659.85-3188.54 743.98 40.31 743.98 42.33 0 76.96-34.63 76.96-76.96 0-2790.22-1280.52-14.66-747.65-36.65z"
            className="fil2"
          />
          <path
            d="M841.63 1686.81c314.11 9.93 569.22 195.17 569.22 435.92 0 1147.85-2879.22-514.48 36.4-514.48 38.22 0 69.5 23.95 69.5 53.22 0 1929.53-1156.31 10.14-675.12 25.35z"
            className="fil0"
          />
        </g>
      </g>
    </svg>
  </Container>
)

const Container = styled(Box)``
export default ConteoLogo
