import { signalStoreFeature, withState } from '@ngrx/signals';

type RequestState = {
  loading: boolean;
  error?: string;
};

export function withRequestStatus() {
  return signalStoreFeature(withState<RequestState>({ loading: false }));
}
