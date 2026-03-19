// Tipos para Modal
import type { ReactNode } from "react";

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    size?: ModalSize;
    children: ReactNode;
    className?: string;
    headerClassName?: string;
    showHeaderAccent?: boolean;
    showCloseButton?: boolean;
}
