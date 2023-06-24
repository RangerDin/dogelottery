declare module "@metamask/jazzicon" {
  declare function createJazzicon(diameter: number, seed: string): SVGAElement;

  export default createJazzicon;
}
