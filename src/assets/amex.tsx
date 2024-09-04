import { useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const Amex = (props: any) => {
  const isLightTheme = useColorScheme() === 'light';

  return isLightTheme ? (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 1.5,
      }}
      viewBox="0 0 96 64"
      {...props}
    >
      <Path
        d="M95 7.053A6.056 6.056 0 0 0 88.947 1H7.053A6.056 6.056 0 0 0 1 7.053v49.894A6.056 6.056 0 0 0 7.053 63h81.894A6.056 6.056 0 0 0 95 56.947V7.053Z"
        // @ts-ignore
        style={{
          fill: '#006fcf',
          stroke: '#7e7e7e',
          strokeWidth: '.5px',
        }}
      />
      <Path
        d="M54.459 9.71 44.055 33.319h8.342v21.172h26.31l4.061-4.51 4.063 4.534h7.933v-2.672h-6.538l-5.395-5.867-5.44 5.88H55.303V33.412h22.202l5.408 5.938 5.476-5.963h6.352v-2.626h-4.935V17.992L85.12 30.691h-4.45l-4.823-12.608V30.73H65.301l-1.49-3.637h-8.559l-1.457 3.589h-5.544l8.116-18.39h6.498l8.058 18.438V12.287h7.875l4.161 11.351 4.127-11.364 7.714.003V9.621h-9.767l-2.048 5.839-2.2-5.8H68.233l-.077 7.83-3.474-7.76-10.223-.02Z"
        // @ts-ignore
        style={{
          fill: '#fff',
        }}
      />
      <Path
        d="m59.526 16.941-2.53 5.961h5.011l-2.481-5.961ZM60.312 37.605h10.641v-4.147l8.738 9.184-8.621 9.204h-.101v-4.221H60.3V44.72h10.397v-4.077H60.3l.012-3.038ZM94.723 47.865v3.969l-8.581-9.23 8.59-9.225v3.95l-4.946 5.265 4.937 5.271Z"
        // @ts-ignore
        style={{
          fill: '#fff',
        }}
      />
    </Svg>
  ) : (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }}
      viewBox="0 0 96 64"
      {...props}
    >
      <Path
        d="M235.31 16.467c0-8.036-6.752-14.559-15.068-14.559H16.389c-8.317 0-15.068 6.523-15.068 14.559v119.998c0 8.035 6.751 14.559 15.068 14.559h203.853c8.316 0 15.068-6.524 15.068-14.559V16.467Z"
        // @ts-ignore
        style={{
          fill: '#343434',
        }}
        transform="matrix(.40173 0 0 .41578 .47 .207)"
      />
      <Path
        d="M54.367 9.71 43.963 33.319h8.342v21.172h26.31l4.061-4.51 4.063 4.534h7.933v-2.672h-6.539l-5.394-5.867-5.44 5.88H55.211V33.412h22.201l5.409 5.938 5.476-5.963h6.352v-2.626h-4.936V17.992l-4.685 12.699h-4.45l-4.823-12.608V30.73H65.209l-1.49-3.637H55.16l-1.457 3.589h-5.544l8.115-18.39h6.499l8.058 18.438V12.287h7.874l4.161 11.351 4.128-11.364 7.714.003V9.621H84.94l-2.047 5.839-2.201-5.8H68.141l-.077 7.83-3.474-7.76-10.223-.02Z"
        // @ts-ignore
        style={{
          fill: '#f9f9f9',
        }}
        transform="matrix(1 0 0 1 .092 0)"
      />
      <Path
        d="m59.434 16.941-2.53 5.961h5.011l-2.481-5.961ZM60.22 37.605h10.641v-4.147l8.738 9.184-8.621 9.204h-.101v-4.221H60.208V44.72h10.396v-4.077H60.208l.012-3.038ZM94.631 47.865v3.969l-8.581-9.23 8.589-9.225v3.95l-4.945 5.265 4.937 5.271Z"
        // @ts-ignore
        style={{
          fill: '#f9f9f9',
        }}
        transform="matrix(1 0 0 1 .092 0)"
      />
    </Svg>
  );
};
