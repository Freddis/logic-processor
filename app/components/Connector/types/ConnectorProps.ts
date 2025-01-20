export interface ConnectorProps {
  x: number,
  y: number,
  isHidden: boolean,
  color: string,
  id: string,
  onFocusOut?: () => void
  onFocus?: () => void
  onDrag?: () => void
  onDragStop?: () => void
}
