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
