// sox.d.ts
declare module 'sox.js' {
    import { Readable } from "stream";

    export class SoxRecording {
        options: {
            sampleRate: number;
            channels: number;
            compress: boolean;
            threshold: number;
            silence: string;
            recorder: string;
            endOnSilence: boolean;
            audioType: string;
        };
        process: any; // You can define a more specific type if possible
        soxStream: Readable | null; // Use Readable from stream module

        constructor(options?: {
            sampleRate?: number;
            channels?: number;
            compress?: boolean;
            threshold?: number;
            silence?: string;
            recorder?: string;
            endOnSilence?: boolean;
            audioType?: string;
        });

        start(): SoxRecording;

        stop(): void;

        pause(): void;

        resume(): void;

        isPaused(): boolean | null; // Adjust return type based on actual implementation

        stream(): Readable;
    }
}
