import { useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const Mastercard = (props: any) => {
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
        d="M95 7.094A6.097 6.097 0 0 0 88.906 1H7.094A6.097 6.097 0 0 0 1 7.094v49.812A6.097 6.097 0 0 0 7.094 63h81.812A6.097 6.097 0 0 0 95 56.906V7.094Z"
        // @ts-ignore
        style={{
          fill: '#fff',
          stroke: '#b1b1b1',
          strokeWidth: '.5px',
        }}
      />
      <Path
        d="M95 6.894A5.897 5.897 0 0 0 89.106 1H6.894A5.897 5.897 0 0 0 1 6.894v50.212A5.897 5.897 0 0 0 6.894 63h82.212A5.897 5.897 0 0 0 95 57.106V6.894Z"
        // @ts-ignore
        style={{
          fill: '#fff',
          stroke: '#7e7e7e',
          strokeWidth: '.5px',
        }}
      />
      <Path
        d="M39.044 17.366h17.917v29.263H39.044z"
        // @ts-ignore
        style={{
          fill: '#ff5f00',
        }}
      />
      <Path
        d="M40.89 32a18.588 18.588 0 0 1 7.107-14.629 18.614 18.614 0 0 0-11.498-3.978c-10.209 0-18.61 8.401-18.61 18.61 0 10.208 8.401 18.609 18.61 18.609 4.169 0 8.22-1.401 11.498-3.978A18.592 18.592 0 0 1 40.89 32Z"
        // @ts-ignore
        style={{
          fill: '#eb001b',
          fillRule: 'nonzero',
        }}
      />
      <Path
        d="M76.33 43.533v-.6h.259v-.124h-.615v.124h.242v.6h.114Zm1.194 0v-.724h-.186l-.217.517-.217-.517h-.186v.724h.134v-.548l.202.47h.139l.202-.47v.548h.129ZM78.108 32c0 10.209-8.4 18.609-18.609 18.609a18.613 18.613 0 0 1-11.502-3.98 18.62 18.62 0 0 0 7.111-14.632 18.618 18.618 0 0 0-7.111-14.631 18.613 18.613 0 0 1 11.502-3.98c10.209 0 18.609 8.4 18.609 18.609V32Z"
        // @ts-ignore
        style={{
          fill: '#f79e1b',
          fillRule: 'nonzero',
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
        d="M235.31 16.564c0-8.089-6.797-14.656-15.169-14.656H16.49c-8.372 0-15.169 6.567-15.169 14.656v119.803c0 8.09 6.797 14.657 15.169 14.657h203.651c8.372 0 15.169-6.567 15.169-14.657V16.564Z"
        // @ts-ignore
        style={{
          fill: '#343434',
        }}
        transform="matrix(.40173 0 0 .41578 .47 .207)"
      />
      <Path
        d="M48.37 15.14h34.66v56.61H48.37z"
        // @ts-ignore
        style={{
          fill: '#f9f9f9',
        }}
        transform="matrix(.51693 0 0 .51693 14.04 9.54)"
      />
      <Path
        d="M120.5 65.76V64.6h.5v-.24h-1.19v.24h.47v1.16h.22Zm2.31 0v-1.4h-.36l-.42 1-.42-1h-.36v1.4h.26V64.7l.39.91h.27l.39-.91v1.06h.25ZM123.94 43.45c0 19.749-16.251 35.999-36 35.999a36.006 36.006 0 0 1-22.25-7.699 36.022 36.022 0 0 0 13.755-28.305A36.022 36.022 0 0 0 65.69 15.14a36.006 36.006 0 0 1 22.25-7.699c19.749 0 36 16.25 36 35.999v.01Z"
        // @ts-ignore
        style={{
          fill: '#f9f9f9',
          fillRule: 'nonzero',
        }}
        transform="matrix(.51693 0 0 .51693 14.04 9.54)"
      />
      <Path
        d="M51.94 43.45a35.964 35.964 0 0 1 13.75-28.3 36.008 36.008 0 0 0-22.245-7.695c-19.749 0-36 16.251-36 36s16.251 36 36 36A36.008 36.008 0 0 0 65.69 71.76a35.962 35.962 0 0 1-13.75-28.31Z"
        // @ts-ignore
        style={{
          fill: '#dedede',
          fillRule: 'nonzero',
        }}
        transform="matrix(.51693 0 0 .51693 14.04 9.54)"
      />
    </Svg>
  );
};
