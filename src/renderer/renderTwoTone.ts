import {
  FrameOptions,
  UserFacingFrameOptions,
  defaultFrameOptions,
  generateFrame,
} from '../Frame.js';
import { WithRequired } from '../utils.js';

interface TwoToneRenderOptions extends FrameOptions {
  readonly solidCharacter: string;
  readonly solidTopCharacter: string;
  readonly solidBottomCharacter: string;
  readonly emptyCharacter: string;
}

/**
 * Renders a QR code with 4 different characters (to compact size)
 * @param options - The character types you would like, level, or more.
 * If you have no preferences, use a string.
 *
 * @returns A QR code in text format.
 */
export const renderTwoTone = (
  options: Readonly<UserFacingFrameOptions<TwoToneRenderOptions>> | string
): string => {
  const processedOptions: WithRequired<TwoToneRenderOptions, 'value'> = {
    ...defaultFrameOptions,
    solidCharacter: '█',
    solidTopCharacter: '▀',
    solidBottomCharacter: '▄',
    emptyCharacter: ' ',
    ...(typeof options === 'string' ? { value: options } : options),
  };

  const frame = generateFrame(processedOptions);

  let str = '';

  for (let i = 0; i < frame.size; i += 2) {
    for (let j = 0; j < frame.size; j++) {
      const topExists = frame.buffer[i * frame.size + j];
      const bottomExists = frame.buffer[(i + 1) * frame.size + j];

      if (topExists && bottomExists) {
        str += processedOptions.solidCharacter;
      } else if (!topExists && bottomExists) {
        str += processedOptions.solidBottomCharacter;
      } else if (topExists && !bottomExists) {
        str += processedOptions.solidTopCharacter;
      } else {
        str += processedOptions.emptyCharacter;
      }
    }
    if (i !== frame.size - 1) {
      str += '\n';
    }
  }

  return str;
};
