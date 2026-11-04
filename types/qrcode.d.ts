declare module "qrcode" {
  export function toBuffer(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<Buffer>;
  export function toDataURL(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<string>;
}
