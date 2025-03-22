import { Event } from './event';

export class Week {
	constructor(
		public color: string,
		public number: number,
		public events: Event | null,
	) { }
}
