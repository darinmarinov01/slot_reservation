export type ModalTypes = {
    children: React.ReactNode
    onClose?: () => void
    onConfirm?: () => void,
    onScroll?: () => void,
}