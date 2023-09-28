import React from 'react';
import { TextArea as TamaguiTextArea, TextAreaProps } from 'tamagui';

const TextArea = (props: TextAreaProps) => {
  return <TamaguiTextArea size="$4" borderRadius="$6" lineHeight={17} {...props} />;
};

export default TextArea;
