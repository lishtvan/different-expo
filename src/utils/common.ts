import { AsYouType } from 'libphonenumber-js';
import { NativeScrollEvent } from 'react-native';

export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export const delay = (ms: number = 500) => {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};

const getDynamicEndingAvailableListings = (number: number) => {
  if (number === 1) {
    return number + ' оголошення в наявності';
  } else if (number % 10 === 1 && number % 100 !== 11) {
    return number + ' оголошення в наявності';
  } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    return number + ' оголошення в наявності';
  } else {
    return number + ' оголошень в наявності';
  }
};

const getDynamicEndingSoldListings = (number: number) => {
  if (number === 1) {
    return number + ' річ продано';
  } else if (number % 10 === 1 && number % 100 !== 11) {
    return number + ' річ продано';
  } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    return number + ' речі продано';
  } else {
    return number + ' речей продано';
  }
};

export const getDynamicEndingShowButton = (number: number) => {
  if (number === 1) {
    return number + ' оголошення';
  } else if (number % 10 === 1 && number % 100 !== 11) {
    return number + ' оголошення';
  } else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
    return number + ' оголошення';
  } else {
    return number + ' оголошень';
  }
};

export const getDynamicEndingForListingsCount = (listingsCount: number, sold = false) => {
  return sold
    ? getDynamicEndingSoldListings(listingsCount)
    : getDynamicEndingAvailableListings(listingsCount);
};

export const transformPhone = {
  output: (text: string) => {
    return new AsYouType().input(text);
  },
};

export const fixedEncodeURIComponent = (str: string) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
};
