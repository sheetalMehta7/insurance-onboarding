/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Razorpay test/sandbox Key ID. When unset, the app uses a mock gateway. */
  readonly VITE_RAZORPAY_KEY_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
