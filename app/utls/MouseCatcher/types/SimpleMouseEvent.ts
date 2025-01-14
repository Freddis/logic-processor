export interface SimpleMouseEvent{
  pageX: number,
  pageY: number,
  canvas: SVGSVGElement
  preventDefault: () => void,
}
