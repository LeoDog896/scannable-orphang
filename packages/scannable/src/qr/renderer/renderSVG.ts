import {
	FrameOptions,
	RenderOptionsDefaults,
	UserFacingFrameOptions,
	defaultFrameOptions,
	generateFrame,
} from '../Frame.js';

export interface SVGikeRenderOptions extends FrameOptions {
	readonly backgroundColor: string;
	readonly backgroundAlpha: number;
	readonly foregroundColor: string;
	readonly foregroundAlpha: number;
	readonly width: number;
	readonly height: number;
}

export const defaultSVGLikeRenderOptions: RenderOptionsDefaults<SVGikeRenderOptions> =
	Object.freeze({
		backgroundColor: 'white',
		backgroundAlpha: 1,
		foregroundColor: 'black',
		foregroundAlpha: 1,
		width: 100,
		height: 100,
		...defaultFrameOptions,
	});

/** Generates a style string based on the provided options. */
const generateStyle = (
	options: SVGikeRenderOptions,
	enabled: boolean
): string =>
	`fill:${
		enabled ? options.foregroundColor : options.backgroundColor
	};opacity:${enabled ? options.foregroundAlpha : options.backgroundAlpha}`;

/**
 * Renders a QR code into an SVG html string.
 *
 * @param options - the options to use for the frame.
 *
 * @returns The QR code html as a string
 */
export const renderSVG = (
	options: UserFacingFrameOptions<SVGikeRenderOptions> | string
): string => {
	const jsonOptions =
		typeof options === 'string' ? { value: options } : options;

	const processedOptions: SVGikeRenderOptions = {
		...defaultSVGLikeRenderOptions,
		...jsonOptions,
	};

	const frame = generateFrame(processedOptions);

	const moduleSizeWidth = processedOptions.width / frame.size;
	const moduleSizeHeight = processedOptions.height / frame.size;

	let rectangles: { x: number; y: number; enabled: boolean }[] = [];

	for (let i = 0; i < frame.size; i++) {
		for (let j = 0; j < frame.size; j++) {
			rectangles = [
				...rectangles,
				{
					x: moduleSizeWidth * i,
					y: moduleSizeHeight * j,
					enabled: frame.buffer[j * frame.size + i] === 1,
				},
			];
		}
	}

	return `<svg width="${processedOptions.width}" height="${
		processedOptions.height
	}" xmlns="http://www.w3.org/2000/svg">${rectangles
		.map(
			({ x, y, enabled }) =>
				`<rect width="${moduleSizeWidth}" height="${moduleSizeHeight}" x="${x}" y="${y}" style="${generateStyle(
					processedOptions,
					enabled
				)}"></rect>`
		)
		.join('')}</svg>`;
};
