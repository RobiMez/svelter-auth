declare module 'qrious' {
    interface QRiousOptions {
        background?: string;
        backgroundAlpha?: number;
        foreground?: string;
        foregroundAlpha?: number;
        level?: string;
        mime?: string;
        padding?: number;
        size?: number | string;
        value?: string;
    }

    class QRious {
        constructor(options?: QRiousOptions);
        set(options: QRiousOptions): void;
        toDataURL(type?: string): string;
    }

    export default QRious;
} 