// TODO: This is a WIP.
export interface IDisposable {
	dispose(): void;
}

export interface IService extends IDisposable {
	init(): void;
}
