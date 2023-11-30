import { EmitterSubscription } from 'react-native';
import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    getConstants: () => {};
    getString: () => Promise<string>;
    getStrings: () => Promise<string[]>;
    setString: (content: string) => void;
    hasString: () => Promise<boolean>;
    hasNumber: () => Promise<boolean>;
    getImagePNG: () => Promise<string>;
    getImageJPG: () => Promise<string>;
    setImage: (content: string) => void;
    getImage: () => Promise<string>;
    setStrings: (content: string[]) => void;
    hasImage: () => Promise<boolean>;
    hasURL: () => Promise<boolean>;
    hasWebURL: () => Promise<boolean>;
}
declare const _default: Spec;
export default _default;
declare const addListener: (callback: () => void) => EmitterSubscription;
declare const removeAllListeners: () => void;
export { addListener, removeAllListeners };
