const TARGET_RATE = 16000;
const SEGMENT_SECONDS = 300;

function encodeWav(samples: Float32Array, sampleRate: number): File {
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const tag = (o: number, v: string) => {
    for (let i = 0; i < v.length; i++) view.setUint8(o + i, v.charCodeAt(i));
  };
  tag(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (const value of samples) {
    const s = Math.max(-1, Math.min(1, value));
    view.setInt16(offset, s * (s < 0 ? 32768 : 32767), true);
    offset += 2;
  }
  return new File([bytes], "chiamata.wav", { type: "audio/wav" });
}

function downsample(chunks: Float32Array[], fromRate: number): Float32Array {
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const all = new Float32Array(total);
  let o = 0;
  for (const c of chunks) {
    all.set(c, o);
    o += c.length;
  }
  if (fromRate <= TARGET_RATE) return all;
  const ratio = fromRate / TARGET_RATE;
  const out = new Float32Array(Math.floor(total / ratio));
  for (let i = 0; i < out.length; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(Math.floor((i + 1) * ratio), total);
    let sum = 0;
    for (let j = start; j < end; j++) sum += all[j] ?? 0;
    out[i] = sum / Math.max(end - start, 1);
  }
  return out;
}

export type Recording = { stop: () => Promise<File[]>; cancel: () => void; level: () => number };

export async function startRecording(): Promise<Recording> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true },
  });
  const context = new AudioContext();
  await context.resume();
  const source = context.createMediaStreamSource(stream);
  const node = context.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let lastLevel = 0;
  node.onaudioprocess = (event) => {
    const data = new Float32Array(event.inputBuffer.getChannelData(0));
    chunks.push(data);
    let peak = 0;
    for (const v of data) peak = Math.max(peak, Math.abs(v));
    lastLevel = peak;
  };
  source.connect(node);
  node.connect(context.destination);

  const cleanup = async () => {
    stream.getTracks().forEach((t) => t.stop());
    node.disconnect();
    source.disconnect();
    node.onaudioprocess = null;
    await context.close().catch(() => undefined);
  };

  return {
    level: () => lastLevel,
    cancel: () => void cleanup(),
    async stop() {
      const rate = context.sampleRate;
      await cleanup();
      const samples = downsample(chunks, rate);
      const outRate = Math.min(rate, TARGET_RATE);
      if (samples.length < outRate) throw new Error("Registrazione troppo breve: riprova.");
      const perSegment = outRate * SEGMENT_SECONDS;
      const files: File[] = [];
      for (let i = 0; i < samples.length; i += perSegment) {
        files.push(encodeWav(samples.subarray(i, i + perSegment), outRate));
      }
      return files;
    },
  };
}
