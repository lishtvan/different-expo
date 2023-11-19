import { Text } from 'tamagui';

export const InputValidationError = ({ message }: { message: string }) => (
  <Text className="my-1 ml-2 text-red-600">{message}</Text>
);

export const validationErrors = {
  required: <InputValidationError message="Це поле є обовʼязковим." />,
  pattern: <InputValidationError message="Дозволено лише a-z, 0-9 та підкреслення." />,
  minLength: <InputValidationError message="Занадто коротко." />,
  maxLength: <InputValidationError message="Занадто довго." />,
  min: <InputValidationError message="Занадто мало." />,
  max: <InputValidationError message="Занадто багато." />,
};
