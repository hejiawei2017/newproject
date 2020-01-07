export const isIOS = () => {
  let u = navigator.userAgent;
  let result = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (result) {
    return true;
  } else {
    return false;
  }
};

export const isAndroid = () => {
  let u = navigator.userAgent;
  let result = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  if (result) {
    return true;
  } else {
    return false;
  }
};

export const isWechat = () => {
  let ua = navigator.userAgent;
  let result = ua.toLowerCase().indexOf('micromessenger') > -1;
  if (result) {
    return true;
  } else {
    return false;
  }
};

export const supportWebp =
  document
    .createElement('canvas')
    .toDataURL('image/webp')
    .indexOf('data:image/webp') === 0;
