import { Week } from './week';

export class Year {
	constructor(
		public number: number,
		public weeks: Week[],
	) { }
}
