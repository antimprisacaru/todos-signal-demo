import { signalStoreFeature, withState } from '@ngrx/signals';

type RequestState = {
  loading: boolean;
  errors?: string[];
};

function withRequestStatus() {
  return signalStoreFeature(withState<RequestState>({ loading: false }));
}

function setLoading(): Partial<RequestState> {
  return { loading: true };
}

function setLoaded(): Partial<RequestState> {
  return { loading: false };
}

function setErrors(value: string[]): Partial<RequestState> {
  return { errors: value };
}

export { withRequestStatus, setLoading, setLoaded, setErrors };