// Capture mono PCM at 16 kHz. No network, logging or persistence in this worklet.
class ChemistryMicrophone extends AudioWorkletProcessor {
  constructor() {
    super();
    this.position = 0;
    this.samples = [];
  }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (channel) {
      for (let i = 0; i < channel.length; i++) {
        this.position += 16000;
        if (this.position >= sampleRate) {
          this.position -= sampleRate;
          this.samples.push(Math.max(-1, Math.min(1, channel[i])));
        }
        if (this.samples.length === 2048) {
          const buffer = new ArrayBuffer(4096),
            view = new DataView(buffer);
          for (let n = 0; n < this.samples.length; n++)
            view.setInt16(n * 2, Math.round(this.samples[n] * 32767), true);
          this.port.postMessage(buffer, [buffer]);
          this.samples = [];
        }
      }
    }
    return true;
  }
}
registerProcessor("chemistry-microphone", ChemistryMicrophone);
