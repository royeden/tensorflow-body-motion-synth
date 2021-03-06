// Thanks https://github.com/haldarmahesh/use-mobile-detect-hook/blob/master/src/index.js

export function mobileDetect () {
  const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
  const isAndroid = () => Boolean(userAgent.match(/Android/i));
  const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = () => Boolean(userAgent.match(/SSR/i));

  const isMobile = () =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = () => Boolean(!isMobile() && !isSSR());
  return {
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
    isSSR
  };
};

export const IS_MOBILE = mobileDetect().isMobile();
