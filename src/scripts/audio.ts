import { Audio, AudioListener, AudioLoader } from "three";

export function playBgm1(listener: AudioListener) {
    const filter = listener.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 50;

    const sound = new Audio(listener);
    new AudioLoader().load("assets/sound/drone4.ogg", buffer => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
        sound.setFilter(filter);
        sound.play();
    });

    return filter;
}

export function playBgm2(listener: AudioListener) {
    const filter = listener.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 50;

    const sound = new Audio(listener);
    new AudioLoader().load("assets/sound/drone4.ogg", buffer => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0);
        sound.setFilter(filter);
        sound.play();
    });

    return { filter, sound };
}

export function playFootstep(listener: AudioListener) {
    new AudioLoader().load("assets/sound/footstep.mp3", buffer => {
        const dest = listener.context.createMediaStreamDestination();
        const source = listener.context.createBufferSource();
        source.buffer = buffer;
        source.detune.value = (Math.random() - 0.5) * 200;

        // const lowpass = listener.context.createBiquadFilter();
        // lowpass.frequency.value = 100;
        // lowpass.type = "lowpass";

        const reverb = listener.context.createConvolver();
        reverb.buffer = impulseResponse(1, 3, false, listener.context);

        const gain = listener.context.createGain();
        gain.gain.value = 0.2;

        source.connect(gain);
        gain.connect(reverb);
        gain.connect(dest);
        reverb.connect(dest);

        new Audio(listener).setMediaStreamSource(dest.stream);

        source.start();
    });
}

//https://stackoverflow.com/a/22538980
function impulseResponse(duration: number, decay: number, reverse: boolean, context: AudioContext) {
    var sampleRate = context.sampleRate;
    var length = sampleRate * duration;
    var impulse = context.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++) {
        var n = reverse ? length - i : i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
}
