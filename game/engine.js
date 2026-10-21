// The game's engine bundle. Everything lives in core.js (which the simulator imports directly in Node);
// this file only adds PeerJS for Link Battle, which needs a browser.
export * from './core.js';
export {Peer} from 'peerjs';
