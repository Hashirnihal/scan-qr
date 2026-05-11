declare module 'qrcode' {
  interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    margin?: number
    width?: number
    color?: { dark?: string; light?: string }
  }
  function toDataURL(text: string, options?: QRCodeOptions): Promise<string>
  function toString(text: string, options?: QRCodeOptions): Promise<string>
  export = { toDataURL, toString }
}
