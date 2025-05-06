import storage from "store/storage";
import { useMMKVStorage } from "react-native-mmkv-storage";

export default function usePersistState<T>(name: string, defaultValue?: T) {
  return useMMKVStorage(name, storage, defaultValue);
}
